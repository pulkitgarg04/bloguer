import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';

interface OverviewItem {
    postId: string;
    title: string;
    totalViews: number;
    last30dViews: number;
    comments: number;
    bookmarks: number;
    uniqueViews?: number;
    engagementRate?: number;
    published: boolean;
    date: string;
}

interface TimeseriesPoint {
    date: string;
    views: number;
}

export default function Analytics() {
    useAuthStore();
    const [items, setItems] = useState<OverviewItem[]>([]);
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
    const [detail, setDetail] = useState<{
        post: {
            id: string;
            title: string;
            totalViews: number;
            published: boolean;
            date: string;
        };
        timeseries: TimeseriesPoint[];
        comments: number;
        bookmarks: number;
        devices: { mobile: number; desktop: number; other: number };
        uniqueVisitors?: number;
        avgReadTimeSec?: number;
        sources?: { source: string; count: number }[];
        countries?: { country: string; count: number }[];
    } | null>(null);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [loadingOverview, setLoadingOverview] = useState(true);
    const [geo, setGeo] = useState<{ country: string; count: number }[]>([]);
    const [plotlyReady, setPlotlyReady] = useState(false);

    useEffect(() => {
        const loadOverview = async () => {
            try {
                setLoadingOverview(true);
                const token = localStorage.getItem('token');
                const res = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/analytics/overview`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                setItems(res.data.items || []);
            } catch {
                toast.error('Failed to load analytics overview');
            } finally {
                setLoadingOverview(false);
            }
        };

        loadOverview();

        const loadGeo = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/analytics/geo`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                setGeo(res.data.countries || []);
            } catch {
                // failed
            }
        };

        loadGeo();

        type PlotlyLike = {
            newPlot: (
                id: string,
                data: unknown,
                layout?: Record<string, unknown>,
                config?: Record<string, unknown>
            ) => void;
        };
        const w = window as unknown as { Plotly?: PlotlyLike };

        if (!w.Plotly) {
            const s = document.createElement('script');

            s.src = 'https://cdn.plot.ly/plotly-2.35.2.min.js';
            s.async = true;
            s.onload = () => setPlotlyReady(true);
            document.body.appendChild(s);
        } else {
            setPlotlyReady(true);
        }
    }, []);

    const loadDetail = async (postId: string) => {
        try {
            setLoadingDetail(true);
            setSelectedPostId(postId);
            const token = localStorage.getItem('token');
            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/analytics/post/${postId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setDetail(res.data);
        } catch {
            toast.error('Failed to load post analytics');
        } finally {
            setLoadingDetail(false);
        }
    };

    useEffect(() => {
        if (!plotlyReady) return;
        if (!geo || geo.length === 0) return;

        const I = Intl as unknown as {
            DisplayNames?: new (
                locales: string[],
                options: { type: 'region' }
            ) => { of: (code: string) => string | undefined };
        };
        const dn = I.DisplayNames
            ? new I.DisplayNames(['en'], { type: 'region' })
            : null;
        const locations = geo.map((g) => {
            if (dn) {
                try {
                    return dn.of(g.country) || g.country;
                } catch {
                    return g.country;
                }
            }

            return g.country;
        });
        const z = geo.map((g) => g.count);
        const data = [
            {
                type: 'choropleth',
                locationmode: 'country names',
                locations,
                z,
                colorscale: 'Reds',
                reversescale: false,
                showscale: true,
            },
        ];
        const layout: Record<string, unknown> = {
            margin: { t: 0, r: 0, l: 0, b: 0 },
            geo: { projection: { type: 'equirectangular' } },
        };
        const w = window as unknown as {
            Plotly?: {
                newPlot: (
                    id: string,
                    data: unknown,
                    layout?: Record<string, unknown>,
                    config?: Record<string, unknown>
                ) => void;
            };
        };

        w.Plotly?.newPlot('geoMap', data, layout, { displayModeBar: false });
    }, [plotlyReady, geo]);

    return (
        <div className="min-h-screen font-inter">
            <Navbar activeTab="Profile" />

            <section className="p-10">
                <h1 className="text-3xl font-semibold mb-6">
                    Analytics Dashboard
                </h1>
                <p className="text-gray-600 mb-8">
                    Insights for your posts. Click a row to view detailed
                    trends.
                </p>

                {loadingOverview ? (
                    <div className="space-y-6">
                        <div className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
                            <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
                            <div className="space-y-3">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                                        <div className="h-4 bg-gray-300 rounded w-1/6"></div>
                                        <div className="h-4 bg-gray-300 rounded w-1/6"></div>
                                        <div className="h-4 bg-gray-300 rounded w-1/6"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
                            <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
                            <div className="h-80 bg-gray-300 rounded"></div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead>
                            <tr className="bg-gray-50 text-left text-sm text-gray-600">
                                <th className="py-3 px-4">Title</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-4">Total Views</th>
                                <th className="py-3 px-4">Last 30 Days</th>
                                <th className="py-3 px-4">Unique</th>
                                <th className="py-3 px-4">Engagement %</th>
                                <th className="py-3 px-4">Comments</th>
                                <th className="py-3 px-4">Bookmarks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((it) => (
                                <tr
                                    key={it.postId}
                                    className="border-t hover:bg-gray-50 cursor-pointer"
                                    onClick={() => loadDetail(it.postId)}
                                >
                                    <td className="py-3 px-4">
                                        <div className="font-medium text-gray-900 line-clamp-1">
                                            {it.title}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {new Date(it.date).toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span
                                            className={`text-xs px-2 py-1 rounded ${it.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}
                                        >
                                            {it.published
                                                ? 'Published'
                                                : 'Not Published'}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        {it.totalViews}
                                    </td>
                                    <td className="py-3 px-4">
                                        {it.last30dViews}
                                    </td>
                                    <td className="py-3 px-4">
                                        {it.uniqueViews ?? '-'}
                                    </td>
                                    <td className="py-3 px-4">
                                        {it.engagementRate ?? 0}%
                                    </td>
                                    <td className="py-3 px-4">{it.comments}</td>
                                    <td className="py-3 px-4">
                                        {it.bookmarks}
                                    </td>
                                </tr>
                            ))}
                            {items.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="py-6 text-center text-gray-500"
                                    >
                                        No posts yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-10">
                    <h2 className="text-2xl font-semibold mb-4">
                        Audience by Country
                    </h2>
                    <div
                        id="geoMap"
                        className="w-full h-80 bg-white border border-gray-200 rounded-lg flex items-center justify-center"
                    >
                        {geo.length === 0 && (
                            <span className="text-sm text-gray-500">
                                No country data yet. Views from local/dev
                                environments may not include a geolocatable IP.
                            </span>
                        )}
                    </div>
                </div>

                {selectedPostId && (
                    <div className="mt-10">
                        <h2 className="text-2xl font-semibold mb-4">
                            Post details
                        </h2>
                        {loadingDetail && (
                            <div className="text-gray-500">Loading…</div>
                        )}
                        {detail && (
                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                    <div>
                                        <div className="font-semibold text-gray-900">
                                            {detail.post.title}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {new Date(
                                                detail.post.date
                                            ).toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="flex gap-4 text-sm">
                                        <span>
                                            Total Views:{' '}
                                            <strong>
                                                {detail.post.totalViews}
                                            </strong>
                                        </span>
                                        <span>
                                            Comments:{' '}
                                            <strong>{detail.comments}</strong>
                                        </span>
                                        <span>
                                            Bookmarks:{' '}
                                            <strong>{detail.bookmarks}</strong>
                                        </span>
                                        {typeof detail.uniqueVisitors ===
                                            'number' && (
                                            <span>
                                                Unique:{' '}
                                                <strong>
                                                    {detail.uniqueVisitors}
                                                </strong>
                                            </span>
                                        )}
                                        {typeof detail.avgReadTimeSec ===
                                            'number' && (
                                            <span>
                                                Avg Read:{' '}
                                                <strong>
                                                    {detail.avgReadTimeSec}s
                                                </strong>
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <p className="font-medium mb-2">
                                        Last 30 days views
                                    </p>
                                    <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-10 gap-2">
                                        {detail.timeseries.map((pt) => (
                                            <div
                                                key={pt.date}
                                                className="flex flex-col items-center"
                                            >
                                                <div
                                                    className="w-6 bg-red-200 rounded"
                                                    style={{
                                                        height: `${Math.min(100, pt.views * 8)}px`,
                                                    }}
                                                />
                                                <span className="mt-1 text-xs text-gray-500">
                                                    {pt.views}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <p className="font-medium mb-2">Devices</p>
                                    <div className="flex gap-4 text-sm">
                                        <span>
                                            Mobile:{' '}
                                            <strong>
                                                {detail.devices.mobile}
                                            </strong>
                                        </span>
                                        <span>
                                            Desktop:{' '}
                                            <strong>
                                                {detail.devices.desktop}
                                            </strong>
                                        </span>
                                        <span>
                                            Other:{' '}
                                            <strong>
                                                {detail.devices.other}
                                            </strong>
                                        </span>
                                    </div>
                                </div>

                                {detail.sources &&
                                    detail.sources.length > 0 && (
                                        <div className="mt-6">
                                            <p className="font-medium mb-2">
                                                Traffic sources
                                            </p>
                                            <div className="flex flex-wrap gap-3 text-sm">
                                                {detail.sources.map((s) => (
                                                    <span
                                                        key={s.source}
                                                        className="px-2 py-1 rounded bg-gray-100 border text-gray-700"
                                                    >
                                                        {s.source}:{' '}
                                                        <strong>
                                                            {s.count}
                                                        </strong>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                {detail.countries &&
                                    detail.countries.length > 0 && (
                                        <div className="mt-6">
                                            <p className="font-medium mb-2">
                                                Top countries
                                            </p>
                                            <ul className="text-sm text-gray-700 list-disc pl-6">
                                                {detail.countries
                                                    .slice(0, 10)
                                                    .map((c) => (
                                                        <li key={c.country}>
                                                            {c.country}:{' '}
                                                            <strong>
                                                                {c.count}
                                                            </strong>
                                                        </li>
                                                    ))}
                                            </ul>
                                        </div>
                                    )}
                            </div>
                        )}
                    </div>
                )}
                    </>
                )}
            </section>

            <Footer />
        </div>
    );
}

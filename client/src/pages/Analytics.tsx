import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import type { Layer, PathOptions } from 'leaflet';
import type { Feature, FeatureCollection } from 'geojson';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts';
import 'leaflet/dist/leaflet.css';

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
    const [geoJsonData, setGeoJsonData] = useState<FeatureCollection | null>(
        null
    );

    useEffect(() => {
        fetch(
            'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson'
        )
            .then((res) => res.json())
            .then((data) => setGeoJsonData(data))
            .catch(() => {
                // Fallback: skip
            });
    }, []);

    const getColor = (count: number) => {
        return count > 100
            ? '#800026'
            : count > 50
              ? '#BD0026'
              : count > 20
                ? '#E31A1C'
                : count > 10
                  ? '#FC4E2A'
                  : count > 5
                    ? '#FD8D3C'
                    : count > 2
                      ? '#FEB24C'
                      : count > 0
                        ? '#FED976'
                        : '#FFEDA0';
    };

    const getCountryCount = (countryName: string): number => {
        const found = geo.find(
            (g) =>
                g.country.toLowerCase() === countryName.toLowerCase() ||
                countryName.toLowerCase().includes(g.country.toLowerCase())
        );

        return found ? found.count : 0;
    };

    const style = (feature?: Feature): PathOptions => {
        const count = getCountryCount(
            (feature?.properties as any)?.ADMIN ||
                (feature?.properties as any)?.name ||
                ''
        );

        return {
            fillColor: getColor(count),
            weight: 1,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7,
        };
    };

    const onEachFeature = (feature: Feature, layer: Layer) => {
        const countryName =
            (feature.properties as any)?.ADMIN ||
            (feature.properties as any)?.name ||
            'Unknown';
        const count = getCountryCount(countryName);

        if (count > 0) {
            layer.bindPopup(
                `<strong>${countryName}</strong><br/>${count} view${count !== 1 ? 's' : ''}`
            );
        }

        layer.on({
            mouseover: (e) => {
                const layer = e.target;

                layer.setStyle({
                    weight: 2,
                    color: '#666',
                    dashArray: '',
                    fillOpacity: 0.9,
                });
            },
            mouseout: (e) => {
                const layer = e.target;

                layer.setStyle(style(feature));
            },
        });
    };

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

    return (
        <div className="min-h-screen font-inter">
            <Navbar activeTab="Profile" />

            <section className="p-4 md:p-10">
                <h1 className="text-2xl md:text-3xl font-semibold mb-4 md:mb-6">
                    Analytics Dashboard
                </h1>
                <p className="text-gray-600 mb-6 md:mb-8 text-sm md:text-base">
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
                        {items.length > 0 && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                <div className="bg-white border border-gray-200 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold mb-4">
                                        Top Posts by Views
                                    </h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart
                                            data={items
                                                .slice()
                                                .sort(
                                                    (a, b) =>
                                                        b.totalViews - a.totalViews
                                                )
                                                .slice(0, 5)
                                                .map((item) => ({
                                                    name: item.title.substring(
                                                        0,
                                                        20
                                                    ),
                                                    views: item.totalViews,
                                                }))}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="views" fill="#ef4444" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="bg-white border border-gray-200 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold mb-4">
                                        Engagement Distribution
                                    </h3>
                                    {items.reduce((sum, item) => sum + item.comments + item.bookmarks, 0) === 0 ? (
                                        <div className="h-[300px] flex items-center justify-center text-gray-500">
                                            <p>No engagement data yet. Comments and bookmarks will appear here.</p>
                                        </div>
                                    ) : (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={[
                                                    {
                                                        name: 'Comments',
                                                        value: items.reduce(
                                                            (sum, item) =>
                                                                sum + item.comments,
                                                            0
                                                        ),
                                                    },
                                                    {
                                                        name: 'Bookmarks',
                                                        value: items.reduce(
                                                            (sum, item) =>
                                                                sum + item.bookmarks,
                                                            0
                                                        ),
                                                    },
                                                ].filter(item => item.value > 0)}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={(entry) =>
                                                    `${entry.name}: ${entry.value}`
                                                }
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                <Cell fill="#ef4444" />
                                                <Cell fill="#f97316" />
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    )}
                                </div>
                            </div>
                        )}

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
                    {geo.length === 0 ? (
                        <div className="w-full h-80 bg-white border border-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-sm text-gray-500">
                                No country data yet. Views from local/dev
                                environments may not include a geolocatable IP.
                            </span>
                        </div>
                    ) : (
                        <>
                            <div className="w-full h-80 bg-white border border-gray-200 rounded-lg overflow-hidden relative">
                                <MapContainer
                                    center={[20, 0]}
                                    zoom={2}
                                    style={{ height: '100%', width: '100%' }}
                                    scrollWheelZoom={false}
                                >
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    {geoJsonData && (
                                        <GeoJSON
                                            data={geoJsonData}
                                            style={style}
                                            onEachFeature={onEachFeature}
                                        />
                                    )}
                                </MapContainer>
                            </div>
                            <div className="mt-4 bg-white border border-gray-200 rounded-lg p-4">
                                <p className="text-sm font-medium mb-2">
                                    Views per Country
                                </p>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <div className="flex items-center gap-1">
                                        <div
                                            className="w-4 h-4 border border-gray-300"
                                            style={{ backgroundColor: '#FFEDA0' }}
                                        ></div>
                                        <span className="text-xs">0</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div
                                            className="w-4 h-4 border border-gray-300"
                                            style={{ backgroundColor: '#FED976' }}
                                        ></div>
                                        <span className="text-xs">1-2</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div
                                            className="w-4 h-4 border border-gray-300"
                                            style={{ backgroundColor: '#FEB24C' }}
                                        ></div>
                                        <span className="text-xs">3-5</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div
                                            className="w-4 h-4 border border-gray-300"
                                            style={{ backgroundColor: '#FD8D3C' }}
                                        ></div>
                                        <span className="text-xs">6-10</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div
                                            className="w-4 h-4 border border-gray-300"
                                            style={{ backgroundColor: '#FC4E2A' }}
                                        ></div>
                                        <span className="text-xs">11-20</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div
                                            className="w-4 h-4 border border-gray-300"
                                            style={{ backgroundColor: '#E31A1C' }}
                                        ></div>
                                        <span className="text-xs">21-50</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div
                                            className="w-4 h-4 border border-gray-300"
                                            style={{ backgroundColor: '#BD0026' }}
                                        ></div>
                                        <span className="text-xs">51-100</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div
                                            className="w-4 h-4 border border-gray-300"
                                            style={{ backgroundColor: '#800026' }}
                                        ></div>
                                        <span className="text-xs">100+</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {selectedPostId && (
                    <div className="mt-10">
                        <h2 className="text-2xl font-semibold mb-6">
                            Post Details
                        </h2>
                        {loadingDetail && (
                            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-red-500 border-r-transparent"></div>
                                <p className="mt-2 text-gray-500">
                                    Loading post analytics...
                                </p>
                            </div>
                        )}
                        {detail && (
                            <div className="space-y-6">
                                <div className="bg-white border border-gray-200 rounded-lg p-6">
                                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                {detail.post.title}
                                            </h3>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                    />
                                                </svg>
                                                {new Date(
                                                    detail.post.date
                                                ).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
                                            <div className="text-xs text-red-600 font-medium mb-1">
                                                Total Views
                                            </div>
                                            <div className="text-2xl font-bold text-red-700">
                                                {detail.post.totalViews}
                                            </div>
                                        </div>
                                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                                            <div className="text-xs text-blue-600 font-medium mb-1">
                                                Comments
                                            </div>
                                            <div className="text-2xl font-bold text-blue-700">
                                                {detail.comments}
                                            </div>
                                        </div>
                                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                                            <div className="text-xs text-purple-600 font-medium mb-1">
                                                Bookmarks
                                            </div>
                                            <div className="text-2xl font-bold text-purple-700">
                                                {detail.bookmarks}
                                            </div>
                                        </div>
                                        {typeof detail.uniqueVisitors ===
                                            'number' && (
                                            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                                                <div className="text-xs text-green-600 font-medium mb-1">
                                                    Unique Visitors
                                                </div>
                                                <div className="text-2xl font-bold text-green-700">
                                                    {detail.uniqueVisitors}
                                                </div>
                                            </div>
                                        )}
                                        {typeof detail.avgReadTimeSec ===
                                            'number' && (
                                            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                                                <div className="text-xs text-orange-600 font-medium mb-1">
                                                    Avg Read Time
                                                </div>
                                                <div className="text-2xl font-bold text-orange-700">
                                                    {detail.avgReadTimeSec}s
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-white border border-gray-200 rounded-lg p-6">
                                    <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                        <svg
                                            className="w-5 h-5 text-red-500"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                            />
                                        </svg>
                                        Last 30 Days Views
                                    </h4>
                                    <ResponsiveContainer width="100%" height={200}>
                                        <LineChart data={detail.timeseries}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis
                                                dataKey="date"
                                                tick={{ fontSize: 12 }}
                                                angle={-45}
                                                textAnchor="end"
                                                height={80}
                                            />
                                            <YAxis />
                                            <Tooltip />
                                            <Line 
                                                type="monotone" 
                                                dataKey="views" 
                                                stroke="#ef4444" 
                                                strokeWidth={2}
                                                dot={{ fill: '#ef4444', r: 4 }}
                                                activeDot={{ r: 6 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                                        <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                            <svg
                                                className="w-5 h-5 text-blue-500"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                                                />
                                            </svg>
                                            Device Breakdown
                                        </h4>
                                        <ResponsiveContainer width="100%" height={250}>
                                            <PieChart>
                                                <Pie
                                                    data={[
                                                        {
                                                            name: 'Mobile',
                                                            value: detail.devices
                                                                .mobile,
                                                        },
                                                        {
                                                            name: 'Desktop',
                                                            value: detail.devices
                                                                .desktop,
                                                        },
                                                        {
                                                            name: 'Other',
                                                            value: detail.devices
                                                                .other,
                                                        },
                                                    ].filter((d) => d.value > 0)}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={(entry) =>
                                                        `${entry.name}: ${entry.value}`
                                                    }
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                >
                                                    <Cell fill="#3b82f6" />
                                                    <Cell fill="#10b981" />
                                                    <Cell fill="#f59e0b" />
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>

                                    {detail.sources &&
                                        detail.sources.length > 0 && (
                                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                                <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                                    <svg
                                                        className="w-5 h-5 text-purple-500"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                                                        />
                                                    </svg>
                                                    Traffic Sources
                                                </h4>
                                                <div className="space-y-3">
                                                    {detail.sources.map((s) => (
                                                        <div
                                                            key={s.source}
                                                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                                                        >
                                                            <span className="font-medium text-gray-700 capitalize">
                                                                {s.source}
                                                            </span>
                                                            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                                                                {s.count}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                </div>

                                {detail.countries &&
                                    detail.countries.length > 0 && (
                                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                                            <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                                <svg
                                                    className="w-5 h-5 text-green-500"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                                Top Countries
                                            </h4>
                                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                                                {detail.countries
                                                    .slice(0, 10)
                                                    .map((c) => (
                                                        <div
                                                            key={c.country}
                                                            className="flex items-center justify-between p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200"
                                                        >
                                                            <span className="font-medium text-gray-700 text-sm">
                                                                {c.country}
                                                            </span>
                                                            <span className="px-2 py-1 bg-green-600 text-white rounded-full text-xs font-semibold">
                                                                {c.count}
                                                            </span>
                                                        </div>
                                                    ))}
                                            </div>
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

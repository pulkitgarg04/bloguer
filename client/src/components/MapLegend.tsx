interface LegendItem {
    color: string;
    label: string;
}

interface MapLegendProps {
    title?: string;
    items: LegendItem[];
}

export default function MapLegend({
    title = 'Views per Country',
    items,
}: MapLegendProps) {
    return (
        <div className="mt-4 bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-sm font-medium mb-2">{title}</p>
            <div className="flex items-center gap-2 flex-wrap">
                {items.map((item, index) => (
                    <div key={index} className="flex items-center gap-1">
                        <div
                            className="w-4 h-4 border border-gray-300"
                            style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-xs">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

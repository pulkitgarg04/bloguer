import { ReactNode } from 'react';

interface AnalyticsChartProps {
    title: string;
    icon?: ReactNode;
    iconColor?: string;
    children: ReactNode;
}

export default function AnalyticsChart({
    title,
    icon,
    iconColor = 'text-gray-500',
    children,
}: AnalyticsChartProps) {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                {icon && (
                    <span className={iconColor}>
                        {icon}
                    </span>
                )}
                {title}
            </h4>
            {children}
        </div>
    );
}

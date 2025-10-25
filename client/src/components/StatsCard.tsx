interface StatsCardProps {
    label: string;
    value: string | number;
    color: 'red' | 'blue' | 'purple' | 'green' | 'orange' | 'yellow' | 'indigo';
}

const colorClasses = {
    red: {
        gradient: 'from-red-50 to-red-100',
        border: 'border-red-200',
        labelText: 'text-red-600',
        valueText: 'text-red-700',
    },
    blue: {
        gradient: 'from-blue-50 to-blue-100',
        border: 'border-blue-200',
        labelText: 'text-blue-600',
        valueText: 'text-blue-700',
    },
    purple: {
        gradient: 'from-purple-50 to-purple-100',
        border: 'border-purple-200',
        labelText: 'text-purple-600',
        valueText: 'text-purple-700',
    },
    green: {
        gradient: 'from-green-50 to-green-100',
        border: 'border-green-200',
        labelText: 'text-green-600',
        valueText: 'text-green-700',
    },
    orange: {
        gradient: 'from-orange-50 to-orange-100',
        border: 'border-orange-200',
        labelText: 'text-orange-600',
        valueText: 'text-orange-700',
    },
    yellow: {
        gradient: 'from-yellow-50 to-yellow-100',
        border: 'border-yellow-200',
        labelText: 'text-yellow-600',
        valueText: 'text-yellow-700',
    },
    indigo: {
        gradient: 'from-indigo-50 to-indigo-100',
        border: 'border-indigo-200',
        labelText: 'text-indigo-600',
        valueText: 'text-indigo-700',
    },
};

export default function StatsCard({ label, value, color }: StatsCardProps) {
    const colors = colorClasses[color];

    return (
        <div
            className={`bg-gradient-to-br ${colors.gradient} rounded-lg p-4 border ${colors.border}`}
        >
            <div className={`text-xs ${colors.labelText} font-medium mb-1`}>
                {label}
            </div>
            <div className={`text-2xl font-bold ${colors.valueText}`}>
                {value}
            </div>
        </div>
    );
}

export default function Skeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 px-4 md:px-10 py-6 md:py-10">
            {Array(6)
                .fill(0)
                .map((_, index) => (
                    <div
                        key={index}
                        className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col h-full animate-pulse"
                    >
                        <div className="w-full h-48 bg-gray-300"></div>
                        <div className="p-4 flex flex-col flex-grow">
                            <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
                            <div className="h-6 bg-gray-300 rounded mb-4"></div>
                            <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                            <div className="mt-4 flex items-center space-x-4 text-gray-500">
                                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
        </div>
    );
}

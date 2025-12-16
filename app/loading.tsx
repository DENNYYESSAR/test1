'use client';

export default function Loading() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 flex items-center justify-center">
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
                <p className="text-gray-600 font-medium">Loading...</p>
            </div>
        </div>
    );
}

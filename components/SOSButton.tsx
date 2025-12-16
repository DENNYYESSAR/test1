
'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function SOSButton() {
    const { user } = useAuth();
    const [activating, setActivating] = useState(false);

    const handleSOS = () => {
        if (!confirm('Are you sure you want to trigger an EMERGENCY SOS alert?')) return;

        setActivating(true);
        if (!navigator.geolocation) {
            alert('Geolocation is not supported. Cannot send location.');
            setActivating(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const response = await fetch('/api/sos', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                            userId: user?.uid,
                            userName: user?.email
                        })
                    });

                    if (response.ok) {
                        alert('EMERGENCY ALERT SENT! Help is on the way.');
                    } else {
                        alert('Failed to send alert.');
                    }
                } catch (e) {
                    console.error(e);
                    alert('Error sending SOS.');
                } finally {
                    setActivating(false);
                }
            },
            (error) => {
                alert('Could not get location: ' + error.message);
                setActivating(false);
            },
            { enableHighAccuracy: true }
        );
    };

    // Only show SOS button for authenticated users
    if (!user) {
        return null;
    }

    return (
        <div className="fixed bottom-6 left-6 z-[9999] flex items-center gap-4 group">
            <div className="relative">
                <button
                    onClick={handleSOS}
                    disabled={activating}
                    className={`w-16 h-16 rounded-full shadow-lg flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 ${activating ? 'bg-gray-500 animate-pulse' : 'bg-red-600 hover:bg-red-700 animate-pulse-slow'
                        }`}
                    title="EMERGENCY SOS"
                >
                    {activating ? (
                        <i className="ri-loader-4-line text-white text-2xl animate-spin"></i>
                    ) : (
                        <div className="flex flex-col items-center justify-center">
                            <i className="ri-alarm-warning-fill text-white text-2xl"></i>
                            <span className="text-[10px] font-bold text-white leading-none mt-0.5">SOS</span>
                        </div>
                    )}
                </button>
                {/* Pulse rings */}
                {!activating && (
                    <>
                        <div className="absolute inset-0 bg-red-600 rounded-full opacity-30 animate-ping pointer-events-none"></div>
                    </>
                )}
            </div>

            <div className="bg-white/90 backdrop-blur-md text-red-600 px-4 py-2 rounded-xl shadow-lg border border-red-100 font-bold text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-10px] group-hover:translate-x-0 pointer-events-none whitespace-nowrap">
                Emergency SOS
            </div>
        </div>
    );
}

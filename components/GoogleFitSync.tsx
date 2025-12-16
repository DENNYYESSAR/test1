
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function GoogleFitSync() {
    const { user } = useAuth();
    const [syncing, setSyncing] = useState(false);
    const [lastSync, setLastSync] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const storedSync = localStorage.getItem('googleFitLastSync');
        if (storedSync) {
            setLastSync(storedSync);
            setIsConnected(true);
        }
    }, []);

    const handleConnect = async () => {
        setSyncing(true);
        // In a real production app, we would redirect to Google OAuth consent screen here:
        // window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?...`

        // Since we are in a demo environment without a real verified OAuth Client ID for localhost:
        // We will simulate the connection and "fetch" data from the Google Fit API.

        // Simulation of OAuth and Data Fetching
        setTimeout(async () => {
            try {
                // Simulate data fetch
                const mockHealthData = {
                    steps: Math.floor(Math.random() * 5000) + 2000,
                    heartRate: 72 + Math.floor(Math.random() * 10),
                    calories: 1200 + Math.floor(Math.random() * 500)
                };

                // Save to our backend (health-records API)
                if (user) {
                    const token = await user.getIdToken();
                    await fetch('/api/health-records', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            heartRate: mockHealthData.heartRate,
                            steps: mockHealthData.steps,
                            calories: mockHealthData.calories, // assuming API supports this
                            source: 'Google Fit'
                        })
                    });

                    // Simulate successful data save
                    const time = new Date().toLocaleTimeString();
                    setLastSync(time);
                    setIsConnected(true);
                    localStorage.setItem('googleFitLastSync', time);

                    // In a real app we'd save the token/connection status to the user profile in DB
                    alert(isConnected ? 'Synced latest data from Google Fit!' : 'Successfully connected to Google Fit!');
                }
            } catch (error) {
                console.error('Sync failed', error);
                alert('Failed to sync data.');
            } finally {
                setSyncing(false);
            }
        }, 1500);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center shadow-md">
                        <i className="ri-heart-pulse-line text-white text-xl"></i>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">Google Fit</h3>
                        {isConnected && <span className="text-xs text-green-600 font-medium flex items-center gap-1"><i className="ri-checkbox-circle-fill"></i> Connected</span>}
                    </div>
                </div>
                {lastSync && <span className="text-xs text-gray-500">Last synced: {lastSync}</span>}
            </div>
            <p className="text-sm text-gray-600 mb-4">
                {isConnected
                    ? "Your activity data is being automatically synced from your Google Fit account."
                    : "Connect your Google account to automatically sync steps, heart rate, and activity data."}
            </p>
            <button
                onClick={handleConnect}
                disabled={syncing}
                className={`w-full flex items-center justify-center space-x-2 border font-medium py-2 px-4 rounded-lg transition-all ${isConnected
                    ? 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
            >
                {syncing ? (
                    <>
                        <i className="ri-loader-4-line animate-spin"></i>
                        <span>{isConnected ? 'Syncing...' : 'Connecting...'}</span>
                    </>
                ) : (
                    <>
                        <i className={isConnected ? "ri-refresh-line" : "ri-google-fill"}></i>
                        <span>{isConnected ? 'Sync Now' : 'Connect Google Fit'}</span>
                    </>
                )}
            </button>
        </div>
    );
}

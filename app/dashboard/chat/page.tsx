
'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import ChatInterface from '@/components/ChatInterface';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

// Mock list of doctors for the demo
// Initial state empty
const MOCK_DOCTORS: any[] = [];

export default function ChatPage() {
    const { user, loading } = useAuth();
    const [doctors, setDoctors] = useState<any[]>([]);
    const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
    const [chatId, setChatId] = useState<string>('');
    const [isLoadingDoctors, setIsLoadingDoctors] = useState(true);

    useEffect(() => {
        if (user) {
            fetchDoctors();
        }
    }, [user]);

    const fetchDoctors = async () => {
        try {
            const token = await user?.getIdToken();
            const response = await fetch('/api/doctors', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setDoctors(data.doctors);
                if (data.doctors.length > 0) {
                    setSelectedDoctor(data.doctors[0]);
                }
            }
        } catch (error) {
            console.error('Failed to fetch doctors', error);
        } finally {
            setIsLoadingDoctors(false);
        }
    };

    useEffect(() => {
        if (user && selectedDoctor) {
            setChatId(`${user.uid}_${selectedDoctor.id}`);
        }
    }, [user, selectedDoctor]);

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <i className="ri-loader-4-line animate-spin text-3xl text-primary-500"></i>
                <p className="text-gray-500 font-medium">Loading messages...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />

            <main className="flex-1 pt-24 pb-8 max-w-7xl mx-auto w-full px-4">
                <div className="flex items-center mb-6">
                    <Link href="/dashboard" className="mr-4 p-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-all text-gray-600 hover:text-primary-600">
                        <i className="ri-arrow-left-line text-xl"></i>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
                        <p className="text-sm text-gray-500">Consult with your healthcare providers</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[700px]">
                    {/* Sidebar - Doctor List */}
                    <div className="glass-panel rounded-3xl shadow-xl overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-gray-100">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search doctors..."
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
                                />
                                <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 space-y-1">
                            {isLoadingDoctors ? (
                                <div className="p-8 text-center">
                                    <i className="ri-loader-4-line animate-spin text-2xl text-primary-500 mb-2"></i>
                                    <p className="text-sm text-gray-500">Loading doctors...</p>
                                </div>
                            ) : doctors.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <i className="ri-user-unfollow-line text-xl text-gray-400"></i>
                                    </div>
                                    <p className="font-medium text-gray-900">No doctors found</p>
                                    <p className="text-xs mt-1">Ask an admin to register doctors.</p>
                                </div>
                            ) : (
                                doctors.map((doc) => (
                                    <div
                                        key={doc.id}
                                        onClick={() => setSelectedDoctor(doc)}
                                        className={`p-3 flex items-center gap-3 cursor-pointer transition-all rounded-xl ${
                                            selectedDoctor?.id === doc.id 
                                                ? 'bg-primary-50 text-primary-900 shadow-sm' 
                                                : 'hover:bg-gray-50 text-gray-700'
                                        }`}
                                    >
                                        <div className="relative">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl overflow-hidden border-2 ${
                                                selectedDoctor?.id === doc.id 
                                                    ? 'border-primary-200 bg-primary-100 text-primary-600' 
                                                    : 'border-gray-100 bg-gray-50 text-gray-400'
                                            }`}>
                                                {doc.photoURL ? (
                                                    <img src={doc.photoURL} alt={doc.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <i className="ri-user-star-line"></i>
                                                )}
                                            </div>
                                            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className={`font-bold text-sm truncate ${
                                                selectedDoctor?.id === doc.id ? 'text-primary-900' : 'text-gray-900'
                                            }`}>{doc.name}</h3>
                                            <p className={`text-xs truncate ${
                                                selectedDoctor?.id === doc.id ? 'text-primary-600' : 'text-gray-500'
                                            }`}>{doc.specialty || 'General Doctor'}</p>
                                        </div>
                                        {selectedDoctor?.id === doc.id && (
                                            <i className="ri-arrow-right-s-line text-primary-500"></i>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="md:col-span-3 glass-panel rounded-3xl shadow-xl overflow-hidden flex flex-col relative">
                        {selectedDoctor ? (
                            <ChatInterface
                                chatId={chatId}
                                recipientName={selectedDoctor.name}
                            />
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 bg-gray-50/50">
                                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-6 shadow-lg animate-float">
                                    <i className="ri-chat-smile-3-line text-5xl text-primary-500"></i>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Start a Conversation</h3>
                                <p className="text-gray-500 text-center max-w-md">
                                    Select a doctor from the list to start consulting with our specialists directly.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}


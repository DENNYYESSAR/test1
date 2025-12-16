'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import Link from 'next/link';

// Enhanced Types
interface Appointment {
    id: string;
    patientId: string;
    patientName?: string; // Ideally fetched from user profile
    appointmentDate: string;
    appointmentTime: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    type: 'Consultation' | 'Follow-up' | 'Emergency';
    notes?: string;
    symptoms?: string; // From AI diagnosis
}

export default function DoctorDashboard() {
    const { user, loading: authLoading } = useAuth();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [consultationNote, setConsultationNote] = useState('');

    const fetchAppointments = useCallback(async () => {
        setIsRefreshing(true);
        try {
            const token = await user?.getIdToken();
            const response = await fetch('/api/doctor/appointments', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                // Map and ensure status exists
                const mappedApps = data.appointments.map((app: any) => ({
                    ...app,
                    status: app.status || 'pending',
                    patientName: app.patientName || 'Anonymous Patient' // Fallback
                }));
                setAppointments(mappedApps);
            }
        } catch (error) {
            console.error('Failed to fetch appointments', error);
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            fetchAppointments();
        }
    }, [user, fetchAppointments]);

    const updateStatus = async (id: string, newStatus: string) => {
        // In a real app, call API to update status
        setAppointments(prev => prev.map(app => 
            app.id === id ? { ...app, status: newStatus as any } : app
        ));
        // Mock API call
        // await fetch(`/api/appointments/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status: newStatus }) });
    };

    const handleConsultationSave = () => {
        if (!selectedAppointment) return;
        // Save logic here
        updateStatus(selectedAppointment.id, 'completed');
        setSelectedAppointment(null);
        setConsultationNote('');
        alert('Consultation notes saved and appointment marked as complete.');
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <i className="ri-loader-4-line text-4xl text-primary-600 animate-spin"></i>
                    <p className="mt-4 text-gray-600 font-medium">Loading Doctor Portal...</p>
                </div>
            </div>
        );
    }

    const pendingAppointments = appointments.filter(a => a.status === 'pending');
    const todayAppointments = appointments.filter(a => {
        const today = new Date().toISOString().split('T')[0];
        return a.appointmentDate === today;
    });

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-20 left-20 w-40 h-40 lg:w-64 lg:h-64 bg-primary-400 rounded-full animate-float blur-3xl"></div>
                <div className="absolute bottom-20 right-20 w-40 h-40 lg:w-64 lg:h-64 bg-secondary-400 rounded-full animate-float blur-3xl" style={{ animationDelay: '2s' }}></div>
            </div>

            <Header />
            
            <div className="pt-24 lg:pt-28 px-4 lg:px-6 max-w-7xl mx-auto pb-12 relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 lg:mb-8 gap-4">
                    <div>
                        <div className="inline-flex items-center px-3 py-1 bg-primary-50 rounded-full text-primary-600 text-xs font-medium mb-2 border border-primary-100">
                            <i className="ri-hospital-line mr-2"></i>
                            Medical Professional
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            Doctor Portal
                        </h1>
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={fetchAppointments} 
                            disabled={isRefreshing}
                            className={`px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-700 font-medium shadow-sm transition-all flex items-center gap-2 ${isRefreshing ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            <i className={`ri-refresh-line ${isRefreshing ? 'animate-spin' : ''}`}></i> 
                            {isRefreshing ? 'Refreshing...' : 'Refresh'}
                        </button>
                        <Link 
                            href="/dashboard" 
                            className="px-4 py-2.5 bg-gray-800 text-white rounded-xl hover:bg-gray-900 font-medium shadow-lg shadow-gray-500/20 transition-all flex items-center gap-2"
                        >
                            <i className="ri-logout-box-r-line"></i> Exit to App
                        </Link>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm border border-gray-200 w-full md:w-fit mb-8 overflow-x-auto">
                    {['dashboard', 'appointments', 'patients'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 md:flex-none px-4 lg:px-6 py-2.5 rounded-lg text-sm font-bold capitalize transition-all whitespace-nowrap ${
                                activeTab === tab 
                                ? 'bg-primary-600 text-white shadow-md' 
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* DASHBOARD VIEW */}
                {activeTab === 'dashboard' && (
                    <>
                        {/* Overview Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 mb-8">
                            <div className="glass-panel p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg border-l-4 border-l-primary-500">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-gray-500 text-xs md:text-sm font-medium mb-1">Today&apos;s Appointments</p>
                                        <p className="text-2xl md:text-3xl font-bold text-gray-900">{todayAppointments.length}</p>
                                    </div>
                                    <div className="w-8 h-8 md:w-10 md:h-10 bg-primary-50 rounded-lg md:rounded-xl flex items-center justify-center text-primary-600">
                                        <i className="ri-calendar-check-line text-lg md:text-xl"></i>
                                    </div>
                                </div>
                            </div>
                            <div className="glass-panel p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg border-l-4 border-l-yellow-500">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-gray-500 text-xs md:text-sm font-medium mb-1">Pending Requests</p>
                                        <p className="text-2xl md:text-3xl font-bold text-gray-900">{pendingAppointments.length}</p>
                                    </div>
                                    <div className="w-8 h-8 md:w-10 md:h-10 bg-yellow-50 rounded-lg md:rounded-xl flex items-center justify-center text-yellow-600">
                                        <i className="ri-time-line text-lg md:text-xl"></i>
                                    </div>
                                </div>
                            </div>
                            <div className="glass-panel p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg border-l-4 border-l-green-500">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-gray-500 text-xs md:text-sm font-medium mb-1">Total Patients</p>
                                        <p className="text-2xl md:text-3xl font-bold text-gray-900">{new Set(appointments.map(a => a.patientId)).size}</p>
                                    </div>
                                    <div className="w-8 h-8 md:w-10 md:h-10 bg-green-50 rounded-lg md:rounded-xl flex items-center justify-center text-green-600">
                                        <i className="ri-user-heart-line text-lg md:text-xl"></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <h2 className="text-xl font-bold text-gray-900 mb-4">Up Next</h2>
                        <div className="space-y-4">
                            {appointments.slice(0, 3).map((app) => (
                                <div key={app.id} className="glass-panel p-6 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
                                                {app.patientName?.charAt(0) || 'P'}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900">{app.patientName || 'Patient'}</h3>
                                                <p className="text-sm text-gray-500">{app.type} • {app.appointmentDate} at {app.appointmentTime}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {app.status === 'pending' && (
                                                <>
                                                    <button 
                                                        onClick={() => updateStatus(app.id, 'confirmed')}
                                                        className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-bold hover:bg-green-200 transition-all"
                                                    >
                                                        Accept
                                                    </button>
                                                    <button 
                                                        onClick={() => updateStatus(app.id, 'cancelled')}
                                                        className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-bold hover:bg-red-100 transition-all"
                                                    >
                                                        Decline
                                                    </button>
                                                </>
                                            )}
                                            {app.status === 'confirmed' && (
                                                <button 
                                                    onClick={() => setSelectedAppointment(app)}
                                                    className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-bold hover:bg-primary-700 transition-all flex items-center gap-2"
                                                >
                                                    <i className="ri-stethoscope-line"></i> Start Consultation
                                                </button>
                                            )}
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                                                app.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                app.status === 'completed' ? 'bg-gray-100 text-gray-600' :
                                                'bg-red-100 text-red-600'
                                            }`}>
                                                {app.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {appointments.length === 0 && (
                                <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
                                    <p className="text-gray-500">No appointments scheduled yet.</p>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* APPOINTMENTS VIEW */}
                {activeTab === 'appointments' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900">All Appointments</h2>
                            <div className="flex gap-2">
                                <select className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500/20">
                                    <option>All Status</option>
                                    <option>Pending</option>
                                    <option>Confirmed</option>
                                    <option>Completed</option>
                                </select>
                            </div>
                        </div>
                        {appointments.map((app) => (
                            <div key={app.id} className="glass-panel p-6 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex flex-col md:flex-row justify-between gap-6">
                                    <div className="flex gap-4">
                                        <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-500">
                                            <i className="ri-user-line text-2xl"></i>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-900">{app.patientName}</h3>
                                            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                                <span className="flex items-center gap-1">
                                                    <i className="ri-calendar-line"></i> {app.appointmentDate}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <i className="ri-time-line"></i> {app.appointmentTime}
                                                </span>
                                            </div>
                                            {app.notes && (
                                                <p className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                                                    <span className="font-semibold">Reason:</span> {app.notes}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                            app.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                            app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-gray-100 text-gray-600'
                                        }`}>
                                            {app.status}
                                        </span>
                                        <div className="flex gap-2">
                                            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-all" title="View Details">
                                                <i className="ri-file-list-line text-xl"></i>
                                            </button>
                                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Video Call">
                                                <i className="ri-video-chat-line text-xl"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* PATIENTS VIEW */}
                {activeTab === 'patients' && (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="ri-group-line text-4xl text-gray-400"></i>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Patient Directory</h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                            Patient management features coming soon. You will be able to view medical history, past diagnoses, and contact details here.
                        </p>
                    </div>
                )}
            </div>

            {/* Consultation Modal */}
            {selectedAppointment && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-900">Consultation Notes</h3>
                            <button onClick={() => setSelectedAppointment(null)} className="p-2 hover:bg-gray-100 rounded-full">
                                <i className="ri-close-line text-2xl"></i>
                            </button>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-xl mb-6">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                                    {selectedAppointment.patientName?.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">{selectedAppointment.patientName}</h4>
                                    <p className="text-sm text-blue-700">
                                        {selectedAppointment.type} • {selectedAppointment.appointmentDate}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Clinical Notes</label>
                                <textarea
                                    value={consultationNote}
                                    onChange={(e) => setConsultationNote(e.target.value)}
                                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 outline-none min-h-[150px]"
                                    placeholder="Record symptoms, diagnosis, and treatment plan..."
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Prescription (Optional)</label>
                                <input
                                    type="text"
                                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 outline-none"
                                    placeholder="e.g. Amoxicillin 500mg - 3x daily for 7 days"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button 
                                onClick={() => setSelectedAppointment(null)}
                                className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleConsultationSave}
                                className="flex-1 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 shadow-lg shadow-primary-500/20"
                            >
                                Complete Consultation
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

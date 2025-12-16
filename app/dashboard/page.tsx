
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import GoogleFitSync from '../../components/GoogleFitSync';
import PrescriptionsList from '../../components/PrescriptionsList';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function Dashboard() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('overview');
  const [userName, setUserName] = useState('User');
  const [showAddHealthModal, setShowAddHealthModal] = useState(false);
  const [showAddMedicationModal, setShowAddMedicationModal] = useState(false);
  const [showViewDiagnosisModal, setShowViewDiagnosisModal] = useState(false);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<any>(null);
  const [showEditMedicationModal, setShowEditMedicationModal] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<any>(null);

  const [diagnoses, setDiagnoses] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [medicationsList, setMedicationsList] = useState<any[]>([]);
  const [healthRecords, setHealthRecords] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  const loading = authLoading || dataLoading;

  const [healthFormData, setHealthFormData] = useState({
    heartRate: '',
    bloodPressure: '',
    weight: '',
    notes: ''
  });

  const [medicationFormData, setMedicationFormData] = useState({
    name: '',
    dosage: '',
    frequency: '',
    remaining: '',
    nextRefill: ''
  });

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    const fetchAllData = async () => {
      setDataLoading(true);
      try {
        // 1. Fetch User Profile from Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const formatName = (name: string) => {
            if (!name) return '';
            return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
          };
          const fullName = userData.firstName && userData.lastName
            ? `${formatName(userData.firstName)} ${formatName(userData.lastName)}`
            : formatName(userData.firstName) || formatName(userData.lastName) || user.email?.split('@')[0] || 'User';
          setUserName(fullName);
        } else {
          setUserName(user.email?.split('@')[0] || 'User');
        }

        // 2. Fetch Data from APIs
        const token = await user.getIdToken();
        const headers = { 'Authorization': `Bearer ${token}` };

        const [diagnosesRes, appointmentsRes, medicationsRes, healthRecordsRes] = await Promise.all([
          fetch('/api/diagnoses', { headers }),
          fetch('/api/appointments', { headers }),
          fetch('/api/medications', { headers }),
          fetch('/api/health-records?limit=7', { headers })
        ]);

        if (diagnosesRes.ok) {
          const data = await diagnosesRes.json();
          if (data.success && data.diagnoses) {
            setDiagnoses(data.diagnoses.map((d: any) => ({
              id: d.id,
              date: new Date(d.created_at).toISOString().split('T')[0],
              condition: d.condition || 'Unknown',
              confidence: d.confidence || 0,
              status: d.status || 'Reviewed',
              symptoms: d.symptoms || ''
            })));
          }
        }

        if (appointmentsRes.ok) {
          const data = await appointmentsRes.json();
          if (data.success && data.appointments) {
            setAppointments(data.appointments.map((a: any) => ({
              id: a.id,
              date: a.appointment_date,
              time: a.appointment_time,
              doctor: a.doctor_name,
              clinic: a.clinic_name,
              type: a.appointment_type,
              specialty: a.specialty || 'General'
            })));
          }
        }

        if (medicationsRes.ok) {
          const data = await medicationsRes.json();
          if (data.success && data.medications) {
            setMedicationsList(data.medications.map((m: any) => ({
              id: m.id,
              name: m.name,
              dosage: m.dosage,
              frequency: m.frequency,
              remaining: m.remaining || 0,
              nextRefill: m.next_refill || ''
            })));
          }
        }

        if (healthRecordsRes.ok) {
          const data = await healthRecordsRes.json();
          if (data.success && data.healthRecords) {
            setHealthRecords(data.healthRecords);
          }
        }

      } catch (err) {
        console.error("Error loading dashboard data", err);
      } finally {
        setDataLoading(false);
      }
    };

    fetchAllData();
  }, [user, authLoading, router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const handleViewDiagnosis = (diagnosis: any) => {
    setSelectedDiagnosis(diagnosis);
    setShowViewDiagnosisModal(true);
  };

  const handleExportDiagnosis = (diagnosis: any) => {
    const reportContent = `DIAGNOSIS REPORT\n\n` +
      `Date: ${diagnosis.date}\n` +
      `Condition: ${diagnosis.condition}\n` +
      `Confidence: ${diagnosis.confidence}%\n` +
      `Status: ${diagnosis.status}\n` +
      `Symptoms: ${diagnosis.symptoms}`;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diagnosis-${diagnosis.date}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const response = await fetch(`/api/appointments?id=${appointmentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setAppointments(prev => prev.filter(apt => apt.id !== appointmentId));
      } else {
        alert('Failed to cancel appointment');
      }
    } catch (error) {
      console.error('Error canceling appointment:', error);
      alert('Failed to cancel appointment');
    }
  };

  const handleEditMedication = (medication: any) => {
    setSelectedMedication(medication);
    setMedicationFormData({
      name: medication.name,
      dosage: medication.dosage,
      frequency: medication.frequency,
      remaining: medication.remaining.toString(),
      nextRefill: medication.nextRefill
    });
    setShowEditMedicationModal(true);
  };

  const handleRemoveMedication = async (medicationId: string) => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const response = await fetch(`/api/medications?id=${medicationId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setMedicationsList(prev => prev.filter(med => med.id !== medicationId));
      } else {
        alert('Failed to remove medication');
      }
    } catch (error) {
      console.error('Error removing medication:', error);
      alert('Failed to remove medication');
    }
  };

  const handleSaveHealthData = async () => {
    if (!user) return;
    try {
      // Parse blood pressure
      const bpParts = healthFormData.bloodPressure.split('/');
      const bloodPressureSystolic = bpParts[0] ? parseInt(bpParts[0]) : null;
      const bloodPressureDiastolic = bpParts[1] ? parseInt(bpParts[1]) : null;

      const token = await user.getIdToken();
      const response = await fetch('/api/health-records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          heartRate: healthFormData.heartRate ? parseInt(healthFormData.heartRate) : null,
          bloodPressureSystolic,
          bloodPressureDiastolic,
          weight: healthFormData.weight ? parseFloat(healthFormData.weight) : null,
          notes: healthFormData.notes || null,
        }),
      });

      if (response.ok) {
        // Refresh health records
        const healthRecordsRes = await fetch('/api/health-records?limit=7', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (healthRecordsRes.ok) {
          const healthRecordsData = await healthRecordsRes.json();
          if (healthRecordsData.success && healthRecordsData.healthRecords) {
            setHealthRecords(healthRecordsData.healthRecords);
          }
        }
        setHealthFormData({ heartRate: '', bloodPressure: '', weight: '', notes: '' });
        setShowAddHealthModal(false);
      } else {
        alert('Failed to save health data');
      }
    } catch (error) {
      console.error('Error saving health data:', error);
      alert('Failed to save health data');
    }
  };

  const handleSaveMedication = async () => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      if (showEditMedicationModal && selectedMedication) {
        // Update existing medication
        const response = await fetch('/api/medications', {
          method: 'PATCH',
          headers,
          body: JSON.stringify({
            id: selectedMedication.id,
            name: medicationFormData.name,
            dosage: medicationFormData.dosage,
            frequency: medicationFormData.frequency,
            remaining: parseInt(medicationFormData.remaining),
            nextRefill: medicationFormData.nextRefill || null,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setMedicationsList(prev => prev.map(med =>
            med.id === selectedMedication.id
              ? {
                id: data.medication.id,
                name: data.medication.name,
                dosage: data.medication.dosage,
                frequency: data.medication.frequency,
                remaining: data.medication.remaining,
                nextRefill: data.medication.next_refill || ''
              }
              : med
          ));
          setShowEditMedicationModal(false);
        } else {
          alert('Failed to update medication');
        }
      } else {
        // Add new medication
        const response = await fetch('/api/medications', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            name: medicationFormData.name,
            dosage: medicationFormData.dosage,
            frequency: medicationFormData.frequency,
            remaining: parseInt(medicationFormData.remaining),
            nextRefill: medicationFormData.nextRefill || null,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const newMedication = {
            id: data.medication.id,
            name: data.medication.name,
            dosage: data.medication.dosage,
            frequency: data.medication.frequency,
            remaining: data.medication.remaining,
            nextRefill: data.medication.next_refill || ''
          };
          setMedicationsList(prev => [...prev, newMedication]);
          setShowAddMedicationModal(false);
        } else {
          alert('Failed to add medication');
        }
      }
      setMedicationFormData({ name: '', dosage: '', frequency: '', remaining: '', nextRefill: '' });
      setSelectedMedication(null);
    } catch (error) {
      console.error('Error saving medication:', error);
      alert('Failed to save medication');
    }
  };

  const healthData = healthRecords.length > 0
    ? [...healthRecords].reverse().map((record: any) => ({
      date: new Date(record.recorded_at).toISOString().split('T')[0],
      heartRate: record.heart_rate || 0,
      bloodPressure: record.blood_pressure_systolic || 0,
    }))
    : [
      { date: '2024-01-01', heartRate: 72, bloodPressure: 120 },
      { date: '2024-01-02', heartRate: 75, bloodPressure: 118 },
      { date: '2024-01-03', heartRate: 68, bloodPressure: 122 },
      { date: '2024-01-04', heartRate: 71, bloodPressure: 119 },
      { date: '2024-01-05', heartRate: 73, bloodPressure: 121 },
      { date: '2024-01-06', heartRate: 69, bloodPressure: 117 },
      { date: '2024-01-07', heartRate: 74, bloodPressure: 120 }
    ];

  const recentDiagnoses = diagnoses;
  const upcomingAppointments = appointments;
  const medications = medicationsList;

  // Get latest health metrics
  const latestHealthRecord = healthRecords.length > 0 ? healthRecords[0] : null;
  const latestHeartRate = latestHealthRecord?.heart_rate || 72;
  const latestBloodPressure = latestHealthRecord
    ? `${latestHealthRecord.blood_pressure_systolic || 120}/${latestHealthRecord.blood_pressure_diastolic || 80}`
    : '120/80';

  const tabs = [
    { id: 'overview', name: 'Overview', icon: 'ri-dashboard-line' },
    { id: 'diagnoses', name: 'AI Diagnoses', icon: 'ri-brain-line' },
    { id: 'appointments', name: 'Appointments', icon: 'ri-calendar-line' },
    { id: 'health-records', name: 'Health Records', icon: 'ri-file-text-line' },
    { id: 'medications', name: 'Medications', icon: 'ri-capsule-line' },
    { id: 'devices', name: 'Connected Devices', icon: 'ri-smartphone-line' }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-20 lg:pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-6 lg:mb-8 animate-fadeIn">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Welcome back, <span className="text-primary-600">{userName}</span>
          </h1>
          <p className="text-sm lg:text-base text-gray-600 mt-2">Here&apos;s your health overview for today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
           {/* Heart Rate Card */}
           <div className="glass-panel p-6 rounded-2xl border-l-4 border-red-500 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center">
                  <i className="ri-heart-pulse-line text-2xl"></i>
                </div>
                <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full flex items-center gap-1">
                  <i className="ri-arrow-up-line"></i> Normal
                </span>
              </div>
              <p className="text-gray-600 text-sm font-medium">Heart Rate</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{latestHeartRate} <span className="text-sm text-gray-500 font-normal">bpm</span></h3>
           </div>

           {/* Blood Pressure Card */}
           <div className="glass-panel p-6 rounded-2xl border-l-4 border-blue-500 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                  <i className="ri-drop-line text-2xl"></i>
                </div>
                <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full flex items-center gap-1">
                  <i className="ri-check-line"></i> Normal
                </span>
              </div>
              <p className="text-gray-600 text-sm font-medium">Blood Pressure</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{latestBloodPressure} <span className="text-sm text-gray-500 font-normal">mmHg</span></h3>
           </div>

           {/* Next Appointment Card */}
           <div className="glass-panel p-6 rounded-2xl border-l-4 border-purple-500 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                  <i className="ri-calendar-check-line text-2xl"></i>
                </div>
                <Link href="/find-clinics" className="text-xs font-medium text-purple-600 hover:text-purple-700">
                  Book New
                </Link>
              </div>
              <p className="text-gray-600 text-sm font-medium">Next Appointment</p>
              <h3 className="text-lg font-bold text-gray-900 mt-1 truncate">
                {appointments.length > 0 ? appointments[0].date : 'No upcoming'}
              </h3>
           </div>

           {/* AI Diagnoses Card */}
           <div className="glass-panel p-6 rounded-2xl border-l-4 border-cyan-500 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-cyan-100 text-cyan-600 rounded-xl flex items-center justify-center">
                  <i className="ri-brain-line text-2xl"></i>
                </div>
                <Link href="/ai-diagnosis" className="text-xs font-medium text-cyan-600 hover:text-cyan-700">
                  New Check
                </Link>
              </div>
              <p className="text-gray-600 text-sm font-medium">Recent Diagnosis</p>
              <h3 className="text-lg font-bold text-gray-900 mt-1 truncate">
                {diagnoses.length > 0 ? diagnoses[0].condition : 'None yet'}
              </h3>
           </div>
        </div>

        {/* Tabs Navigation */}
        <div className="mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex space-x-2 min-w-max bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 whitespace-nowrap font-medium text-sm ${
                  activeTab === tab.id
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-primary-600'
                }`}
              >
                <i className={`${tab.icon} text-lg`}></i>
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fadeIn">
              {/* Quick Actions */}
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                 <Link href="/ai-diagnosis" className="group">
                    <div className="glass-panel p-4 md:p-6 rounded-xl md:rounded-2xl h-full hover:border-primary-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                      <div className="w-10 h-10 md:w-14 md:h-14 bg-primary-100 text-primary-600 rounded-lg md:rounded-xl flex items-center justify-center mb-3 md:mb-4 group-hover:bg-primary-500 group-hover:text-white transition-colors">
                        <i className="ri-brain-line text-xl md:text-2xl"></i>
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm md:text-lg mb-1 md:mb-2">AI Diagnosis</h3>
                      <p className="text-gray-600 text-xs md:text-sm mb-2 md:mb-4 line-clamp-2">Get instant health insights based on your symptoms</p>
                      <div className="flex items-center text-primary-600 font-medium text-xs md:text-sm group-hover:gap-2 transition-all">
                        <span>Start Analysis</span>
                        <i className="ri-arrow-right-line ml-1"></i>
                      </div>
                    </div>
                 </Link>

                 <Link href="/find-clinics" className="group">
                    <div className="glass-panel p-4 md:p-6 rounded-xl md:rounded-2xl h-full hover:border-secondary-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                      <div className="w-10 h-10 md:w-14 md:h-14 bg-secondary-100 text-secondary-600 rounded-lg md:rounded-xl flex items-center justify-center mb-3 md:mb-4 group-hover:bg-secondary-500 group-hover:text-white transition-colors">
                        <i className="ri-map-pin-line text-xl md:text-2xl"></i>
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm md:text-lg mb-1 md:mb-2">Find Clinics</h3>
                      <p className="text-gray-600 text-xs md:text-sm mb-2 md:mb-4 line-clamp-2">Locate and book appointments with nearby doctors</p>
                      <div className="flex items-center text-secondary-600 font-medium text-xs md:text-sm group-hover:gap-2 transition-all">
                        <span>Search Map</span>
                        <i className="ri-arrow-right-line ml-1"></i>
                      </div>
                    </div>
                 </Link>

                 <button onClick={() => setShowAddHealthModal(true)} className="group text-left w-full">
                    <div className="glass-panel p-4 md:p-6 rounded-xl md:rounded-2xl h-full hover:border-green-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                      <div className="w-10 h-10 md:w-14 md:h-14 bg-green-100 text-green-600 rounded-lg md:rounded-xl flex items-center justify-center mb-3 md:mb-4 group-hover:bg-green-500 group-hover:text-white transition-colors">
                        <i className="ri-heart-pulse-line text-xl md:text-2xl"></i>
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm md:text-lg mb-1 md:mb-2">Add Vitals</h3>
                      <p className="text-gray-600 text-xs md:text-sm mb-2 md:mb-4 line-clamp-2">Log your heart rate, blood pressure, and weight</p>
                      <div className="flex items-center text-green-600 font-medium text-xs md:text-sm group-hover:gap-2 transition-all">
                        <span>Update Records</span>
                        <i className="ri-arrow-right-line ml-1"></i>
                      </div>
                    </div>
                 </button>

                 <Link href="/dashboard/chat" className="group">
                    <div className="glass-panel p-4 md:p-6 rounded-xl md:rounded-2xl h-full hover:border-purple-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                      <div className="w-10 h-10 md:w-14 md:h-14 bg-purple-100 text-purple-600 rounded-lg md:rounded-xl flex items-center justify-center mb-3 md:mb-4 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                        <i className="ri-message-3-line text-xl md:text-2xl"></i>
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm md:text-lg mb-1 md:mb-2">Messages</h3>
                      <p className="text-gray-600 text-xs md:text-sm mb-2 md:mb-4 line-clamp-2">Chat with healthcare providers and support</p>
                      <div className="flex items-center text-purple-600 font-medium text-xs md:text-sm group-hover:gap-2 transition-all">
                        <span>Open Chat</span>
                        <i className="ri-arrow-right-line ml-1"></i>
                      </div>
                    </div>
                 </Link>
              </div>

              {/* Health Chart */}
              <div className="glass-panel p-6 rounded-2xl">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Health Trends</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={healthData}>
                      <defs>
                        <linearGradient id="colorHeartRate" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="date" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Area type="monotone" dataKey="heartRate" stroke="#ef4444" fillOpacity={1} fill="url(#colorHeartRate)" name="Heart Rate" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'appointments' && (
             <div className="glass-panel p-6 rounded-2xl animate-fadeIn">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Your Appointments</h2>
                  <Link href="/find-clinics" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium">
                    Book New
                  </Link>
                </div>
                {appointments.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <i className="ri-calendar-line text-4xl mb-2 opacity-50"></i>
                    <p>No upcoming appointments.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appointments.map(app => (
                      <div key={app.id} className="p-4 border border-gray-100 rounded-xl hover:shadow-md transition-all bg-white">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-gray-900">{app.doctor}</h3>
                            <p className="text-sm text-gray-600">{app.clinic}</p>
                            <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                              <span className="flex items-center gap-1"><i className="ri-calendar-line"></i> {app.date}</span>
                              <span className="flex items-center gap-1"><i className="ri-time-line"></i> {app.time}</span>
                            </div>
                          </div>
                          <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-medium">
                            {app.type}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
             </div>
          )}

          {activeTab === 'diagnoses' && (
             <div className="glass-panel p-6 rounded-2xl animate-fadeIn">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">AI Diagnosis History</h2>
                  <Link href="/ai-diagnosis" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium">
                    New Diagnosis
                  </Link>
                </div>
                {diagnoses.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <i className="ri-brain-line text-4xl mb-2 opacity-50"></i>
                    <p>No diagnosis history.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {diagnoses.map(d => (
                      <div key={d.id} className="p-4 border border-gray-100 rounded-xl hover:shadow-md transition-all bg-white">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-gray-900">{d.condition}</h3>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{d.symptoms}</p>
                            <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                              <span className="flex items-center gap-1"><i className="ri-calendar-line"></i> {d.date}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="block text-lg font-bold text-primary-600">{d.confidence}%</span>
                            <span className="text-xs text-gray-500">Confidence</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
             </div>
          )}

          {activeTab === 'medications' && (
             <div className="glass-panel p-6 rounded-2xl animate-fadeIn">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Medications</h2>
                  <button onClick={() => setShowAddMedicationModal(true)} className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium">
                    Add Medication
                  </button>
                </div>
                <PrescriptionsList />
             </div>
          )}

          {activeTab === 'devices' && (
             <div className="glass-panel p-6 rounded-2xl animate-fadeIn">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Connected Devices</h2>
                <GoogleFitSync />
             </div>
          )}

          {activeTab === 'health-records' && (
             <div className="glass-panel p-6 rounded-2xl animate-fadeIn">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Health Records</h2>
                  <button onClick={() => setShowAddHealthModal(true)} className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium">
                    Add Record
                  </button>
                </div>
                {healthRecords.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <i className="ri-file-list-3-line text-4xl mb-2 opacity-50"></i>
                    <p>No health records found.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-gray-100 text-gray-500 text-sm">
                          <th className="py-3 px-4 font-medium">Date</th>
                          <th className="py-3 px-4 font-medium">Heart Rate</th>
                          <th className="py-3 px-4 font-medium">Blood Pressure</th>
                          <th className="py-3 px-4 font-medium">Weight</th>
                          <th className="py-3 px-4 font-medium">Notes</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        {healthRecords.map((record, idx) => (
                          <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-4 text-gray-900">{new Date(record.recorded_at).toLocaleDateString()}</td>
                            <td className="py-3 px-4 text-gray-600">{record.heart_rate ? `${record.heart_rate} bpm` : '-'}</td>
                            <td className="py-3 px-4 text-gray-600">{record.blood_pressure_systolic ? `${record.blood_pressure_systolic}/${record.blood_pressure_diastolic}` : '-'}</td>
                            <td className="py-3 px-4 text-gray-600">{record.weight ? `${record.weight} kg` : '-'}</td>
                            <td className="py-3 px-4 text-gray-500 truncate max-w-xs">{record.notes || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
             </div>
          )}
        </div>
      </main>

      {/* Add Health Record Modal */}
      {showAddHealthModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Add Health Record</h3>
              <button onClick={() => setShowAddHealthModal(false)} className="text-gray-400 hover:text-gray-600">
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Heart Rate (bpm)</label>
                <input
                  type="number"
                  value={healthFormData.heartRate}
                  onChange={(e) => setHealthFormData({ ...healthFormData, heartRate: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="72"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Blood Pressure (mmHg)</label>
                <input
                  type="text"
                  value={healthFormData.bloodPressure}
                  onChange={(e) => setHealthFormData({ ...healthFormData, bloodPressure: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="120/80"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  value={healthFormData.weight}
                  onChange={(e) => setHealthFormData({ ...healthFormData, weight: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="70.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={healthFormData.notes}
                  onChange={(e) => setHealthFormData({ ...healthFormData, notes: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none resize-none h-24"
                  placeholder="Feeling good today..."
                />
              </div>
              <button
                onClick={handleSaveHealthData}
                className="w-full bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/20"
              >
                Save Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Medication Modal */}
      {showAddMedicationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Add Medication</h3>
              <button onClick={() => setShowAddMedicationModal(false)} className="text-gray-400 hover:text-gray-600">
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Medication Name</label>
                <input
                  type="text"
                  value={medicationFormData.name}
                  onChange={(e) => setMedicationFormData({ ...medicationFormData, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="e.g. Amoxicillin"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dosage</label>
                  <input
                    type="text"
                    value={medicationFormData.dosage}
                    onChange={(e) => setMedicationFormData({ ...medicationFormData, dosage: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="500mg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                  <input
                    type="text"
                    value={medicationFormData.frequency}
                    onChange={(e) => setMedicationFormData({ ...medicationFormData, frequency: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="Daily"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Remaining</label>
                  <input
                    type="number"
                    value={medicationFormData.remaining}
                    onChange={(e) => setMedicationFormData({ ...medicationFormData, remaining: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Next Refill</label>
                  <input
                    type="date"
                    value={medicationFormData.nextRefill}
                    onChange={(e) => setMedicationFormData({ ...medicationFormData, nextRefill: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
              </div>
              <button
                onClick={handleSaveMedication}
                className="w-full bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/20"
              >
                Save Medication
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}



















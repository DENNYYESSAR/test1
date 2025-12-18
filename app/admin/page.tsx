
'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// Type definitions
interface Clinic {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  specialty: string;
  rating: string;
  services: string;
  insurance: string;
  hours: string;
  latitude: string;
  longitude: string;
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  readTime: string;
  featured: boolean;
  publishDate: string;
}

interface User {
  uid: string;
  displayName: string;
  email: string;
  role: string;
  disabled: boolean;
  metadata: {
    lastSignInTime: string;
    creationTime: string;
  };
}

export default function AdminDashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [isAuthorized, setIsAuthorized] = useState(false);

  // ... useEffect logic remains ...
  useEffect(() => {
    if (!loading) {
      if (user) {
        // For now, allow any logged in user to see dashboard (for demo)
        // In a real app, check user.getIdTokenResult().claims.role === 'admin'
        setIsAuthorized(true);
      } else {
        // Do not redirect to /login. Wait for manual login on this page.
        setIsAuthorized(false);
      }
    }
  }, [user, loading]);

  const handleLogout = async () => {
    try {
      await logout(); // Use context logout which calls firebase.signOut()
      // Optional: keep the API call if it clears server-side cookies
      await fetch('/api/auth/logout', { method: 'POST' }).catch(() => { });
    } catch (error) {
      console.error('Failed to log out:', error);
    } finally {
      localStorage.removeItem('userRole');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('isAuthenticated');
      router.push('/login');
    }
  };

  if (loading) {
    // ... loading state ...
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AdminLogin />;
  }

  if (!isAuthorized) {
    // ... access denied state ...
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="ri-lock-line text-5xl text-red-600"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Access Denied</h1>
          <p className="text-gray-600 mb-6">You don't have permission to access the Admin Portal.</p>
          <div className="space-y-4">
            <button
              onClick={handleLogout}
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all shadow-sm block w-full"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/10 blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-400/10 blur-[100px]"></div>
      </div>

      <div className="pt-10 pb-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Admin Dashboard
                </h1>
                <p className="text-sm md:text-lg text-gray-600">Manage clinics, blog posts, and platform content</p>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 font-medium">
                  Back to Main Site
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <i className="ri-logout-box-line text-xl"></i>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Admin Navigation */}
          <div className="glass-panel mb-8">
            <div className="border-b border-gray-200/50">
              <nav className="flex space-x-2 px-6 overflow-x-auto">
                {['overview', 'clinics', 'doctors', 'blogs', 'reviews', 'users'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 px-6 border-b-3 font-semibold text-sm whitespace-nowrap transition-all duration-300 flex items-center space-x-2 capitalize ${activeTab === tab
                      ? 'border-blue-500 text-blue-600 bg-blue-50/50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50/50'
                      }`}
                  >
                    <i className={`ri-${tab === 'overview' ? 'dashboard' : tab === 'clinics' ? 'hospital' : tab === 'doctors' ? 'nurse' : tab === 'blogs' ? 'article' : 'team'}-line text-lg`}></i>
                    <span>{tab === 'overview' ? 'Dashboard Overview' : tab === 'clinics' ? 'Manage Clinics' : tab === 'doctors' ? 'Manage Doctors' : tab === 'blogs' ? 'Manage Blog Posts' : tab === 'reviews' ? 'User Reviews' : 'User Management'}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-8">
              {activeTab === 'overview' && <DashboardOverview setActiveTab={setActiveTab} />}
              {activeTab === 'clinics' && <ClinicsManagement />}
              {activeTab === 'doctors' && <DoctorsManagement />}
              {activeTab === 'blogs' && <BlogsManagement />}
              {activeTab === 'reviews' && <ReviewsManagement />}
              {activeTab === 'users' && <UsersManagement />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardOverview({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const { user } = useAuth();
  // ... state declarations ...
  const [stats, setStats] = useState({
    users: { total: 0, active: 0, doctors: 0, patients: 0 },
    clinics: 0,
    posts: 0,
    diagnoses: 0,
    system: { status: 'Operational', uptime: '100%', activeUsers: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      try {
        const token = await user.getIdToken();
        const res = await fetch('/api/admin/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error('Failed to fetch stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  // Placeholder data for sections not yet connected to API
  const [recentActivities] = useState([
    { id: 1, type: 'alert', icon: 'ri-alert-line', color: 'blue', message: 'System initialized', user: 'System', time: 'Just now' }
  ]);

  const [upcomingTasks] = useState<any[]>([]);

  return (
    <div className="space-y-6">
      {/* Status Banner */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-xl flex items-center justify-between shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <i className="ri-checkbox-circle-line text-2xl"></i>
          </div>
          <div>
            <p className="text-sm font-medium opacity-90">System Status</p>
            <p className="text-xl font-bold">All Systems {stats.system.status}</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center space-x-6 text-sm">
          <div className="text-center">
            <p className="opacity-90">Uptime</p>
            <p className="font-bold text-lg">{stats.system.uptime}</p>
          </div>
          <div className="text-center">
            <p className="opacity-90">Total Users</p>
            <p className="font-bold text-lg">{stats.users.total}</p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {/* Total Users */}
        <div className="glass-panel p-4 md:p-6 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg">
              <i className="ri-team-line text-white text-lg md:text-2xl"></i>
            </div>
            <div className="text-right">
              <p className="text-xs md:text-sm text-gray-600 font-medium">Total Users</p>
              <p className="text-xl md:text-3xl font-bold text-gray-900">{stats.users.total}</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between text-xs md:text-sm gap-1 md:gap-0">
            <span className="text-gray-500 font-medium">{stats.users.doctors} Doctors</span>
            <span className="text-blue-600 font-semibold">{stats.users.patients} Patients</span>
          </div>
        </div>

        {/* Total Clinics */}
        <div className="glass-panel p-4 md:p-6 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg">
              <i className="ri-hospital-line text-white text-lg md:text-2xl"></i>
            </div>
            <div className="text-right">
              <p className="text-xs md:text-sm text-gray-600 font-medium">Active Clinics</p>
              <p className="text-xl md:text-3xl font-bold text-gray-900">{stats.clinics}</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs md:text-sm">
            <span className="text-green-600 font-semibold">Live on platform</span>
          </div>
        </div>

        {/* Blog Posts */}
        <div className="glass-panel p-4 md:p-6 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg">
              <i className="ri-article-line text-white text-lg md:text-2xl"></i>
            </div>
            <div className="text-right">
              <p className="text-xs md:text-sm text-gray-600 font-medium">Blog Posts</p>
              <p className="text-xl md:text-3xl font-bold text-gray-900">{stats.posts}</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs md:text-sm">
            <span className="text-cyan-600 font-semibold">Published content</span>
          </div>
        </div>

        {/* AI Diagnoses */}
        <div className="glass-panel p-4 md:p-6 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg">
              <i className="ri-brain-line text-white text-lg md:text-2xl"></i>
            </div>
            <div className="text-right">
              <p className="text-xs md:text-sm text-gray-600 font-medium">AI Diagnoses</p>
              <p className="text-xl md:text-3xl font-bold text-gray-900">{stats.diagnoses}</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs md:text-sm">
            <span className="text-green-600 font-semibold">Total processed</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="glass-panel">
          <div className="p-6 border-b border-gray-200/50">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                <i className="ri-time-line text-blue-600"></i>
                <span>Recent Activities</span>
              </h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-semibold">
                View All
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {recentActivities.map((activity: any, index: number) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-4 p-4 bg-gray-50/50 rounded-xl hover:bg-gray-100/50 transition-all"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className={`w-10 h-10 bg-${activity.color}-100 rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <i className={`${activity.icon} text-${activity.color}-600 text-lg`}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{activity.message}</p>
                    <p className="text-sm text-gray-600">{activity.user}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="glass-panel">
          <div className="p-6 border-b border-gray-200/50">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                <i className="ri-task-line text-purple-600"></i>
                <span>Upcoming Tasks</span>
              </h3>
              <button className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-purple-700 hover:to-purple-800 transition-all">
                Add Task
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {upcomingTasks.map((task: any, index: number) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl hover:bg-gray-100/50 transition-all group"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <input
                      type="checkbox"
                      className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                        {task.task}
                      </p>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${task.priority === 'high' ? 'bg-red-100 text-red-600' :
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                            'bg-green-100 text-green-600'
                          }`}>
                          {task.priority.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center">
                          <i className="ri-time-line mr-1"></i>
                          {task.dueTime}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-all">
                    <i className="ri-more-2-fill text-xl"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-100 shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
          <i className="ri-flashlight-line text-yellow-600"></i>
          <span>Quick Actions</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => setActiveTab('clinics')}
            className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all group">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform">
              <i className="ri-add-line text-white text-2xl"></i>
            </div>
            <p className="text-sm font-semibold text-gray-900">Add New Clinic</p>
          </button>
          <button
            onClick={() => setActiveTab('blogs')}
            className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:from-purple-100 hover:to-purple-200 transition-all group">
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform">
              <i className="ri-file-add-line text-white text-2xl"></i>
            </div>
            <p className="text-sm font-semibold text-gray-900">Create Blog Post</p>
          </button>
          <button
            onClick={() => alert('Analytics Module coming soon!')}
            className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl hover:from-green-100 hover:to-green-200 transition-all group">
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform">
              <i className="ri-bar-chart-line text-white text-2xl"></i>
            </div>
            <p className="text-sm font-semibold text-gray-900">View Analytics</p>
          </button>
          <button
            onClick={() => alert('Settings Panel coming soon!')}
            className="p-6 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl hover:from-cyan-100 hover:to-cyan-200 transition-all group">
            <div className="w-12 h-12 bg-cyan-600 rounded-xl flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform">
              <i className="ri-settings-3-line text-white text-2xl"></i>
            </div>
            <p className="text-sm font-semibold text-gray-900">System Settings</p>
          </button>
        </div>
      </div>
    </div>
  );
}

function ClinicsManagement() {
  const { user } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingClinic, setEditingClinic] = useState<Clinic | null>(null);
  const [viewingClinic, setViewingClinic] = useState<Clinic | null>(null);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState<Partial<Clinic>>({
    name: '',
    address: '',
    phone: '',
    email: '',
    specialty: '',
    rating: '4.5',
    services: '',
    insurance: '',
    hours: '',
    latitude: '',
    longitude: ''
  });

  const specialties = [
    'General Practice',
    'Family Medicine',
    'Cardiology',
    'Urgent Care',
    'Women\'s Health',
    'Pediatrics',
    'Dermatology',
    'Orthopedics'
  ];

  useEffect(() => {
    fetchClinics();
  }, []);

  const fetchClinics = async () => {
    try {
      const res = await fetch('/api/clinics');
      if (res.ok) {
        const data = await res.json();
        setClinics(data.clinics);
      }
    } catch (e) {
      console.error('Failed to fetch clinics', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    try {
      const token = await user.getIdToken();
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      if (editingClinic) {
        // Update
        const res = await fetch('/api/clinics', {
          method: 'PUT',
          headers,
          body: JSON.stringify({ ...formData, id: editingClinic.id })
        });
        if (res.ok) {
          alert('Clinic updated successfully');
          fetchClinics();
        }
      } else {
        // Create
        const res = await fetch('/api/clinics', {
          method: 'POST',
          headers,
          body: JSON.stringify(formData)
        });
        if (res.ok) {
          alert('Clinic created successfully');
          fetchClinics();
        }
      }
      setShowAddForm(false);
      resetForm();
      setEditingClinic(null);
    } catch (e) {
      alert('Operation failed');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      phone: '',
      email: '',
      specialty: '',
      rating: '4.5',
      services: '',
      insurance: '',
      hours: '',
      latitude: '',
      longitude: ''
    });
  };

  const handleEdit = (clinic: Clinic) => {
    setEditingClinic(clinic);
    setFormData(clinic);
    setShowAddForm(true);
  };

  const handleView = (clinic: Clinic) => {
    setViewingClinic(clinic);
  };

  const handleDelete = async (clinicId: string) => {
    if (!user) return;
    if (confirm('Are you sure you want to delete this clinic?')) {
      try {
        const token = await user.getIdToken();
        const res = await fetch(`/api/clinics?id=${clinicId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          setClinics(prev => prev.filter(c => c.id !== clinicId));
        } else {
          alert('Failed to delete clinic');
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingClinic(null);
    resetForm();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Clinics Management</h2>
        <button
          onClick={() => {
            if (showAddForm) {
              handleCancel();
            } else {
              setShowAddForm(true);
            }
          }}
          className={`${showAddForm
            ? 'bg-gray-500 hover:bg-gray-600'
            : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600'
            } text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2`}
        >
          <i className={`ri-${showAddForm ? 'close' : 'add'}-line text-xl`}></i>
          <span>{showAddForm ? 'Cancel' : 'Add New Clinic'}</span>
        </button>
      </div>

      {/* View Clinic Modal */}
      {viewingClinic && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="glass-panel max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-6 rounded-t-3xl">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <i className="ri-hospital-line text-2xl"></i>
                  </div>
                  <h3 className="text-2xl font-bold">Clinic Details</h3>
                </div>
                <button
                  onClick={() => setViewingClinic(null)}
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-all"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50/50 p-4 rounded-xl">
                  <label className="block text-sm font-semibold text-blue-900 mb-1">Clinic Name</label>
                  <p className="text-gray-900 font-medium">{viewingClinic.name}</p>
                </div>
                <div className="bg-cyan-50/50 p-4 rounded-xl">
                  <label className="block text-sm font-semibold text-cyan-900 mb-1">Specialty</label>
                  <p className="text-gray-900 font-medium">{viewingClinic.specialty}</p>
                </div>
              </div>

              <div className="bg-purple-50/50 p-4 rounded-xl">
                <label className="block text-sm font-semibold text-purple-900 mb-1">Address</label>
                <p className="text-gray-900 font-medium">{viewingClinic.address}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50/50 p-4 rounded-xl">
                  <label className="block text-sm font-semibold text-green-900 mb-1">Phone</label>
                  <p className="text-gray-900 font-medium">{viewingClinic.phone}</p>
                </div>
                <div className="bg-orange-50/50 p-4 rounded-xl">
                  <label className="block text-sm font-semibold text-orange-900 mb-1">Email</label>
                  <p className="text-gray-900 font-medium">{viewingClinic.email}</p>
                </div>
              </div>

              <div className="bg-pink-50/50 p-4 rounded-xl">
                <label className="block text-sm font-semibold text-pink-900 mb-1">Services</label>
                <p className="text-gray-900 font-medium">{viewingClinic.services}</p>
              </div>

              <div className="bg-indigo-50/50 p-4 rounded-xl">
                <label className="block text-sm font-semibold text-indigo-900 mb-1">Insurance Accepted</label>
                <p className="text-gray-900 font-medium">{viewingClinic.insurance}</p>
              </div>

              <div className="bg-teal-50/50 p-4 rounded-xl">
                <label className="block text-sm font-semibold text-teal-900 mb-1">Hours</label>
                <p className="text-gray-900 font-medium">{viewingClinic.hours}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-yellow-50/50 p-4 rounded-xl">
                  <label className="block text-sm font-semibold text-yellow-900 mb-1">Rating</label>
                  <p className="text-gray-900 font-medium text-xl">{viewingClinic.rating} ⭐</p>
                </div>
                <div className="bg-gray-50/50 p-4 rounded-xl">
                  <label className="block text-sm font-semibold text-gray-900 mb-1">Location</label>
                  <p className="text-gray-700 font-mono text-sm">{viewingClinic.latitude}, {viewingClinic.longitude}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddForm && (
        <div className="glass-panel p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{editingClinic ? 'Edit Clinic' : 'Add New Clinic'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Clinic Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                rows={2}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specialty *</label>
                <select
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 pr-8 border border-gray-200 rounded-lg bg-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Specialty</option>
                  {specialties.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Services (comma separated)</label>
                <textarea
                  name="services"
                  value={formData.services}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Primary Care, Emergency Services, Lab Tests"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Accepted Insurance (comma separated)</label>
                <textarea
                  name="insurance"
                  value={formData.insurance}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Blue Cross, Aetna, Cigna"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hours of Operation</label>
              <input
                type="text"
                name="hours"
                value={formData.hours}
                onChange={handleChange}
                placeholder="Mon-Fri: 8:00 AM - 6:00 PM"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                <input
                  type="text"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  placeholder="40.7128"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                <input
                  type="text"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  placeholder="-74.0060"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-cyan-600 transition-all shadow-md hover:shadow-lg cursor-pointer whitespace-nowrap"
              >
                {editingClinic ? 'Update Clinic' : 'Add Clinic'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="border border-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Existing Clinics List */}
      <div className="glass-panel overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200/50 bg-gradient-to-r from-blue-50/50 to-cyan-50/50">
          <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
            <i className="ri-hospital-line text-blue-600"></i>
            <span>Existing Clinics ({clinics.length})</span>
          </h3>
        </div>
        <div className="divide-y divide-gray-200/50">
          {clinics.map((clinic, index) => (
            <div
              key={clinic.id}
              className="px-6 py-5 hover:bg-blue-50/30 transition-all duration-300 flex items-center justify-between flex-wrap gap-4"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <i className="ri-hospital-line text-white text-lg"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">{clinic.name}</h4>
                    <p className="text-sm text-gray-600">
                      <i className="ri-stethoscope-line mr-1"></i>
                      {clinic.specialty} • {clinic.rating} ⭐
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 ml-13 flex items-start">
                  <i className="ri-map-pin-line mr-1 mt-0.5"></i>
                  {clinic.address}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleView(clinic)}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-md hover:shadow-lg transform hover:scale-105 flex items-center space-x-1"
                >
                  <i className="ri-eye-line"></i>
                  <span>View</span>
                </button>
                <button
                  onClick={() => handleEdit(clinic)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-md hover:shadow-lg transform hover:scale-105 flex items-center space-x-1"
                >
                  <i className="ri-edit-line"></i>
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(clinic.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-md hover:shadow-lg transform hover:scale-105 flex items-center space-x-1"
                >
                  <i className="ri-delete-bin-line"></i>
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BlogsManagement() {
  const { user } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [viewingPost, setViewingPost] = useState<BlogPost | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    author: '',
    readTime: '',
    featured: false
  });

  const categories = ['AI & Technology', 'Preventive Care', 'Mental Health', 'Nutrition', 'Fitness'];

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts');
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    try {
      const token = await user.getIdToken();
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      if (editingPost) {
        // Update
        const res = await fetch('/api/posts', {
          method: 'PUT',
          headers,
          body: JSON.stringify({ ...formData, id: editingPost.id })
        });
        if (res.ok) {
          alert('Post updated successfully');
          fetchPosts();
        }
      } else {
        // Create
        const res = await fetch('/api/posts', {
          method: 'POST',
          headers,
          body: JSON.stringify(formData)
        });
        if (res.ok) {
          alert('Post created successfully');
          fetchPosts();
        }
      }
      setShowAddForm(false);
      resetForm();
      setEditingPost(null);
    } catch (e) {
      alert('Operation failed');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      category: '',
      author: '',
      readTime: '',
      featured: false
    });
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData(post);
    setShowAddForm(true);
  };

  const handleView = (post: BlogPost) => {
    setViewingPost(post);
  };

  const handleDelete = async (postId: string) => {
    if (!user) return;
    if (confirm('Are you sure you want to delete this blog post?')) {
      try {
        const token = await user.getIdToken();
        const res = await fetch(`/api/posts?id=${postId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          setPosts(prev => prev.filter(p => p.id !== postId));
        } else {
          alert('Failed to delete post');
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingPost(null);
    resetForm();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Blog Posts Management</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap"
        >
          {showAddForm ? 'Cancel' : 'Add New Post'}
        </button>
      </div>

      {/* View Post Modal */}
      {viewingPost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="glass-panel max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Blog Post Preview</h3>
                <button
                  onClick={() => setViewingPost(null)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{viewingPost.title}</h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <span>{viewingPost.author}</span>
                    <span>•</span>
                    <span>{viewingPost.category}</span>
                    <span>•</span>
                    <span>{viewingPost.readTime} min read</span>
                    <span>•</span>
                    <span>{viewingPost.publishDate}</span>
                    {viewingPost.featured && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">Featured</span>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Excerpt:</h4>
                  <p className="text-gray-600 italic">{viewingPost.excerpt}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Content:</h4>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed">{viewingPost.content}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddForm && (
        <div className="glass-panel p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{editingPost ? 'Edit Blog Post' : 'Add New Blog Post'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt *</label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                required
                rows={3}
                maxLength={500}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">{formData.excerpt?.length || 0}/500 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows={10}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 pr-8 border border-gray-200 rounded-lg bg-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Author *</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  required
                  placeholder="Dr. John Smith"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Read Time (minutes)</label>
                <input
                  type="text"
                  name="readTime"
                  value={formData.readTime}
                  onChange={handleChange}
                  placeholder="5"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="ml-2 text-sm text-gray-700">Featured Post</label>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg cursor-pointer whitespace-nowrap"
              >
                {editingPost ? 'Update Post' : 'Publish Post'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="border border-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Existing Posts */}
      <div className="glass-panel">
        <div className="px-6 py-4 border-b border-gray-200/50">
          <h3 className="text-lg font-medium text-gray-900">Published Posts ({posts.length})</h3>
        </div>
        <div className="divide-y divide-gray-200/50">
          {posts.map((post) => (
            <div key={post.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-medium text-gray-900">{post.title}</h4>
                  {post.featured && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">Featured</span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{post.category} • {post.author} • {post.readTime} min read</p>
                <p className="text-sm text-gray-500">Published {post.publishDate}</p>
              </div>
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => handleView(post)}
                  className="text-green-600 hover:text-green-700 px-3 py-1 rounded cursor-pointer whitespace-nowrap"
                >
                  View
                </button>
                <button
                  onClick={() => handleEdit(post)}
                  className="text-blue-600 hover:text-blue-700 px-3 py-1 rounded cursor-pointer whitespace-nowrap"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="text-red-600 hover:text-red-700 px-3 py-1 rounded cursor-pointer whitespace-nowrap"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DoctorsManagement() {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingDoctor, setEditingDoctor] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Edit Form Data
  const [formData, setFormData] = useState({
    specialty: '',
    bio: '',
    experience: '',
    consultationFee: '',
    availability: ''
  });

  // Add Form Data
  const [addFormData, setAddFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    specialty: '',
    bio: '',
    experience: '',
    consultationFee: ''
  });

  useEffect(() => {
    fetchDoctors();
  }, [user]);

  const fetchDoctors = async () => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/doctors', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setDoctors(data.doctors);
      }
    } catch (error) {
      console.error('Failed to fetch doctors', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (doctor: any) => {
    setEditingDoctor(doctor);
    setFormData({
      specialty: doctor.specialty || '',
      bio: doctor.bio || '',
      experience: doctor.experience || '',
      consultationFee: doctor.consultationFee || '',
      availability: doctor.availability || ''
    });
    setShowEditModal(true);
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !editingDoctor) return;

    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/doctors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: editingDoctor.id,
          ...formData
        })
      });

      if (response.ok) {
        setShowEditModal(false);
        fetchDoctors();
        alert('Doctor profile updated successfully');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating doctor:', error);
      alert('Failed to update doctor profile');
    }
  };

  const handleAddDoctor = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...addFormData,
          role: 'doctor'
        })
      });

      const data = await response.json();

      if (response.ok) {
        setShowAddModal(false);
        setAddFormData({
          email: '',
          password: '',
          displayName: '',
          specialty: '',
          bio: '',
          experience: '',
          consultationFee: ''
        });
        fetchDoctors();
        alert('Doctor account created successfully');
      } else {
        throw new Error(data.error || 'Failed to create doctor');
      }
    } catch (error: any) {
      console.error('Error creating doctor:', error);
      alert(error.message || 'Failed to create doctor account');
    }
  };

  const handleDelete = async (doctorId: string) => {
    if (!user) return;
    if (confirm('Are you sure you want to delete this doctor account? This action cannot be undone.')) {
      try {
        const token = await user.getIdToken();
        const res = await fetch(`/api/doctors?id=${doctorId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          setDoctors(prev => prev.filter(d => d.id !== doctorId));
          alert('Doctor account deleted successfully');
        } else {
          alert('Failed to delete doctor account');
        }
      } catch (e) {
        console.error(e);
        alert('An error occurred while deleting');
      }
    }
  };

  if (loading) return <div className="text-center p-8">Loading doctors...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Doctors Management</h2>
          <div className="text-sm text-gray-500">
            Manage doctor profiles and availability
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-md"
        >
          <i className="ri-user-add-line"></i>
          Add New Doctor
        </button>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200/50">
          <h3 className="text-lg font-medium text-gray-900">Registered Doctors ({doctors.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200/50">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/50">
              {doctors.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center overflow-hidden">
                        {doc.photoURL ? (
                          <img src={doc.photoURL} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <i className="ri-user-md-line text-blue-600"></i>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                        <div className="text-xs text-gray-500">{doc.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {doc.specialty || 'General'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${doc.status === 'online' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                      {doc.status || 'Offline'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(doc)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit Profile
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Doctor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Add New Doctor</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>
            <form onSubmit={handleAddDoctor} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={addFormData.displayName}
                    onChange={e => setAddFormData({ ...addFormData, displayName: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Dr. John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Specialty *</label>
                  <input
                    type="text"
                    required
                    value={addFormData.specialty}
                    onChange={e => setAddFormData({ ...addFormData, specialty: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. Cardiologist"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={addFormData.email}
                    onChange={e => setAddFormData({ ...addFormData, email: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="doctor@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={addFormData.password}
                    onChange={e => setAddFormData({ ...addFormData, password: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience (Years)</label>
                  <input
                    type="text"
                    value={addFormData.experience}
                    onChange={e => setAddFormData({ ...addFormData, experience: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. 10 years"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Fee</label>
                  <input
                    type="text"
                    value={addFormData.consultationFee}
                    onChange={e => setAddFormData({ ...addFormData, consultationFee: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. $50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  value={addFormData.bio}
                  onChange={e => setAddFormData({ ...addFormData, bio: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none"
                  placeholder="Doctor's biography..."
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                >
                  Create Doctor Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Edit Doctor Profile</h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
                <input
                  type="text"
                  value={formData.specialty}
                  onChange={e => setFormData({ ...formData, specialty: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Cardiologist"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience (Years)</label>
                <input
                  type="text"
                  value={formData.experience}
                  onChange={e => setFormData({ ...formData, experience: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. 10 years"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Fee</label>
                <input
                  type="text"
                  value={formData.consultationFee}
                  onChange={e => setFormData({ ...formData, consultationFee: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. $50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={e => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none"
                  placeholder="Doctor's biography..."
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function ReviewsManagement() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/admin/reviews', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (e) {
      console.error('Failed to fetch reviews', e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!user || !confirm('Are you sure you want to delete this review?')) return;
    try {
      const token = await user.getIdToken();
      const res = await fetch(`/api/admin/reviews?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setReviews(prev => prev.filter(r => r.id !== id));
      } else {
        alert('Failed to delete review');
      }
    } catch (e) {
      console.error(e);
      alert('Error deleting review');
    }
  };

  if (loading) return <div>Loading reviews...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">User Reviews</h2>
      <div className="grid gap-6">
        {reviews.map((review) => (
          <div key={review.id} className="glass-panel p-6 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-bold text-lg">{review.name}</h3>
                <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full">{review.role}</span>
                <span className="text-sm text-gray-500">{new Date(review.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex text-yellow-400 mb-2">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className={`ri-star-${i < review.rating ? 'fill' : 'line'}`}></i>
                ))}
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
            <button
              onClick={() => handleDelete(review.id)}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete Review"
            >
              <i className="ri-delete-bin-line text-xl"></i>
            </button>
          </div>
        ))}
        {reviews.length === 0 && (
          <p className="text-gray-500 text-center py-10">No reviews found.</p>
        )}
      </div>
    </div>
  );
}

function UsersManagement() {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, [user]);

  const fetchUsers = async () => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (uid: string, newRole: string) => {
    try {
      if (!user) return;
      const token = await user.getIdToken();
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ uid, role: newRole, action: 'setRole' })
      });

      if (response.ok) {
        alert(`User role updated to ${newRole}`);
        fetchUsers();
      }
    } catch (error) {
      alert('Failed to update role');
    }
  };

  const handleDelete = async (uid: string) => {
    if (!user) return;
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        const token = await user.getIdToken();
        const res = await fetch(`/api/admin/users?uid=${uid}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          setUsers(prev => prev.filter(u => u.uid !== uid));
          alert('User deleted successfully');
        } else {
          alert('Failed to delete user');
        }
      } catch (e) {
        console.error(e);
        alert('An error occurred while deleting');
      }
    }
  };

  if (!user) {
    return <AdminLogin />;
  }

  if (loading) return <div className="text-center p-8">Loading users...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">User Management</h2>

      <div className="glass-panel overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200/50">
          <h3 className="text-lg font-medium text-gray-900">Registered Users ({users.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200/50">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/50">
              {users.map((u) => (
                <tr key={u.uid} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                        {u.photoURL ? (
                          <img src={u.photoURL} alt="" className="w-10 h-10 rounded-full" />
                        ) : (
                          <i className="ri-user-line text-blue-600"></i>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{u.displayName || 'Unnamed User'}</div>
                        <div className="text-xs text-gray-500">{u.uid.substring(0, 8)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                      u.role === 'doctor' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                      {u.role ? u.role.toUpperCase() : 'PATIENT'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${!u.disabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                    >
                      {!u.disabled ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center gap-3">
                    <select
                      value={u.role || 'patient'}
                      onChange={(e) => handleRoleChange(u.uid, e.target.value)}
                      className="text-sm border border-gray-200 rounded-lg p-1 bg-white/50 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="patient">Patient</option>
                      <option value="doctor">Doctor</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button
                      onClick={() => handleDelete(u.uid)}
                      className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-colors"
                      title="Delete User"
                    >
                      <i className="ri-delete-bin-line text-lg"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // const router = useRouter(); // useRouter is not used in the provided snippet, commenting out

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      const { auth } = await import('@/lib/firebase');
      await signInWithEmailAndPassword(auth, email, password);
      // AuthContext will update 'user' and the main component will re-render
    } catch (err: any) {
      console.error('Login failed', err);
      setError('Invalid admin credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full glass-panel p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
            <i className="ri-admin-line text-4xl text-white"></i>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
          <p className="text-gray-500">Sign in to manage the platform</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-lg text-sm flex items-center border border-red-100">
            <i className="ri-error-warning-line mr-2"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Admin Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="admin@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 transform hover:-translate-y-0.5"
          >
            {isLoading ? 'Authenticating...' : 'Access Portal'}
          </button>
        </form>
      </div>
    </div>
  );
}

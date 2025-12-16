'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Dropdown from '../../components/Dropdown';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function Profile() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    bloodType: '',
    height: '',
    weight: '',
    address: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
    insurance: '',
    insurancePolicyNumber: '',
    allergies: '',
    chronicConditions: '',
    currentMedications: ''
  });

  const genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say'];
  const bloodTypeOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'];
  const relationOptions = ['Spouse', 'Parent', 'Child', 'Sibling', 'Friend', 'Other'];

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    const fetchProfileData = async () => {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setProfileData({
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: user.email || '',
            phone: userData.phone || '',
            dateOfBirth: userData.dateOfBirth || '',
            gender: userData.gender || '',
            bloodType: userData.bloodType || '',
            height: userData.height || '',
            weight: userData.weight || '',
            address: userData.address || '',
            emergencyContactName: userData.emergencyContactName || '',
            emergencyContactPhone: userData.emergencyContactPhone || '',
            emergencyContactRelation: userData.emergencyContactRelation || '',
            insurance: userData.insurance || '',
            insurancePolicyNumber: userData.insurancePolicyNumber || '',
            allergies: userData.allergies || '',
            chronicConditions: userData.chronicConditions || '',
            currentMedications: userData.currentMedications || ''
          });
        } else {
          // If no profile exists, set email from auth
          setProfileData(prev => ({ ...prev, email: user.email || '' }));
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user, authLoading, router]);

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        ...profileData,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="ri-loader-4-line text-4xl text-blue-600 animate-spin"></i>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full"></div>
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <Header />

      <div className="pt-32 pb-16 relative">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div className="mb-4 md:mb-0">
              <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full text-blue-600 text-sm font-medium mb-4 border border-blue-100">
                <i className="ri-user-line mr-2"></i>
                Personal Profile
              </div>
              <h1 className="text-4xl font-bold text-gray-900">My Profile</h1>
              <p className="text-gray-600 mt-2 text-lg">Manage your personal information and health data</p>
            </div>
            <button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              disabled={saving}
              className={`px-8 py-4 rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center ${isEditing
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-green-500/20'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/20'
                }`}
            >
              {saving ? (
                <>
                  <i className="ri-loader-4-line mr-2 text-lg animate-spin"></i>
                  Saving...
                </>
              ) : (
                <>
                  <i className={`ri-${isEditing ? 'save' : 'edit'}-line mr-2 text-lg`}></i>
                  {isEditing ? 'Save Changes' : 'Edit Profile'}
                </>
              )}
            </button>
          </div>

          <div className="space-y-8">
            {/* Personal Information */}
            <div className="glass-panel p-8 rounded-3xl shadow-xl bg-white/50 backdrop-blur-xl border border-white/20">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <i className="ri-user-line text-white text-xl"></i>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                    <i className="ri-user-line text-blue-500"></i>
                    <span>First Name</span>
                  </label>
                  <input
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border rounded-xl text-sm transition-all ${isEditing
                      ? 'border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white/50'
                      : 'border-gray-200 bg-gray-50/50 text-gray-600'
                      }`}
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                    <i className="ri-user-line text-blue-500"></i>
                    <span>Last Name</span>
                  </label>
                  <input
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border rounded-xl text-sm transition-all ${isEditing
                      ? 'border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white/50'
                      : 'border-gray-200 bg-gray-50/50 text-gray-600'
                      }`}
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                    <i className="ri-mail-line text-indigo-500"></i>
                    <span>Email</span>
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border rounded-xl text-sm transition-all ${isEditing
                      ? 'border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white/50'
                      : 'border-gray-200 bg-gray-50/50 text-gray-600'
                      }`}
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                    <i className="ri-phone-line text-blue-500"></i>
                    <span>Phone</span>
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border rounded-xl text-sm transition-all ${isEditing
                      ? 'border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white/50'
                      : 'border-gray-200 bg-gray-50/50 text-gray-600'
                      }`}
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                    <i className="ri-calendar-line text-indigo-500"></i>
                    <span>Date of Birth</span>
                  </label>
                  <input
                    type="date"
                    value={profileData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border rounded-xl text-sm transition-all ${isEditing
                      ? 'border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white/50'
                      : 'border-gray-200 bg-gray-50/50 text-gray-600'
                      }`}
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                    <i className="ri-user-heart-line text-blue-500"></i>
                    <span>Gender</span>
                  </label>
                  {isEditing ? (
                    <Dropdown
                      options={genderOptions}
                      value={profileData.gender}
                      onChange={(value: string) => handleInputChange('gender', value)}
                      className="w-full"
                    />
                  ) : (
                    <input
                      type="text"
                      value={profileData.gender}
                      disabled
                      className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-600"
                    />
                  )}
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                    <i className="ri-map-pin-line text-indigo-500"></i>
                    <span>Address</span>
                  </label>
                  <textarea
                    value={profileData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    disabled={!isEditing}
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-xl text-sm resize-none transition-all ${isEditing
                      ? 'border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white/50'
                      : 'border-gray-200 bg-gray-50/50 text-gray-600'
                      }`}
                  />
                </div>
              </div>
            </div>

            {/* Health Information */}
            <div className="glass-panel p-8 rounded-3xl shadow-xl bg-white/50 backdrop-blur-xl border border-white/20">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/20">
                  <i className="ri-heart-pulse-line text-white text-xl"></i>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Health Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                    <i className="ri-drop-line text-red-500"></i>
                    <span>Blood Type</span>
                  </label>
                  {isEditing ? (
                    <Dropdown
                      options={bloodTypeOptions}
                      value={profileData.bloodType}
                      onChange={(value: string) => handleInputChange('bloodType', value)}
                      className="w-full"
                    />
                  ) : (
                    <input
                      type="text"
                      value={profileData.bloodType}
                      disabled
                      className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-600"
                    />
                  )}
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                    <i className="ri-ruler-line text-blue-500"></i>
                    <span>Height</span>
                  </label>
                  <input
                    type="text"
                    value={profileData.height}
                    onChange={(e) => handleInputChange('height', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border rounded-xl text-sm transition-all ${isEditing
                      ? 'border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white/50'
                      : 'border-gray-200 bg-gray-50/50 text-gray-600'
                      }`}
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                    <i className="ri-scales-line text-orange-500"></i>
                    <span>Weight</span>
                  </label>
                  <input
                    type="text"
                    value={profileData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border rounded-xl text-sm transition-all ${isEditing
                      ? 'border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white/50'
                      : 'border-gray-200 bg-gray-50/50 text-gray-600'
                      }`}
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                    <i className="ri-virus-line text-purple-500"></i>
                    <span>Allergies</span>
                  </label>
                  <input
                    type="text"
                    value={profileData.allergies}
                    onChange={(e) => handleInputChange('allergies', e.target.value)}
                    disabled={!isEditing}
                    placeholder="List any known allergies"
                    className={`w-full px-4 py-3 border rounded-xl text-sm transition-all ${isEditing
                      ? 'border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white/50'
                      : 'border-gray-200 bg-gray-50/50 text-gray-600'
                      }`}
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                    <i className="ri-hospital-line text-red-500"></i>
                    <span>Chronic Conditions</span>
                  </label>
                  <textarea
                    value={profileData.chronicConditions}
                    onChange={(e) => handleInputChange('chronicConditions', e.target.value)}
                    disabled={!isEditing}
                    rows={2}
                    placeholder="List any chronic medical conditions"
                    className={`w-full px-4 py-3 border rounded-xl text-sm resize-none transition-all ${isEditing
                      ? 'border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white/50'
                      : 'border-gray-200 bg-gray-50/50 text-gray-600'
                      }`}
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                    <i className="ri-capsule-line text-blue-500"></i>
                    <span>Current Medications</span>
                  </label>
                  <textarea
                    value={profileData.currentMedications}
                    onChange={(e) => handleInputChange('currentMedications', e.target.value)}
                    disabled={!isEditing}
                    rows={2}
                    placeholder="List current medications and dosages"
                    className={`w-full px-4 py-3 border rounded-xl text-sm resize-none transition-all ${isEditing
                      ? 'border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white/50'
                      : 'border-gray-200 bg-gray-50/50 text-gray-600'
                      }`}
                  />
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="glass-panel p-8 rounded-3xl shadow-xl bg-white/50 backdrop-blur-xl border border-white/20">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/20">
                  <i className="ri-alarm-warning-line text-white text-xl"></i>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Emergency Contact</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                    <i className="ri-user-star-line text-yellow-500"></i>
                    <span>Contact Name</span>
                  </label>
                  <input
                    type="text"
                    value={profileData.emergencyContactName}
                    onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border rounded-xl text-sm transition-all ${isEditing
                      ? 'border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white/50'
                      : 'border-gray-200 bg-gray-50/50 text-gray-600'
                      }`}
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                    <i className="ri-phone-line text-green-500"></i>
                    <span>Contact Phone</span>
                  </label>
                  <input
                    type="tel"
                    value={profileData.emergencyContactPhone}
                    onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border rounded-xl text-sm transition-all ${isEditing
                      ? 'border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white/50'
                      : 'border-gray-200 bg-gray-50/50 text-gray-600'
                      }`}
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                    <i className="ri-group-line text-blue-500"></i>
                    <span>Relationship</span>
                  </label>
                  {isEditing ? (
                    <Dropdown
                      options={relationOptions}
                      value={profileData.emergencyContactRelation}
                      onChange={(value: string) => handleInputChange('emergencyContactRelation', value)}
                      className="w-full"
                    />
                  ) : (
                    <input
                      type="text"
                      value={profileData.emergencyContactRelation}
                      disabled
                      className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-600"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Insurance Information */}
            <div className="glass-panel p-8 rounded-3xl shadow-xl bg-white/50 backdrop-blur-xl border border-white/20">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                  <i className="ri-shield-check-line text-white text-xl"></i>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Insurance Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                    <i className="ri-building-line text-indigo-500"></i>
                    <span>Insurance Provider</span>
                  </label>
                  <input
                    type="text"
                    value={profileData.insurance}
                    onChange={(e) => handleInputChange('insurance', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border rounded-xl text-sm transition-all ${isEditing
                      ? 'border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white/50'
                      : 'border-gray-200 bg-gray-50/50 text-gray-600'
                      }`}
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                    <i className="ri-file-list-line text-blue-500"></i>
                    <span>Policy Number</span>
                  </label>
                  <input
                    type="text"
                    value={profileData.insurancePolicyNumber}
                    onChange={(e) => handleInputChange('insurancePolicyNumber', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border rounded-xl text-sm transition-all ${isEditing
                      ? 'border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white/50'
                      : 'border-gray-200 bg-gray-50/50 text-gray-600'
                      }`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
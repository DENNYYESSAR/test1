
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
// import { authApi } from '@/lib/api'; // Removed for Firebase migration

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    gender: '',
    phone: '',
    agreeToTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Gender selection is required';
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setSubmitError('');
    setSuccessMessage('');

    try {
      // Dynamic import
      const { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } = await import('firebase/auth');
      const { auth, db } = await import('@/lib/firebase');
      const { doc, setDoc, serverTimestamp } = await import('firebase/firestore');

      // 1. Create User in Auth
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // 2. Update Display Name
      await updateProfile(user, {
        displayName: `${formData.firstName} ${formData.lastName}`
      });

      // 3. Create User Document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        role: 'user', // Default role
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        phone: formData.phone || '',
        agreeToTerms: formData.agreeToTerms,
        createdAt: serverTimestamp(),
        preferences: {
          notifications: true,
          theme: 'light'
        }
      });

      // 4. Send Verification Email
      await sendEmailVerification(user);

      // Show success message
      setSuccessMessage('Account created successfully! Please check your email to verify your account.');
      setShowSuccessModal(true);
      setIsLoading(false);

      // Optionally redirect after a delay
      setTimeout(() => {
        router.push('/');
      }, 2000);

    } catch (error: any) {
      console.error('Signup failed:', error);
      if (error.code === 'auth/email-already-in-use') {
        setSubmitError('This email is already registered. Please sign in instead.');
      } else if (error.code === 'auth/weak-password') {
        setSubmitError('Password should be at least 6 characters.');
      } else {
        setSubmitError('Unable to create account. Please try again.');
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-sans selection:bg-primary-100 selection:text-primary-900">
      <Header />

      <div className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-blue-400/10 blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-400/10 blur-[100px]" />
        </div>

        <div className="w-full max-w-2xl space-y-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/20 transform rotate-3 hover:rotate-0 transition-all duration-300">
              <i className="ri-user-add-line text-white text-3xl"></i>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Create Your Account</h2>
            <p className="mt-2 text-gray-600">Join thousands of users who trust AfyaLynx</p>
          </div>

          <div className="glass-panel p-8 sm:p-10 rounded-3xl shadow-xl border border-white/20 bg-white/50 backdrop-blur-xl">
            <form onSubmit={handleSignup} className="space-y-6">
              {submitError && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-3 animate-fade-in">
                  <i className="ri-error-warning-fill text-lg"></i>
                  <span>{submitError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <i className="ri-user-line text-gray-400 group-focus-within:text-blue-500 transition-colors"></i>
                    </div>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="John"
                      className={`block w-full pl-11 pr-4 py-3.5 bg-white/50 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 ${errors.firstName ? 'border-red-300' : 'border-gray-200'}`}
                    />
                  </div>
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <i className="ri-user-line text-gray-400 group-focus-within:text-blue-500 transition-colors"></i>
                    </div>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Doe"
                      className={`block w-full pl-11 pr-4 py-3.5 bg-white/50 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 ${errors.lastName ? 'border-red-300' : 'border-gray-200'}`}
                    />
                  </div>
                  {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <i className="ri-mail-line text-gray-400 group-focus-within:text-blue-500 transition-colors"></i>
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@example.com"
                    className={`block w-full pl-11 pr-4 py-3.5 bg-white/50 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 ${errors.email ? 'border-red-300' : 'border-gray-200'}`}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <i className="ri-lock-2-line text-gray-400 group-focus-within:text-blue-500 transition-colors"></i>
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Min. 8 characters"
                      className={`block w-full pl-11 pr-12 py-3.5 bg-white/50 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 ${errors.password ? 'border-red-300' : 'border-gray-200'}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <i className={`ri-${showPassword ? 'eye-off' : 'eye'}-line text-lg`}></i>
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <i className="ri-lock-2-line text-gray-400 group-focus-within:text-blue-500 transition-colors"></i>
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm password"
                      className={`block w-full pl-11 pr-12 py-3.5 bg-white/50 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 ${errors.confirmPassword ? 'border-red-300' : 'border-gray-200'}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <i className={`ri-${showConfirmPassword ? 'eye-off' : 'eye'}-line text-lg`}></i>
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <i className="ri-calendar-line text-gray-400 group-focus-within:text-blue-500 transition-colors"></i>
                    </div>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className={`block w-full pl-11 pr-4 py-3.5 bg-white/50 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 ${errors.dateOfBirth ? 'border-red-300' : 'border-gray-200'}`}
                    />
                  </div>
                  {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <i className="ri-user-settings-line text-gray-400 group-focus-within:text-blue-500 transition-colors"></i>
                    </div>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className={`block w-full pl-11 pr-10 py-3.5 bg-white/50 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 appearance-none ${errors.gender ? 'border-red-300' : 'border-gray-200'}`}
                    >
                      <option value="">Select gender</option>
                      {genderOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                    <i className="ri-arrow-down-s-line absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                  </div>
                  {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <i className="ri-phone-line text-gray-400 group-focus-within:text-blue-500 transition-colors"></i>
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 000-0000"
                    className="block w-full pl-11 pr-4 py-3.5 bg-white/50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="bg-white/50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className="mt-1 rounded w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 transition-colors"
                  />
                  <label className="text-sm text-gray-600 leading-relaxed">
                    I agree to the{' '}
                    <Link href="/terms-of-service" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
                {errors.agreeToTerms && <p className="text-red-500 text-xs mt-2 ml-7">{errors.agreeToTerms}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading || !formData.agreeToTerms}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-xl text-base font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <i className="ri-loader-4-line animate-spin text-xl"></i>
                    <span>Creating Account...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span>Create Account</span>
                    <i className="ri-arrow-right-line"></i>
                  </span>
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-all">
              Sign in here
            </Link>
          </p>

          {/* Trust indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: 'ri-shield-check-fill', text: 'Secure & Private', color: 'text-green-500', bg: 'bg-green-50' },
              { icon: 'ri-lock-fill', text: 'HIPAA Compliant', color: 'text-blue-500', bg: 'bg-blue-50' },
              { icon: 'ri-verified-badge-fill', text: 'Verified Platform', color: 'text-purple-500', bg: 'bg-purple-50' }
            ].map((item, index) => (
              <div key={index} className="glass-panel p-4 rounded-xl flex flex-col items-center justify-center text-center gap-2 border border-white/20 bg-white/50 backdrop-blur-xl hover:border-blue-100 transition-colors">
                <i className={`${item.icon} ${item.color} text-2xl`}></i>
                <span className="text-xs font-medium text-gray-600">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="glass-panel rounded-3xl shadow-2xl max-w-md w-full p-8 animate-scale-in">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                <i className="ri-mail-check-line text-green-600 text-4xl"></i>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Check Your Email!
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {successMessage || 'We\'ve sent a verification link to your email address. Please check your inbox and click the link to verify your account.'}
              </p>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 text-left">
                <p className="text-sm text-blue-700 flex gap-2">
                  <i className="ri-information-fill text-lg flex-shrink-0"></i>
                  <span>
                    <strong>Tip:</strong> Check your spam folder if you don't see the email within a few minutes.
                  </span>
                </p>
              </div>
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => router.push('/login')}
                  className="w-full btn-primary py-3 rounded-xl font-semibold"
                >
                  Go to Login
                </button>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full py-3 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 border border-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

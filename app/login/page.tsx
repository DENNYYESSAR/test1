
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useAuth } from '@/context/AuthContext';
// import { authApi } from '@/lib/api'; // Removed for Firebase migration

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  useEffect(() => {
    if (!authLoading && user) {
      const role = localStorage.getItem('userRole');
      if (role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    // Check for verification status or errors from URL
    const verified = searchParams.get('verified');
    const errorParam = searchParams.get('error');

    if (verified === 'pending') {
      setInfoMessage('Please check your email and click the verification link to activate your account.');
    } else if (errorParam === 'verification_expired') {
      setError('Your verification link has expired. Please sign up again or request a new verification email.');
    } else if (errorParam === 'verification_failed') {
      setError('Email verification failed. Please try again or contact support.');
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Dynamic import to avoid SSR issues with Firebase Auth
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      const { auth, db } = await import('@/lib/firebase');
      const { doc, getDoc } = await import('firebase/firestore');

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch additional user details from Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      const userData = userDoc.exists() ? userDoc.data() : {};

      // Maintain legacy localStorage for compatibility
      const role = userData.role || 'user';
      localStorage.setItem('userRole', role);
      localStorage.setItem('userEmail', user.email || '');
      localStorage.setItem('isAuthenticated', 'true');

      setIsLoading(false);

      if (role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }

    } catch (err: any) {
      console.error('Login failed:', err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please try again later.');
      } else {
        setError('Unable to sign in. Please try again.');
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-sans selection:bg-primary-100 selection:text-primary-900">
      <Header />

      <div className="relative min-h-screen flex items-center justify-center pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-blue-400/10 blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-400/10 blur-[100px]" />
        </div>

        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/20 transform rotate-3 hover:rotate-0 transition-all duration-300">
              <i className="ri-login-circle-line text-white text-4xl"></i>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome Back</h2>
            <p className="mt-2 text-gray-600">Sign in to access your health dashboard</p>
          </div>

          <div className="glass-panel p-8 sm:p-10 rounded-3xl shadow-xl border border-white/50">
            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-3 animate-fade-in">
                  <i className="ri-error-warning-fill text-lg"></i>
                  <span>{error}</span>
                </div>
              )}

              {infoMessage && (
                <div className="bg-blue-50 border border-blue-100 text-blue-600 px-4 py-3 rounded-xl text-sm flex items-center gap-3 animate-fade-in">
                  <i className="ri-information-fill text-lg"></i>
                  <span>{infoMessage}</span>
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <i className="ri-mail-line text-gray-400 group-focus-within:text-blue-500 transition-colors"></i>
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      required
                      className="block w-full pl-11 pr-4 py-3.5 bg-white/50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <i className="ri-lock-2-line text-gray-400 group-focus-within:text-blue-500 transition-colors"></i>
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      className="block w-full pl-11 pr-12 py-3.5 bg-white/50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <i className={`ri-${showPassword ? 'eye-off' : 'eye'}-line text-lg`}></i>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition-colors" />
                  <span className="ml-2 text-sm text-gray-600 group-hover:text-gray-900 transition-colors">Remember me</span>
                </label>
                <Link href="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition-all">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3.5 text-base font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 rounded-xl transition-all transform hover:-translate-y-0.5"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <i className="ri-loader-4-line animate-spin text-xl"></i>
                    <span>Signing in...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span>Sign In</span>
                    <i className="ri-arrow-right-line"></i>
                  </span>
                )}
              </button>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 group">
                  <i className="ri-google-fill text-red-500 text-xl mr-2 group-hover:scale-110 transition-transform"></i>
                  <span className="text-sm font-medium text-gray-700">Google</span>
                </button>
                <button className="flex items-center justify-center px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 group">
                  <i className="ri-facebook-fill text-blue-600 text-xl mr-2 group-hover:scale-110 transition-transform"></i>
                  <span className="text-sm font-medium text-gray-700">Facebook</span>
                </button>
              </div>
            </div>

            <p className="mt-8 text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/signup" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-all">
                Create free account
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

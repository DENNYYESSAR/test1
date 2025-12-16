'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate password reset process
    setTimeout(() => {
      setIsLoading(false);
      setIsEmailSent(true);
    }, 2000);
  };

  const handleResend = () => {
    setIsEmailSent(false);
    setEmail('');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <Header />

      <div className="pt-32 pb-20 relative z-10">
        <div className="max-w-md mx-auto px-6">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl blur-xl opacity-50 animate-pulse"></div>
              <div className="relative w-20 h-20 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300">
                <i className="ri-lock-unlock-line text-white text-3xl"></i>
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-cyan-900 bg-clip-text text-transparent mb-3">
              Reset Your Password
            </h1>
            <p className="text-sm md:text-lg text-gray-600">
              No worries! Enter your email and we'll help you regain access
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 lg:p-10 border border-blue-100/50">
            {!isEmailSent ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl opacity-0 group-focus-within:opacity-20 blur transition-opacity duration-300"></div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      required
                      className="relative w-full px-5 py-4 pl-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-400 bg-white"
                    />
                    <i className="ri-mail-line absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl group-focus-within:text-blue-500 transition-colors"></i>
                  </div>
                  {error && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <i className="ri-error-warning-line mr-1"></i>
                      {error}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !email}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] text-lg"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <i className="ri-loader-4-line animate-spin mr-2 text-xl"></i>
                      Sending Instructions...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <i className="ri-mail-send-line mr-2 text-xl"></i>
                      Send Reset Link
                    </span>
                  )}
                </button>

                {/* Security Info */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <i className="ri-shield-check-line text-blue-600"></i>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">Secure & Private</h4>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Your password reset link is valid for 1 hour and can only be used once. We never store your password in plain text.
                      </p>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <div className="text-center space-y-6 animate-fadeIn">
                {/* Success Icon */}
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
                  <div className="relative w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-xl">
                    <i className="ri-mail-check-line text-white text-3xl animate-bounce"></i>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Check Your Inbox!</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We've sent password reset instructions to
                  </p>
                  <p className="font-semibold text-gray-900 mt-2 text-lg">{email}</p>
                </div>

                {/* Next Steps */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-5 border border-blue-100 text-left space-y-3">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <i className="ri-lightbulb-line text-blue-600 mr-2"></i>
                    What's Next?
                  </h4>
                  <div className="space-y-2.5 text-sm text-gray-700">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-blue-600">1</span>
                      </div>
                      <p>Check your email inbox for the reset link</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-blue-600">2</span>
                      </div>
                      <p>Click the secure link to reset your password</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-blue-600">3</span>
                      </div>
                      <p>Create a strong new password for your account</p>
                    </div>
                  </div>
                </div>

                {/* Didn't Receive */}
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                  <div className="flex items-start space-x-3">
                    <i className="ri-information-line text-amber-600 text-xl mt-0.5"></i>
                    <div className="text-left">
                      <p className="text-sm text-amber-900 font-medium mb-1">
                        Didn't receive the email?
                      </p>
                      <p className="text-xs text-amber-800 mb-2">
                        Check your spam folder or wait a few minutes
                      </p>
                      <button
                        onClick={handleResend}
                        className="text-sm font-semibold text-amber-700 hover:text-amber-800 underline decoration-2 underline-offset-2 transition-colors flex items-center"
                      >
                        <i className="ri-refresh-line mr-1"></i>
                        Resend Email
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Footer Links */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <Link
                  href="/login"
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center group transition-colors"
                >
                  <i className="ri-arrow-left-line mr-1 group-hover:-translate-x-1 transition-transform"></i>
                  Back to Sign In
                </Link>
                <Link
                  href="/contact-support"
                  className="text-gray-600 hover:text-gray-700 font-medium text-sm flex items-center group transition-colors"
                >
                  <i className="ri-customer-service-2-line mr-1"></i>
                  Contact Support
                </Link>
              </div>
            </div>
          </div>

          {/* Additional Help */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              Remember your password?{' '}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                Sign in now
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
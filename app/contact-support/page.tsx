'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function ContactSupport() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    priority: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [clearSuccess, setClearSuccess] = useState(false);
  const [selectedHelp, setSelectedHelp] = useState<{title: string, content: string} | null>(null);

  const quickHelpItems = [
    { 
      title: 'How to book an appointment?', 
      icon: 'ri-calendar-check-line',
      content: 'Navigate to the "Find Clinics" page, search for a specialist or clinic, and click the "Book Appointment" button on their profile card. You can choose a date and time that works for you.'
    },
    { 
      title: 'Using AI Diagnosis tool', 
      icon: 'ri-brain-line',
      content: 'Go to the "AI Diagnosis" page from the main menu. Enter your symptoms, age, and gender details, then click "Analyze Symptoms" to get a preliminary assessment and recommendations.'
    },
    { 
      title: 'Managing health records', 
      icon: 'ri-file-list-3-line',
      content: 'Visit your "Profile" page to view, upload, and manage your medical history. You can securely store prescriptions, lab results, and other health documents here.'
    },
    { 
      title: 'Account & privacy settings', 
      icon: 'ri-shield-user-line',
      content: 'Access "Settings" from your profile menu to update your personal information, change your password, and manage your privacy preferences and data sharing options.'
    }
  ];

  const categories = [
    { value: 'technical', label: 'Technical Support', icon: 'ri-tools-line' },
    { value: 'account', label: 'Account Issues', icon: 'ri-user-settings-line' },
    { value: 'billing', label: 'Billing & Payments', icon: 'ri-bank-card-line' },
    { value: 'medical', label: 'Medical Questions', icon: 'ri-stethoscope-line' },
    { value: 'privacy', label: 'Privacy Concerns', icon: 'ri-shield-user-line' },
    { value: 'feature', label: 'Feature Request', icon: 'ri-lightbulb-line' },
    { value: 'bug', label: 'Bug Report', icon: 'ri-bug-line' },
    { value: 'general', label: 'General Inquiry', icon: 'ri-question-line' }
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'text-gray-600' },
    { value: 'medium', label: 'Medium', color: 'text-blue-600' },
    { value: 'high', label: 'High', color: 'text-orange-600' },
    { value: 'urgent', label: 'Urgent', color: 'text-red-600' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleClear = () => {
    setFormData({
      name: '', email: '', subject: '', category: '', priority: '', message: ''
    });
    setClearSuccess(true);
    setTimeout(() => setClearSuccess(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: '', email: '', subject: '', category: '', priority: '', message: ''
      });

      // Auto-hide success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full"></div>
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <Header />

      <div className="pt-32 pb-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur-xl opacity-50 animate-pulse"></div>
              <div className="relative w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300">
                <i className="ri-customer-service-2-line text-white text-3xl"></i>
              </div>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              We're Here to Help
            </h1>
            <p className="text-sm md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Have questions or need assistance? Our dedicated support team is ready to help you 24/7
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Contact Methods */}
              <div className="glass-panel p-8 rounded-3xl shadow-xl bg-white/50 backdrop-blur-xl border border-white/20">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <i className="ri-contacts-line mr-2 text-blue-600"></i>
                  Get in Touch
                </h2>

                <div className="space-y-6">
                  <div className="group cursor-pointer">
                    <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-white/50 transition-all duration-300 border border-transparent hover:border-blue-100">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                        <i className="ri-phone-line text-white text-xl"></i>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Phone Support</h3>
                        <p className="text-blue-600 font-medium">+1 (555) 123-AFYA</p>
                        <p className="text-sm text-gray-500 mt-1">Mon-Fri: 8AM-8PM EST</p>
                      </div>
                    </div>
                  </div>

                  <div className="group cursor-pointer">
                    <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-white/50 transition-all duration-300 border border-transparent hover:border-blue-100">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                        <i className="ri-mail-line text-white text-xl"></i>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Email Support</h3>
                        <p className="text-indigo-600 font-medium break-all">support@afyalynx.com</p>
                        <p className="text-sm text-gray-500 mt-1">Response within 24 hours</p>
                      </div>
                    </div>
                  </div>

                  <div className="group cursor-pointer">
                    <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-white/50 transition-all duration-300 border border-transparent hover:border-blue-100">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                        <i className="ri-chat-3-line text-white text-xl"></i>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">Live Chat</h3>
                        <p className="text-gray-600 text-sm mb-2">Available 24/7</p>
                        <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center group-hover:translate-x-1 transition-transform">
                          Start Chat
                          <i className="ri-arrow-right-line ml-1"></i>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="group cursor-pointer">
                    <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-white/50 transition-all duration-300 border border-transparent hover:border-blue-100">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                        <i className="ri-map-pin-line text-white text-xl"></i>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Office Address</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          123 Healthcare Ave<br />
                          Medical District<br />
                          City, State 12345
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Help Links */}
              <div className="glass-panel p-8 rounded-3xl shadow-xl bg-white/50 backdrop-blur-xl border border-white/20">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <i className="ri-flashlight-line mr-2 text-amber-500"></i>
                  Quick Help
                </h2>

                <div className="space-y-2">
                  {quickHelpItems.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedHelp(item)}
                      className="w-full text-left p-4 rounded-xl hover:bg-white/50 transition-all duration-300 group border border-transparent hover:border-blue-100"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <i className={`${item.icon} text-blue-600 text-lg`}></i>
                          <span className="text-gray-700 font-medium group-hover:text-gray-900">{item.title}</span>
                        </div>
                        <i className="ri-arrow-right-s-line text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"></i>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Emergency Notice */}
              <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-3xl shadow-2xl p-8 text-white">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center flex-shrink-0 animate-pulse">
                    <i className="ri-alarm-warning-line text-white text-2xl"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2">Medical Emergency?</h3>
                    <p className="text-red-50 text-sm mb-4 leading-relaxed">
                      If you're experiencing a medical emergency, do not use this form. Call emergency services immediately.
                    </p>
                    <button className="bg-white text-red-600 px-6 py-3 rounded-xl font-bold hover:bg-red-50 transition-all duration-300 shadow-lg transform hover:scale-105 flex items-center space-x-2">
                      <i className="ri-phone-line text-xl"></i>
                      <span>Call 911 Now</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Form */}
            <div className="lg:col-span-2">
              <div className="glass-panel p-8 lg:p-10 rounded-3xl shadow-xl bg-white/50 backdrop-blur-xl border border-white/20">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Send us a Message</h2>
                  <p className="text-gray-600">Fill out the form below and we'll respond as soon as possible</p>
                </div>

                {isSubmitted && (
                  <div className="mb-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white shadow-xl animate-fadeIn">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <i className="ri-check-double-line text-2xl"></i>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1">Message Sent Successfully!</h3>
                        <p className="text-green-50 text-sm">
                          Thank you for contacting us. We've received your message and will respond within 24 hours.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name and Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative group">
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-5 py-4 pl-12 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-400 bg-white/50"
                          placeholder="John Doe"
                        />
                        <i className="ri-user-line absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl group-focus-within:text-blue-500 transition-colors"></i>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative group">
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-5 py-4 pl-12 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-400 bg-white/50"
                          placeholder="john@example.com"
                        />
                        <i className="ri-mail-line absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl group-focus-within:text-blue-500 transition-colors"></i>
                      </div>
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <div className="relative group">
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-5 py-4 pl-12 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-400 bg-white/50"
                        placeholder="Brief description of your issue"
                      />
                      <i className="ri-text absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl group-focus-within:text-blue-500 transition-colors"></i>
                    </div>
                  </div>

                  {/* Category and Priority */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <div className="relative group">
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          required
                          className="w-full px-5 py-4 pl-12 pr-10 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-900 appearance-none bg-white/50"
                        >
                          <option value="">Select a category</option>
                          {categories.map(cat => (
                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                          ))}
                        </select>
                        <i className="ri-folder-line absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl group-focus-within:text-blue-500 transition-colors"></i>
                        <i className="ri-arrow-down-s-line absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Priority Level
                      </label>
                      <div className="relative group">
                        <select
                          name="priority"
                          value={formData.priority}
                          onChange={handleChange}
                          className="w-full px-5 py-4 pl-12 pr-10 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-900 appearance-none bg-white/50"
                        >
                          <option value="">Select priority</option>
                          {priorities.map(priority => (
                            <option key={priority.value} value={priority.value}>{priority.label}</option>
                          ))}
                        </select>
                        <i className="ri-flag-line absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl group-focus-within:text-blue-500 transition-colors"></i>
                        <i className="ri-arrow-down-s-line absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Your Message <span className="text-red-500">*</span>
                    </label>
                    <div className="relative group">
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        maxLength={1000}
                        className="w-full px-5 py-4 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-400 resize-none bg-white/50"
                        placeholder="Please provide as much detail as possible about your issue or question. Include any relevant information that will help us assist you better..."
                      ></textarea>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-gray-500">
                          {formData.message.length}/1000 characters
                        </p>
                        <div className="flex items-center space-x-1">
                          <div className={`h-1 w-16 rounded-full ${formData.message.length > 0 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
                          <div className={`h-1 w-16 rounded-full ${formData.message.length > 333 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
                          <div className={`h-1 w-16 rounded-full ${formData.message.length > 666 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Privacy Agreement */}
                  <div className="bg-white/50 rounded-xl p-5 border border-blue-100">
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        required
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5 flex-shrink-0"
                      />
                      <label className="text-sm text-gray-700 leading-relaxed">
                        I agree to the processing of my personal data as described in the{' '}
                        <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-700 font-semibold underline decoration-2 underline-offset-2">
                          Privacy Policy
                        </Link>{' '}
                        and consent to being contacted regarding my inquiry.
                      </label>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] text-lg"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <i className="ri-loader-4-line animate-spin mr-2 text-xl"></i>
                          Sending Message...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          <i className="ri-send-plane-fill mr-2 text-xl"></i>
                          Send Message
                        </span>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleClear}
                      className={`sm:w-auto px-8 py-4 border-2 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center ${
                        clearSuccess 
                          ? 'bg-green-50 border-green-200 text-green-600' 
                          : 'border-gray-200 text-gray-700 hover:bg-white/50 hover:border-gray-300 bg-white/30'
                      }`}
                    >
                      {clearSuccess ? (
                        <>
                          <i className="ri-check-line mr-2 text-lg"></i>
                          Cleared!
                        </>
                      ) : (
                        <>
                          <i className="ri-refresh-line mr-2 text-lg"></i>
                          Clear Form
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Additional Resources */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Additional Resources</h2>
              <p className="text-gray-600">Explore more ways to get help and stay informed</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: 'ri-book-open-line',
                  title: 'User Guide',
                  description: 'Comprehensive guide to using all AfyaLynx features',
                  color: 'from-blue-500 to-indigo-500',
                  bgColor: 'bg-white/50'
                },
                {
                  icon: 'ri-question-answer-line',
                  title: 'FAQ Center',
                  description: 'Find answers to commonly asked questions',
                  color: 'from-indigo-500 to-purple-500',
                  bgColor: 'bg-white/50'
                },
                {
                  icon: 'ri-community-line',
                  title: 'Community Forum',
                  description: 'Connect with other users and share experiences',
                  color: 'from-blue-400 to-cyan-500',
                  bgColor: 'bg-white/50'
                }
              ].map((resource, index) => (
                <div key={index} className="group">
                  <div className={`glass-panel ${resource.bgColor} backdrop-blur-xl rounded-2xl shadow-xl p-8 text-center border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer h-full`}>
                    <div className={`w-20 h-20 bg-gradient-to-br ${resource.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                      <i className={`${resource.icon} text-white text-3xl`}></i>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{resource.title}</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {resource.description}
                    </p>
                    <button className="text-blue-600 hover:text-blue-700 font-bold flex items-center justify-center mx-auto group-hover:translate-x-2 transition-transform">
                      <span>Learn More</span>
                      <i className="ri-arrow-right-line ml-2"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Help Modal */}
      {selectedHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative animate-scale-up">
            <button 
              onClick={() => setSelectedHelp(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <i className="ri-close-line text-2xl"></i>
            </button>
            
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
              <i className={`${selectedHelp.icon} text-3xl text-blue-600`}></i>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {selectedHelp.title}
            </h3>
            
            <p className="text-gray-600 leading-relaxed mb-8">
              {selectedHelp.content}
            </p>
            
            <button
              onClick={() => setSelectedHelp(null)}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25"
            >
              Got it, thanks!
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}


'use client';

import Header from '../components/Header';
import Footer from '../components/Footer';
import UserReviews from '../components/UserReviews';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const backgroundImages = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80', // Abstract Cell/Fluid - Very organic and compelling
  'https://images.unsplash.com/photo-1584036561566-b93a945cd3e1?auto=format&fit=crop&q=80', // Microscopic Structure - High detail, bright
  'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80'  // Clean Tech Data - Google Health vibe
];

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 8000); // Change image every 8 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-24 pb-12 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Image Slider */}
        <div className="absolute inset-0 z-0">
          {backgroundImages.map((image, index) => (
            <div
              key={image}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                }`}
              style={{ backgroundImage: `url(${image})` }}
            />
          ))}
          {/* Overlay Gradient - Adjusted to let bright colors shine through while keeping text readable */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/60 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-col-reverse lg:flex-row items-center gap-8 lg:gap-20">
            {/* Text Content */}
            <div className="flex-1 text-center lg:text-left z-10">
              <div className="inline-flex items-center px-3 py-1.5 lg:px-4 lg:py-2 rounded-full bg-white/80 backdrop-blur-md border border-blue-100 shadow-sm mb-6 lg:mb-8 animate-scaleIn hover:scale-105 transition-transform cursor-default">
                <span className="relative flex h-2.5 w-2.5 lg:h-3 lg:w-3 mr-2 lg:mr-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 lg:h-3 lg:w-3 bg-green-500"></span>
                </span>
                <span className="text-xs lg:text-sm font-semibold text-primary-700 tracking-wide uppercase">Welcome to AfyaLynx</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-7xl font-extrabold text-gray-900 tracking-tight mb-4 lg:mb-8 leading-[1.1] animate-slideInLeft">
                Your Health Journey <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-blue-600 to-secondary-500">
                  Starts Here
                </span>
              </h1>

              <p className="text-sm md:text-base lg:text-xl text-gray-600 mb-6 lg:mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0 animate-slideInLeft" style={{ animationDelay: '0.1s' }}>
                We are thrilled to have you. Step into a world where advanced AI meets compassionate care. Get instant answers, connect with top doctors, and take control of your well-being today.
              </p>

              <div className="flex flex-row items-center justify-center lg:justify-start gap-3 animate-slideInLeft" style={{ animationDelay: '0.2s' }}>
                <Link href="/ai-diagnosis" className="btn-primary flex-1 sm:flex-none justify-center group relative overflow-hidden py-3 px-4 lg:py-4 lg:px-8 text-sm lg:text-base rounded-xl">
                  <span className="relative z-10 flex items-center justify-center whitespace-nowrap">
                    <i className="ri-magic-line mr-2 text-lg group-hover:rotate-12 transition-transform"></i>
                    Start AI Diagnosis
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                <Link href="/find-clinics" className="flex-1 sm:flex-none justify-center px-4 py-3 lg:px-8 lg:py-4 rounded-xl bg-white/80 backdrop-blur-sm text-gray-700 font-bold border border-gray-200 hover:border-primary-300 hover:text-primary-600 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center group text-sm lg:text-base whitespace-nowrap">
                  <i className="ri-map-pin-2-line mr-2 text-lg group-hover:scale-110 transition-transform text-primary-500"></i>
                  Find Nearby Clinics
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="mt-8 lg:mt-12 pt-6 border-t border-gray-200/60 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs lg:text-sm font-medium text-gray-500 animate-slideInLeft" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center bg-white/50 px-3 py-1.5 rounded-lg backdrop-blur-sm shadow-sm">
                  <i className="ri-group-fill text-blue-500 mr-2 text-lg"></i>
                  <span>10k+ Users</span>
                </div>
                <div className="flex items-center bg-white/50 px-3 py-1.5 rounded-lg backdrop-blur-sm shadow-sm">
                  <i className="ri-hospital-fill text-purple-500 mr-2 text-lg"></i>
                  <span>500+ Clinics</span>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="flex-1 relative w-full max-w-lg lg:max-w-none animate-slideInRight z-0">
              <div className="relative w-full aspect-square max-w-[280px] sm:max-w-[400px] lg:max-w-[500px] mx-auto">
                {/* Main Circle/Core */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-50 blur-3xl animate-pulse-glow"></div>

                {/* Central Phone/Device Mockup - Light Glass Style */}
                <div className="absolute inset-[10%] bg-white/60 backdrop-blur-xl rounded-[3rem] shadow-2xl border-8 border-white overflow-hidden transform rotate-[-5deg] hover:rotate-0 transition-transform duration-700 z-10 ring-1 ring-gray-100">
                  <div className="absolute top-0 left-0 right-0 h-6 bg-gray-100/50 z-20 flex justify-center">
                    <div className="w-20 h-4 bg-white rounded-b-xl shadow-sm"></div>
                  </div>
                  {/* Screen Content */}
                  <div className="w-full h-full bg-gradient-to-b from-gray-50 to-white pt-10 px-4 pb-4 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                      <div className="w-20 h-4 rounded-full bg-gray-200"></div>
                    </div>
                    <div className="space-y-4">
                      {/* Chat Bubble 1 */}
                      <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-2">
                          <i className="ri-robot-2-line"></i>
                        </div>
                        <div className="h-2 w-24 bg-blue-200 rounded mb-2"></div>
                        <div className="h-2 w-full bg-blue-100 rounded"></div>
                      </div>
                      {/* Chat Bubble 2 */}
                      <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                            <i className="ri-heart-pulse-line"></i>
                          </div>
                          <div>
                            <div className="h-3 w-20 bg-gray-200 rounded mb-1"></div>
                            <div className="h-2 w-12 bg-gray-100 rounded"></div>
                          </div>
                        </div>
                        <div className="h-16 bg-green-50 rounded-xl w-full relative overflow-hidden">
                          <svg className="absolute bottom-0 left-0 w-full h-full text-green-400" viewBox="0 0 100 40" preserveAspectRatio="none">
                            <path d="M0,30 Q10,25 20,30 T40,20 T60,30 T80,10 T100,25 V40 H0 Z" fill="currentColor" opacity="0.3" />
                            <path d="M0,30 Q10,25 20,30 T40,20 T60,30 T80,10 T100,25" fill="none" stroke="currentColor" strokeWidth="2" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="mt-auto bg-gray-900 text-white p-4 rounded-2xl shadow-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                          <i className="ri-mic-line"></i>
                        </div>
                        <div className="h-2 w-32 bg-gray-700 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements - Light Glass Style */}
                <div className="absolute top-[10%] right-[-8%] bg-white/90 backdrop-blur-md p-2 sm:p-4 rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 animate-float z-20 scale-75 sm:scale-100 origin-top-right">
                  <div className="flex items-center justify-between mb-1 sm:mb-2 gap-2 sm:gap-4">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500 animate-pulse"></div>
                      <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider">Live Heart Rate</span>
                    </div>
                    <i className="ri-heart-3-fill text-red-500 text-sm sm:text-base"></i>
                  </div>
                  <div className="flex items-end gap-0.5 sm:gap-1 h-6 sm:h-8 w-24 sm:w-32 mb-1">
                    {[40, 70, 50, 90, 60, 80, 40, 60].map((h, i) => (
                      <div key={i} className="w-1/8 bg-red-100 rounded-t-sm hover:bg-red-500 transition-colors" style={{ height: `${h}%`, width: '12%' }}></div>
                    ))}
                  </div>
                  <div className="text-lg sm:text-2xl font-bold text-gray-900 leading-none">
                    72 <span className="text-[10px] sm:text-xs text-gray-500 font-normal">BPM</span>
                  </div>
                </div>

                <div className="absolute bottom-[15%] left-[-12%] bg-white/90 backdrop-blur-md p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 animate-float z-20 w-48 sm:w-72 scale-90 sm:scale-100 origin-bottom-left" style={{ animationDelay: '1.5s' }}>
                  {/* Header */}
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 border-b border-gray-100 pb-2 sm:pb-3">
                    <div className="relative">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-[2px]">
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                          <i className="ri-robot-2-line text-indigo-600 text-sm sm:text-base"></i>
                        </div>
                      </div>
                      <div className="absolute bottom-0 right-0 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-gray-900">AfyaLynx AI</div>
                      <div className="text-[8px] sm:text-[10px] text-indigo-500">Instant Diagnosis</div>
                    </div>
                  </div>

                  {/* Chat Area */}
                  <div className="space-y-2 sm:space-y-3">
                    {/* User Bubble */}
                    <div className="flex items-end justify-end gap-1.5 sm:gap-2">
                      <div className="bg-blue-600 text-white text-[10px] sm:text-xs py-1.5 sm:py-2 px-2 sm:px-3 rounded-xl sm:rounded-2xl rounded-tr-sm max-w-[85%] shadow-sm leading-tight">
                        I have a severe headache and fever.
                      </div>
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-[8px] sm:text-[10px] text-gray-600">You</div>
                    </div>

                    {/* AI Bubble */}
                    <div className="flex items-end justify-start gap-1.5 sm:gap-2">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-indigo-100 flex-shrink-0 flex items-center justify-center text-[8px] sm:text-[10px] text-indigo-600">AI</div>
                      <div className="bg-gray-100 text-gray-700 text-[10px] sm:text-xs py-1.5 sm:py-2 px-2 sm:px-3 rounded-xl sm:rounded-2xl rounded-tl-sm max-w-[85%]">
                        <div className="flex gap-1 h-3 sm:h-4 items-center px-1">
                          <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                          <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                          <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute top-[40%] left-[-15%] bg-gray-900/60 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-white/10 animate-float z-10 hidden lg:block" style={{ animationDelay: '2s' }}>
                  <i className="ri-shield-check-line text-2xl text-blue-400"></i>
                </div>

                <div className="absolute bottom-[10%] right-[-5%] bg-gray-900/60 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-white/10 animate-float z-10 hidden lg:block" style={{ animationDelay: '0.5s' }}>
                  <i className="ri-capsule-line text-2xl text-purple-400"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Container with unified background */}
      <div className="relative">
        {/* Background Elements - matching AI Diagnosis page */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-[10%] right-[-5%] w-[300px] h-[300px] lg:w-[500px] lg:h-[500px] rounded-full bg-blue-400/10 blur-[60px] lg:blur-[100px]" />
          <div className="absolute top-[40%] left-[-10%] w-[350px] h-[350px] lg:w-[600px] lg:h-[600px] rounded-full bg-indigo-400/10 blur-[60px] lg:blur-[100px]" />
          <div className="absolute bottom-[20%] right-[-5%] w-[300px] h-[300px] lg:w-[450px] lg:h-[450px] rounded-full bg-purple-400/10 blur-[60px] lg:blur-[100px]" />
        </div>

        {/* Features Grid */}
        <section className="py-24 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Comprehensive Healthcare <br />
                <span className="text-primary-600">At Your Fingertips</span>
              </h2>
              <p className="text-xl text-gray-600">
                Everything you need to manage your health effectively, powered by advanced AI and connected to real-world care.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[
                {
                  title: "AI Symptom Checker",
                  desc: "Get instant, accurate health assessments using our advanced AI algorithms trained on millions of medical records.",
                  icon: "ri-brain-line",
                  color: "bg-blue-50 text-blue-600",
                  image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=250&fit=crop&q=80",
                  link: "/ai-diagnosis"
                },
                {
                  title: "Smart Clinic Finder",
                  desc: "Locate the best clinics and specialists near you based on your specific condition and insurance.",
                  icon: "ri-map-pin-user-line",
                  color: "bg-teal-50 text-teal-600",
                  image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=250&fit=crop&q=80",
                  link: "/find-clinics"
                },
                {
                  title: "Secure Health Records",
                  desc: "Store and manage your medical history, prescriptions, and lab results in one encrypted, accessible location.",
                  icon: "ri-file-shield-line",
                  color: "bg-purple-50 text-purple-600",
                  image: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400&h=250&fit=crop&q=80",
                  link: "/dashboard"
                },
                {
                  title: "24/7 Doctor Chat",
                  desc: "Connect with qualified healthcare professionals anytime for quick consultations and second opinions.",
                  icon: "ri-message-3-line",
                  color: "bg-indigo-50 text-indigo-600",
                  image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=250&fit=crop&q=80",
                  link: "/dashboard/chat"
                },
                {
                  title: "Medication Reminders",
                  desc: "Never miss a dose with smart notifications and prescription refill alerts directly to your phone.",
                  icon: "ri-capsule-line",
                  color: "bg-rose-50 text-rose-600",
                  image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=250&fit=crop&q=80",
                  link: "/dashboard"
                },
                {
                  title: "Emergency SOS",
                  desc: "One-tap emergency assistance that shares your location and medical profile with first responders.",
                  icon: "ri-alarm-warning-line",
                  color: "bg-red-50 text-red-600",
                  image: "https://images.unsplash.com/photo-1587745416684-47953f16f02f?w=400&h=250&fit=crop&q=80",
                  link: "/dashboard"
                }
              ].map((feature, i) => (
                <div key={i} className="group bg-white rounded-2xl md:rounded-3xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 shadow-sm">
                  {/* Image */}
                  <div className="relative h-40 md:h-48 overflow-hidden">
                    <Image 
                      src={feature.image} 
                      alt={feature.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    <div className={`absolute bottom-3 left-3 w-10 h-10 md:w-12 md:h-12 rounded-xl ${feature.color} flex items-center justify-center text-lg md:text-xl shadow-lg backdrop-blur-sm`}>
                      <i className={feature.icon}></i>
                    </div>
                  </div>
                  {/* Content */}
                  <div className="p-4 md:p-6">
                    <h3 className="text-base md:text-xl font-bold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Your Health Journey */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>

          <div className="max-w-7xl mx-auto px-6 relative">
            <div className="text-center mb-20">
              <span className="text-primary-600 font-semibold tracking-wider uppercase text-sm">Simple Process</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-6">Your Health Journey</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Your journey to better health is just a few clicks away.
              </p>
            </div>

            <div className="relative">
              {/* Connecting Line */}
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gray-200 to-transparent -translate-y-1/2 z-0"></div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-10 relative z-10">
                {[
                  { step: "01", title: "Sign Up", desc: "Create your secure profile", icon: "ri-user-add-line" },
                  { step: "02", title: "Describe", desc: "Tell AI your symptoms", icon: "ri-chat-smile-2-line" },
                  { step: "03", title: "Analyze", desc: "Get instant insights", icon: "ri-brain-line" },
                  { step: "04", title: "Connect", desc: "Book a specialist", icon: "ri-calendar-check-line" }
                ].map((item, i) => (
                  <div key={i} className="text-center group">
                    <div className="w-20 h-20 mx-auto bg-white/90 backdrop-blur-sm rounded-full border-4 border-gray-100 shadow-lg flex items-center justify-center mb-6 relative z-10 group-hover:border-primary-100 transition-colors duration-300">
                      <i className={`${item.icon} text-3xl text-gray-400 group-hover:text-primary-600 transition-colors duration-300`}></i>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold border-2 border-white">
                        {item.step}
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-500 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Live User Reviews Section */}
        <UserReviews />

        {/* CTA Section */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto relative rounded-[2.5rem] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-12 md:p-20 gap-10">
              <div className="text-center md:text-left text-white max-w-2xl">
                <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                  Ready to take control of your health?
                </h2>
                <p className="text-primary-100 text-lg md:text-xl mb-8">
                  Join thousands of users who trust AfyaLynx for their daily healthcare needs.
                  Start your free trial today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Link href="/signup" className="px-8 py-4 bg-white text-primary-700 rounded-xl font-bold hover:bg-gray-50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center">
                    Get Started Free
                  </Link>
                  <Link href="/about" className="px-8 py-4 bg-primary-700/30 backdrop-blur-sm border border-white/20 text-white rounded-xl font-bold hover:bg-primary-700/40 transition-all duration-300 flex items-center justify-center">
                    Learn More
                  </Link>
                </div>
              </div>

              <div className="hidden md:block relative">
                <div className="w-64 h-64 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 flex items-center justify-center transform rotate-6 hover:rotate-0 transition-transform duration-500">
                  <i className="ri-heart-pulse-line text-8xl text-white/80"></i>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}

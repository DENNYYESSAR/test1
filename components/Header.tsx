'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const { user, loading, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  useEffect(() => {
    // Handle scroll effect
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setShowProfileDropdown(false);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Dynamic styles based on page and scroll state
  const headerBgClass = isHomePage && !isScrolled
    ? 'bg-transparent'
    : 'bg-white/10 backdrop-blur-xl';
    
  const textColorClass = isHomePage && !isScrolled
    ? 'text-slate-800'
    : 'text-slate-800';

  const navBgClass = isHomePage && !isScrolled
    ? 'bg-white/40 border-white/40 text-slate-800 backdrop-blur-md shadow-sm'
    : 'bg-white/40 border-white/20 text-slate-800 backdrop-blur-md shadow-sm';

  const navItemHoverClass = isHomePage && !isScrolled
    ? 'hover:bg-white/60 hover:text-primary-700'
    : 'hover:bg-white/60 hover:text-primary-700';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 will-change-transform ${headerBgClass}`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-10 h-10 group-hover:scale-105 transition-transform duration-300">
              <Image 
                src="/icon.svg" 
                alt="AfyaLynx Logo" 
                fill
                className={`object-contain`}
              />
            </div>
            <span className={`text-xl font-bold tracking-tight transition-colors ${textColorClass} group-hover:text-primary-500`}>AfyaLynx</span>
          </Link>

          <nav className={`hidden md:flex items-center space-x-1 absolute left-1/2 transform -translate-x-1/2 backdrop-blur-md px-2 py-1.5 rounded-full border shadow-sm transition-all duration-300 ${navBgClass}`}>
            {[
              { href: '/', label: 'Home' },
              { href: '/ai-diagnosis', label: 'AI Diagnosis' },
              { href: '/find-clinics', label: 'Find Clinics' },
              { href: '/blog', label: 'Blog' },
              { href: '/about', label: 'About' }
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${navItemHoverClass} ${pathname === item.href ? (isHomePage && !isScrolled ? 'bg-white/60 text-primary-700 shadow-sm' : 'bg-white text-primary-600 shadow-sm') : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center">
            {!loading && (
              <div className="flex items-center space-x-2">
                {user ? (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                      className={`flex items-center gap-2 pl-2 pr-1 py-1 rounded-full transition-colors duration-200 border border-transparent ${isHomePage && !isScrolled ? 'hover:bg-white/40 hover:border-white/40' : 'hover:bg-slate-100 hover:border-slate-200'}`}
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white shadow-sm">
                        <i className="ri-user-line text-sm"></i>
                      </div>
                      <i className={`ri-arrow-down-s-line transition-transform duration-200 ${showProfileDropdown ? 'rotate-180' : ''} ${isHomePage && !isScrolled ? 'text-slate-600' : 'text-slate-400'}`}></i>
                    </button>

                    {/* Dropdown Menu */}
                    {showProfileDropdown && (
                      <div className="absolute right-0 mt-4 w-60 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 py-2 z-50 animate-fadeIn overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-50 bg-slate-50/50">
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Signed in as</p>
                          <p className="text-sm font-semibold text-slate-900 truncate">{user.email}</p>
                        </div>
                        <Link
                          href="/dashboard"
                          onClick={() => setShowProfileDropdown(false)}
                          className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors duration-200 text-slate-600 hover:text-primary-600"
                        >
                          <i className="ri-dashboard-3-line text-lg"></i>
                          <span className="font-medium">Dashboard</span>
                        </Link>
                        <Link
                          href="/profile"
                          onClick={() => setShowProfileDropdown(false)}
                          className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors duration-200 text-slate-600 hover:text-primary-600"
                        >
                          <i className="ri-user-settings-line text-lg"></i>
                          <span className="font-medium">Profile</span>
                        </Link>
                        <div className="border-t border-slate-100 my-1"></div>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-5 py-3 hover:bg-red-50 transition-colors duration-200 text-slate-600 hover:text-red-600"
                        >
                          <i className="ri-logout-box-line text-lg"></i>
                          <span className="font-medium">Sign Out</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link href="/login" className={`px-6 py-2.5 rounded-full font-medium shadow-lg transition-all duration-200 whitespace-nowrap transform hover:-translate-y-0.5 ${isHomePage && !isScrolled ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/20' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/20'}`}>
                    <i className="ri-login-box-line mr-2"></i>Sign In
                  </Link>
                )}
              </div>
            )}
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-200 ${isHomePage && !isScrolled ? 'hover:bg-white/40' : 'hover:bg-slate-100'}`}
          >
            <i className={`ri-${isMenuOpen ? 'close' : 'menu'}-line text-2xl transition-all duration-300 ease-in-out ${isMenuOpen ? 'rotate-90' : ''} ${isHomePage && !isScrolled && !isMenuOpen ? 'text-slate-800' : 'text-slate-700'}`}></i>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${isMenuOpen ? 'max-h-[500px] opacity-100 mt-2' : 'max-h-0 opacity-0'
          }`}>
          <div className="p-2 space-y-1 bg-white rounded-2xl shadow-xl border border-slate-100">
            {[
              { href: '/', label: 'Home', icon: 'ri-home-line' },
              { href: '/ai-diagnosis', label: 'AI Diagnosis', icon: 'ri-brain-line' },
              { href: '/find-clinics', label: 'Find Clinics', icon: 'ri-map-pin-line' },
              { href: '/blog', label: 'Blog', icon: 'ri-article-line' },
              { href: '/about', label: 'About', icon: 'ri-information-line' }
            ].map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-600 hover:text-primary-600 hover:bg-primary-50 transition-colors duration-200"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <i className={`${item.icon} text-lg`}></i>
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            ))}

            <div className="border-t border-slate-100 pt-1 mt-1">
              {!loading && (
                <>
                  {user ? (
                    <>
                      <Link href="/dashboard" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-600 hover:text-primary-600 hover:bg-primary-50 transition-colors duration-200">
                        <i className="ri-dashboard-3-line text-lg"></i>
                        <span className="text-sm font-medium">Dashboard</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors duration-200 w-full text-left"
                      >
                        <i className="ri-logout-box-line text-lg"></i>
                        <span className="text-sm font-medium">Sign Out</span>
                      </button>
                    </>
                  ) : (
                    <Link href="/login" className="flex items-center justify-center space-x-2 px-3 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors duration-200 shadow-lg shadow-slate-900/20 mt-2">
                      <i className="ri-login-box-line text-lg"></i>
                      <span className="text-sm font-medium">Sign In</span>
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

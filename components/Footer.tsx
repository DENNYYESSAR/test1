'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const router = useRouter();

  const handleDashboardClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true';

    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  };

  return (
    <footer className="relative bg-slate-900 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand Section - Compact */}
          <div className="space-y-5">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative w-10 h-10 group-hover:scale-105 transition-transform duration-300">
                <Image 
                  src="/icon.svg" 
                  alt="AfyaLynx Logo" 
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold tracking-tight">AfyaLynx</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              AI-powered healthcare platform connecting patients with quality medical services.
            </p>
            {/* Social Links - Minimal */}
            <div className="flex space-x-3">
              {[
                { icon: 'ri-facebook-fill', href: '#' },
                { icon: 'ri-twitter-x-line', href: '#' },
                { icon: 'ri-linkedin-fill', href: '#' },
                { icon: 'ri-instagram-line', href: '#' },
                { icon: 'ri-tiktok-line', href: '#' }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-9 h-9 bg-slate-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-all duration-200 group"
                >
                  <i className={`${social.icon} text-slate-400 group-hover:text-white text-base transition-colors`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Services - Streamlined */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-5 uppercase tracking-wider">Services</h3>
            <ul className="space-y-3">
              {[
                { name: 'AI Diagnosis', href: '/ai-diagnosis' },
                { name: 'Find Clinics', href: '/find-clinics' },
                { name: 'Book Appointment', href: '/find-clinics' },
                { name: 'Telemedicine', href: '/dashboard' },
                { name: 'Health Records', href: '/profile' }
              ].map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    className="text-slate-400 hover:text-primary-400 text-sm transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company - Streamlined */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-5 uppercase tracking-wider">Company</h3>
            <ul className="space-y-3">
              {[
                { name: 'About', href: '/about' },
                { name: 'Blog', href: '/blog' },
                { name: 'Support', href: '/contact-support' },
                { name: 'Privacy', href: '/privacy-policy' }
              ].map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    className="text-slate-400 hover:text-primary-400 text-sm transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact - Compact */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-5 uppercase tracking-wider">Contact</h3>
            <div className="space-y-4 text-sm">
              <a href="mailto:support@afyalynx.com" className="flex items-center space-x-3 text-slate-400 hover:text-white transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center group-hover:bg-primary-600 transition-colors">
                  <i className="ri-mail-line text-primary-400 group-hover:text-white"></i>
                </div>
                <span>support@afyalynx.com</span>
              </a>
              <a href="tel:+1-800-AFYALYNX" className="flex items-center space-x-3 text-slate-400 hover:text-white transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center group-hover:bg-secondary-600 transition-colors">
                  <i className="ri-phone-line text-secondary-400 group-hover:text-white"></i>
                </div>
                <span>+1 (800) AFYA-LYNX</span>
              </a>
              <div className="flex items-center space-x-3 text-slate-400 group">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
                  <i className="ri-map-pin-line text-primary-400"></i>
                </div>
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Minimal */}
        <div className="pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-sm">
            <p className="text-slate-500">
              © {currentYear} AfyaLynx. All rights reserved.
            </p>
            <div className="flex items-center space-x-8">
              <Link href="/terms-of-service" className="text-slate-500 hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="/privacy-policy" className="text-slate-500 hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/contact-support" className="text-slate-500 hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

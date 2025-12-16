'use client';

import { useState } from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Link from 'next/link';

const clinicData = {
  '1': {
    id: 1,
    name: 'Central Medical Center',
    specialty: 'General Practice',
    rating: 4.8,
    reviews: 324,
    distance: '0.8 miles',
    address: '123 Healthcare Ave, Downtown',
    phone: '+1 (555) 123-4567',
    hours: 'Mon-Fri: 8:00 AM - 6:00 PM',
    email: 'info@centralmedical.com',
    website: 'www.centralmedical.com',
    insurance: ['Blue Cross', 'Aetna', 'Cigna'],
    image: 'https://readdy.ai/api/search-image?query=Modern%20medical%20clinic%20exterior%2C%20professional%20healthcare%20facility%2C%20clean%20white%20building%2C%20medical%20center%20entrance%2C%20blue%20medical%20cross%20signage%2C%20welcoming%20healthcare%20environment%2C%20professional%20medical%20building&width=800&height=400&seq=clinicdetail1&orientation=landscape',
    services: ['Primary Care', 'Preventive Medicine', 'Chronic Disease Management', 'Health Screenings', 'Immunizations', 'Minor Procedures'],
    doctors: [
      { name: 'Dr. Sarah Johnson', specialty: 'Internal Medicine', experience: '15 years' },
      { name: 'Dr. Michael Chen', specialty: 'Family Medicine', experience: '12 years' },
      { name: 'Dr. Lisa Martinez', specialty: 'Preventive Care', experience: '10 years' }
    ],
    amenities: ['Wheelchair Accessible', 'Parking Available', 'Lab Services On-Site', 'Pharmacy', 'Emergency Care'],
    description: 'Central Medical Center is a leading healthcare facility committed to providing comprehensive medical services to our community. With state-of-the-art equipment and experienced medical professionals, we offer personalized care in a comfortable environment.',
    nextAvailable: 'Today 2:30 PM'
  },
  '2': {
    id: 2,
    name: 'Westside Family Clinic',
    specialty: 'Family Medicine',
    rating: 4.6,
    reviews: 189,
    distance: '1.2 miles',
    address: '456 Family Way, Westside',
    phone: '+1 (555) 234-5678',
    hours: 'Mon-Sat: 7:00 AM - 8:00 PM',
    email: 'contact@westsideclinic.com',
    website: 'www.westsideclinic.com',
    insurance: ['United Health', 'Blue Cross', 'Medicare'],
    image: 'https://readdy.ai/api/search-image?query=Family%20medical%20clinic%2C%20warm%20welcoming%20healthcare%20facility%2C%20modern%20medical%20building%2C%20family-friendly%20medical%20center%2C%20professional%20healthcare%20exterior%2C%20community%20clinic%2C%20blue%20and%20white%20medical%20facility&width=800&height=400&seq=clinicdetail2&orientation=landscape',
    services: ['Family Care', 'Pediatrics', 'Women\'s Health', 'Senior Care', 'Chronic Disease Management'],
    doctors: [
      { name: 'Dr. Robert Wilson', specialty: 'Family Medicine', experience: '18 years' },
      { name: 'Dr. Emily Rodriguez', specialty: 'Pediatrics', experience: '14 years' }
    ],
    amenities: ['Family-Friendly Environment', 'Extended Hours', 'Same-Day Appointments', 'Telehealth Services'],
    description: 'Westside Family Clinic has been serving families in our community for over 20 years. We provide comprehensive healthcare services for patients of all ages in a warm, welcoming environment.',
    nextAvailable: 'Tomorrow 10:00 AM'
  }
};

interface ClinicDetailProps {
  clinicId: string;
}

export default function ClinicDetail({ clinicId }: ClinicDetailProps) {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [showBookingModal, setShowBookingModal] = useState(false);
  
  const clinic = clinicData[clinicId as keyof typeof clinicData];

  if (!clinic) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <i className="ri-hospital-line text-4xl text-gray-400"></i>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Clinic Not Found</h1>
          <p className="text-gray-600 mb-8 text-center max-w-md">
            The clinic you are looking for does not exist or has been removed from our directory.
          </p>
          <Link 
            href="/find-clinics" 
            className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-8 py-3 rounded-xl hover:shadow-lg hover:shadow-primary-500/20 transition-all duration-300 font-medium"
          >
            Browse All Clinics
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const openDirections = () => {
    const encodedAddress = encodeURIComponent(clinic.address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      
      <div className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link 
              href="/find-clinics" 
              className="inline-flex items-center text-gray-600 hover:text-primary-600 transition-colors"
            >
              <i className="ri-arrow-left-line mr-2"></i>
              Back to Find Clinics
            </Link>
          </div>

          {/* Clinic Header */}
          <div className="glass-panel rounded-2xl shadow-xl shadow-primary-500/5 overflow-hidden mb-8 border border-white/20">
            <div className="relative h-64">
              <img 
                src={clinic.image} 
                alt={clinic.name}
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h1 className="text-4xl font-bold text-white mb-2">{clinic.name}</h1>
                <div className="flex items-center space-x-4 text-white/90">
                  <div className="flex items-center">
                    <i className="ri-star-fill text-yellow-400 mr-1"></i>
                    <span className="font-semibold">{clinic.rating}</span>
                    <span className="ml-1 opacity-80">({clinic.reviews} reviews)</span>
                  </div>
                  <span className="w-1 h-1 bg-white/50 rounded-full"></span>
                  <span className="font-medium">{clinic.specialty}</span>
                </div>
              </div>
            </div>
            
            <div className="p-8">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
                <div className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                        <i className="ri-map-pin-2-line text-primary-600 text-lg"></i>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 mb-1">Location</p>
                        <p>{clinic.address}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                        <i className="ri-phone-line text-primary-600 text-lg"></i>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 mb-1">Contact</p>
                        <p>{clinic.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                        <i className="ri-time-line text-primary-600 text-lg"></i>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 mb-1">Hours</p>
                        <p>{clinic.hours}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                        <i className="ri-mail-line text-primary-600 text-lg"></i>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 mb-1">Email</p>
                        <p>{clinic.email}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:w-80 space-y-4">
                  <div className="bg-green-50/50 border border-green-100 p-4 rounded-xl">
                    <div className="flex items-center space-x-2 text-green-700">
                      <i className="ri-calendar-check-line text-xl"></i>
                      <span className="font-medium">Next Available: {clinic.nextAvailable}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setShowBookingModal(true)}
                    className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-3.5 rounded-xl hover:shadow-lg hover:shadow-primary-500/20 transition-all duration-300 font-medium cursor-pointer whitespace-nowrap"
                  >
                    Book Appointment
                  </button>
                  
                  <button
                    onClick={openDirections}
                    className="w-full bg-white border border-gray-200 text-gray-700 py-3.5 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 font-medium cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
                  >
                    <i className="ri-direction-line"></i>
                    Get Directions
                  </button>
                  
                  <button className="w-full bg-white border border-gray-200 text-gray-700 py-3.5 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 font-medium cursor-pointer whitespace-nowrap flex items-center justify-center gap-2">
                    <i className="ri-phone-line"></i>
                    Call Now
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="glass-panel rounded-2xl shadow-xl shadow-primary-500/5 border border-white/20">
            <div className="border-b border-gray-100">
              <nav className="flex space-x-8 px-8 overflow-x-auto">
                {['overview', 'services', 'doctors', 'reviews'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm capitalize cursor-pointer transition-colors whitespace-nowrap ${
                      selectedTab === tab
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-8">
              {selectedTab === 'overview' && (
                <div className="space-y-10">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">About {clinic.name}</h2>
                    <p className="text-gray-600 leading-relaxed">{clinic.description}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Amenities & Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {clinic.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50/50 border border-gray-100">
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                            <i className="ri-check-line text-green-600 text-sm"></i>
                          </div>
                          <span className="text-gray-700">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Accepted Insurance</h3>
                    <div className="flex flex-wrap gap-3">
                      {clinic.insurance.map((ins, index) => (
                        <span key={index} className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm font-medium shadow-sm">
                          {ins}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {selectedTab === 'services' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Services Offered</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {clinic.services.map((service, index) => (
                      <div key={index} className="bg-gray-50/50 border border-gray-100 p-4 rounded-xl hover:shadow-md transition-shadow duration-300">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                            <i className="ri-health-book-line text-white text-xl"></i>
                          </div>
                          <span className="font-medium text-gray-900 text-lg">{service}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedTab === 'doctors' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Medical Staff</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {clinic.doctors.map((doctor, index) => (
                      <div key={index} className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                            <i className="ri-user-line text-primary-600 text-2xl"></i>
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">{doctor.name}</h3>
                            <p className="text-primary-600 font-medium">{doctor.specialty}</p>
                            <p className="text-gray-500 text-sm mt-1">{doctor.experience} of experience</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedTab === 'reviews' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Patient Reviews</h2>
                  <div className="space-y-6">
                    {[1, 2, 3].map((review) => (
                      <div key={review} className="bg-gray-50/50 border border-gray-100 p-6 rounded-xl">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-lg">
                            JS
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-bold text-gray-900">John Smith</h4>
                              <span className="text-sm text-gray-500">2 weeks ago</span>
                            </div>
                            <div className="flex items-center mb-3">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <i key={star} className="ri-star-fill text-yellow-400 text-sm mr-0.5"></i>
                              ))}
                            </div>
                            <p className="text-gray-600 leading-relaxed">
                              Excellent service and professional staff. Dr. Johnson was very thorough and took time to answer all my questions. The facility is clean and modern.
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-panel rounded-2xl max-w-md w-full p-6 shadow-2xl border border-white/20 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Book Appointment</h3>
              <button 
                onClick={() => setShowBookingModal(false)}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer rounded-full hover:bg-gray-100 transition-colors"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            
            <div className="space-y-5">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <h4 className="font-semibold text-gray-900">{clinic.name}</h4>
                <p className="text-gray-600 text-sm">{clinic.specialty}</p>
              </div>
              
              <div className="bg-green-50/50 border border-green-100 p-4 rounded-xl">
                <div className="flex items-center space-x-2 text-green-700">
                  <i className="ri-calendar-check-line"></i>
                  <span className="font-medium text-sm">Next Available: {clinic.nextAvailable}</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Preferred Date</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Reason for Visit</label>
                  <textarea 
                    rows={3} 
                    maxLength={200}
                    placeholder="Brief description of your concerns..."
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl resize-none text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
                  ></textarea>
                </div>
              </div>
              
              <div className="flex space-x-3 pt-2">
                <button 
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 bg-white border border-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 font-medium cursor-pointer whitespace-nowrap"
                >
                  Cancel
                </button>
                <button className="flex-1 bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-3 rounded-xl hover:shadow-lg hover:shadow-primary-500/20 transition-all duration-300 font-medium cursor-pointer whitespace-nowrap">
                  Confirm Booking
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
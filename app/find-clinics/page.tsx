'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Dropdown from '../../components/Dropdown';
import Link from 'next/link';
import { GoogleMap, useJsApiLoader, Marker as GoogleMarker, InfoWindow as GoogleInfoWindow } from '@react-google-maps/api';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

interface Clinic {
  id: number | string;
  name: string;
  specialty: string;
  rating: number | string;
  reviews?: number;
  distance: string;
  address: string;
  phone: string;
  hours: string;
  insurance: string[];
  image?: string;
  services: string[];
  nextAvailable: string;
  source?: string;
  latitude?: number;
  longitude?: number;
  website?: string;
}

interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '16px'
};

const defaultCenter = {
  lat: -1.2921, // Nairobi default
  lng: 36.8219
};

const libraries: ("places")[] = ["places"];

// Reusable Clinic Card Component
const ClinicCard = ({ clinic, onBook }: { clinic: Clinic; onBook: () => void }) => (
  <div className="glass-panel p-4 md:p-6 hover:border-primary-500/30 transition-all duration-300 group relative overflow-hidden">
    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-primary-500/10"></div>
    
    <div className="relative grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
      <div className="lg:col-span-1 relative">
        <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={clinic.image || 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=800&auto=format&fit=crop'}
            alt={clinic.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=800&auto=format&fit=crop';
            }}
          />
        </div>
        {clinic.source === 'web-scraped' && (
          <span className="absolute top-3 left-3 bg-purple-600/90 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 font-medium shadow-lg">
            <i className="ri-ai-generate"></i>
            <span>AI Found</span>
          </span>
        )}
      </div>

      <div className="lg:col-span-2 space-y-3 md:space-y-5">
        <div>
          <div className="flex items-start justify-between mb-1 md:mb-2">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
              {clinic.name}
            </h3>
            <div className="flex items-center gap-1.5 bg-yellow-50 px-2 md:px-2.5 py-0.5 md:py-1 rounded-lg border border-yellow-100">
              <i className="ri-star-fill text-yellow-400 text-xs md:text-sm"></i>
              <span className="font-bold text-gray-900 text-xs md:text-sm">{clinic.rating}</span>
              <span className="text-gray-500 text-xs md:text-sm">({clinic.reviews})</span>
            </div>
          </div>
          <p className="text-primary-600 font-medium mb-2 md:mb-3 flex items-center gap-2 text-sm md:text-base">
            <i className="ri-stethoscope-line"></i>
            {clinic.specialty}
          </p>
          <div className="flex items-center text-gray-500 text-xs md:text-sm gap-2 md:gap-4">
            <div className="flex items-center gap-1.5 bg-gray-50 px-2 md:px-2.5 py-0.5 md:py-1 rounded-lg">
              <i className="ri-map-pin-line"></i>
              <span>{clinic.distance}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-green-50 px-2 md:px-2.5 py-0.5 md:py-1 rounded-lg text-green-700">
              <i className="ri-time-line"></i>
              <span className="font-medium">{clinic.nextAvailable}</span>
            </div>
          </div>
        </div>

        <div className="space-y-1.5 md:space-y-2.5 pt-3 md:pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2.5 text-xs md:text-sm text-gray-600">
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
              <i className="ri-map-pin-2-line"></i>
            </div>
            <span className="truncate">{clinic.address}</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs md:text-sm text-gray-600">
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
              <i className="ri-phone-line"></i>
            </div>
            <span>{clinic.phone}</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs md:text-sm text-gray-600">
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
              <i className="ri-time-line"></i>
            </div>
            <span>{clinic.hours}</span>
          </div>
        </div>

        <div>
          <div className="flex flex-wrap gap-1.5 md:gap-2">
            {clinic.services.map((service, index) => (
              <span key={index} className="bg-primary-50 text-primary-700 px-2 md:px-3 py-0.5 md:py-1 rounded-lg text-[10px] md:text-xs font-medium border border-primary-100">
                {service}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-1 flex flex-row lg:flex-col gap-2 md:gap-3 border-t lg:border-t-0 lg:border-l border-gray-100 pt-3 lg:pt-0 pl-0 lg:pl-6 mt-2 lg:mt-0">
        {clinic.source === 'registered' ? (
          <button
            onClick={onBook}
            className="flex-1 lg:flex-none btn-primary py-2 md:py-3 rounded-lg md:rounded-xl text-xs md:text-sm font-bold shadow-lg shadow-primary-500/20 flex items-center justify-center gap-2"
          >
            <span>Book</span>
            <i className="ri-arrow-right-line"></i>
          </button>
        ) : (
          <a
            href={`tel:${clinic.phone}`}
            className="flex-1 lg:flex-none py-2 md:py-3 rounded-lg md:rounded-xl bg-green-50 text-green-700 border border-green-200 text-xs md:text-sm font-bold hover:bg-green-100 transition-all flex items-center justify-center gap-2"
          >
            <i className="ri-phone-fill"></i>
            <span>Call</span>
          </a>
        )}
        <button
          onClick={() => {
            const encodedAddress = encodeURIComponent(clinic.address);
            window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
          }}
          className="flex-1 lg:flex-none py-2 md:py-3 rounded-lg md:rounded-xl border border-gray-200 text-gray-700 text-xs md:text-sm font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
        >
          <i className="ri-direction-line"></i>
          <span className="lg:hidden">Map</span>
          <span className="hidden lg:inline">Directions</span>
        </button>
      </div>
    </div>
  </div>
);

export default function FindClinics() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries
  });

  const { user, loading } = useAuth();
  const router = useRouter();

  // Removed automatic redirect to allow for a teaser view
  // useEffect(() => {
  //   if (!loading && !user) {
  //     router.push('/login');
  //   }
  // }, [user, loading, router]);

  // DEBUG: Check which API key is loaded
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
    console.log('Current API Key (First 5 chars):', key.substring(0, 5) + '...');
    if (!key) alert('CRITICAL: No Google Maps API Key found in environment variables!');
  }, []);

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [location, setLocation] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [insuranceFilter, setInsuranceFilter] = useState('');
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<Clinic | null>(null);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [isLoadingClinics, setIsLoadingClinics] = useState(false);
  const [showLocationPrompt, setShowLocationPrompt] = useState(true);
  const [areaOfInterest, setAreaOfInterest] = useState('');
  const [includeScraping, setIncludeScraping] = useState(true);

  // Booking State
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingReason, setBookingReason] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  // Initialize empty
  useEffect(() => {
    setClinics([]);
  }, []);

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map: google.maps.Map) {
    setMap(null);
  }, []);

  // Request user's geolocation
  const requestLocation = () => {
    setIsLoadingLocation(true);
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setIsLoadingLocation(false);
      return;
    }

    // Check for Secure Context
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      alert('Geolocation requires a secure connection (HTTPS). It may not work on network IPs (like 192.168.x.x). Please use http://localhost:3000 if possible.');
    }

    console.log('Requesting location...');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        console.log('Location found:', position.coords);
        const { latitude, longitude, accuracy } = position.coords;
        setUserLocation({ latitude, longitude, accuracy });
        setIsLoadingLocation(false);
        setShowLocationPrompt(false);
        setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);

        // Center map
        if (map) {
          map.panTo({ lat: latitude, lng: longitude });
          map.setZoom(14);
        }

        // Fetch nearby clinics
        await fetchNearbyClinics(latitude, longitude);
      },
      (error) => {
        console.error('Location error:', error);
        setIsLoadingLocation(false);
        let errorMsg = '';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = 'Location access denied. Please enable location permissions in your browser settings (click the lock icon in the address bar).';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMsg = 'Location request timed out. Please try again or check your internet connection.';
            break;
          default:
            errorMsg = `An unknown error occurred: ${error.message}`;
        }
        setLocationError(errorMsg);
        alert(errorMsg); // Explicit alert to make sure user sees it
      },
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 10000 // Accept positions up to 10 seconds old
      }
    );
  };

  // Fetch nearby clinics via Google Places API (Client Side) and Registered Clinics (Server Side)
  const fetchNearbyClinics = async (lat: number, lon: number) => {
    setIsLoadingClinics(true);
    setClinics([]); // Clear previous results

    const allClinics: Clinic[] = [];

    // 1. Fetch Registered Clinics from our Database
    try {
      const res = await fetch(`/api/clinics/nearby?lat=${lat}&lng=${lon}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.clinics) {
          allClinics.push(...data.clinics);
        }
      }
    } catch (err) {
      console.error('Failed to fetch registered clinics', err);
    }

    // 2. Fetch Google Places
    try {
      if (window.google && map) {
        const service = new window.google.maps.places.PlacesService(map);
        const request = {
          location: new window.google.maps.LatLng(lat, lon),
          radius: 5000, // 5km
          type: 'hospital',
          keyword: specialty && specialty !== 'All Specialties' ? specialty : 'medical clinic'
        };

        service.nearbySearch(request, (results, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
            const googleClinics = results.map((place) => ({
              id: place.place_id || Math.random(),
              name: place.name || 'Unknown Clinic',
              specialty: specialty !== 'All Specialties' ? specialty : 'General Healthcare',
              rating: place.rating || '4.5',
              reviews: place.user_ratings_total || 0,
              distance: 'Nearby',
              address: place.vicinity || 'Address not available',
              phone: 'Contact for details',
              hours: place.opening_hours?.isOpen() ? 'Open Now' : 'Check hours',
              insurance: ['Contact to verify'],
              image: place.photos?.[0]?.getUrl({ maxWidth: 800, maxHeight: 600 }) || 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=800&auto=format&fit=crop',
              services: ['General Medical Services'],
              nextAvailable: 'Call for appointment',
              latitude: place.geometry?.location?.lat(),
              longitude: place.geometry?.location?.lng(),
              source: 'google-places'
            }));
            
            // Combine results: Registered first, then Google
            setClinics([...allClinics, ...googleClinics]);
          } else {
            // If Google fails or returns zero, still show registered clinics
            setClinics(allClinics);
            
            console.error('Places Search failed with status:', status);
            if (status !== 'ZERO_RESULTS' && status !== 'OK') {
               // Only alert on actual errors, not just zero results if we have registered clinics
               if (allClinics.length === 0) {
                 let errorMsg = `Search failed: ${status}`;
                 if (status === 'REQUEST_DENIED') {
                   errorMsg = 'Search denied. Please check your API Key.';
                 }
                 alert(errorMsg);
               }
            }
          }
          setIsLoadingClinics(false);
        });
      } else {
        console.warn('Google Maps or Map instance not loaded');
        setClinics(allClinics);
        setIsLoadingClinics(false);
      }

    } catch (error) {
      console.error('Error fetching clinics:', error);
      setClinics(allClinics);
      setIsLoadingClinics(false);
    }
  };

  // AI-powered scraping for area of interest
  const scrapeAreaClinics = async () => {
    if (!userLocation || !areaOfInterest) {
      alert('Please enable location and enter an area of interest');
      return;
    }

    setIsLoadingClinics(true);
    try {
      const response = await fetch('/api/clinics/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          areaOfInterest,
          specialty: specialty !== 'All Specialties' ? specialty : undefined
        })
      });

      const data = await response.json();

      if (data.success && data.results) {
        const scrapedClinics = data.results.map((c: any, idx: number) => ({
          ...c,
          id: `ai-scraped-${idx}`,
          distance: 'Calculating...',
          image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=800&auto=format&fit=crop',
          nextAvailable: 'Call for availability',
          reviews: c.reviews || 0,
        }));

        setClinics(prev => [...prev, ...scrapedClinics]);
        alert(`Found ${scrapedClinics.length} additional healthcare facilities!`);
      }
    } catch (e) {
      console.error(e);
      alert('Failed to scrape');
    } finally {
      setIsLoadingClinics(false);
    }
  };

  const specialties = [
    'All Specialties', 'General Practice', 'Family Medicine', 'Cardiology',
    'Urgent Care', 'Women\'s Health', 'Pediatrics', 'Dermatology', 'Orthopedics'
  ];

  const insuranceOptions = [
    'All Insurance', 'Blue Cross', 'Aetna', 'Cigna', 'United Health', 'Medicare', 'Medicaid'
  ];

  const filteredClinics = clinics.filter(clinic => {
    if (specialty && specialty !== 'All Specialties' && clinic.specialty !== specialty) {
      if (clinic.source === 'google-places') return true;
      return false;
    }
    if (insuranceFilter && insuranceFilter !== 'All Insurance') {
      if (!clinic.insurance.some(ins => ins.toLowerCase().includes(insuranceFilter.toLowerCase()))) {
        return false;
      }
    }
    return true;
  });

  const registeredClinics = filteredClinics.filter(c => c.source === 'registered');
  const otherClinics = filteredClinics.filter(c => c.source !== 'registered');

  const handleBookAppointment = (clinic: Clinic) => {
    if (clinic.source !== 'registered') {
      alert('Please contact this clinic directly to book an appointment.');
      return;
    }
    if (!user) {
      router.push('/login');
      return;
    }
    setSelectedClinic(clinic);
    setBookingDate('');
    setBookingTime('');
    setBookingReason('');
  };

  const closeModal = () => {
    setSelectedClinic(null);
  };

  const confirmBooking = async () => {
    if (!selectedClinic || !bookingDate || !bookingTime || !user) return;

    setIsBooking(true);
    try {
      const idToken = await user.getIdToken();
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({
          clinicId: String(selectedClinic.id),
          doctorName: 'Available Specialist', // Defaulting as we don't have doctor selection
          clinicName: selectedClinic.name,
          specialty: selectedClinic.specialty,
          appointmentDate: bookingDate,
          appointmentTime: bookingTime,
          appointmentType: 'Consultation',
          notes: bookingReason
        })
      });

      if (response.ok) {
        alert('Appointment booked successfully!');
        closeModal();
        router.push('/dashboard');
      } else {
        const err = await response.json();
        alert(`Booking failed: ${err.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Booking error', error);
      alert('Failed to book appointment. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Header />

      <div className="pt-32 pb-16 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-primary-50 rounded-full text-primary-600 text-sm font-medium mb-6 border border-primary-100">
              <i className="ri-map-pin-line mr-2"></i>
              Find Healthcare Providers
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Discover Quality Healthcare
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600 block">Near You</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Find qualified clinics and specialists in your area with real-time availability,
              AI-powered search, and instant booking capabilities.
            </p>
          </div>

          {/* Informational Content */}
          <div className="mb-16">
            <div className="grid md:grid-cols-3 gap-8 mb-16 text-left">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                  <i className="ri-hospital-line text-3xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Faster Access to Care</h3>
                <p className="text-gray-600 leading-relaxed">
                  Skip the long wait times. Our platform helps you quickly identify clinics with immediate availability, ensuring you get the medical attention you need, when you need it.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mb-6">
                  <i className="ri-map-pin-time-line text-3xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Efficient Allocation</h3>
                <p className="text-gray-600 leading-relaxed">
                  We optimize patient distribution by directing you to less crowded facilities nearby. This helps balance the load on healthcare providers and reduces your waiting time significantly.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-6">
                  <i className="ri-shield-check-line text-3xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Verified Quality</h3>
                <p className="text-gray-600 leading-relaxed">
                  Every clinic on our platform is verified for quality and safety standards. Filter by insurance acceptance and specialty to find the perfect match for your healthcare needs.
                </p>
              </div>
            </div>

            {/* How It Works Section */}
            <div className="mb-20">
              <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">How It Works</h2>
              <div className="grid md:grid-cols-4 gap-8">
                <div className="relative">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-xl font-bold text-primary-600 shadow-md mx-auto mb-4 border-2 border-primary-100 z-10 relative">1</div>
                  <h4 className="font-bold text-gray-900 mb-2 text-center">Search</h4>
                  <p className="text-sm text-gray-600 text-center">Enter your location and specialty</p>
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gray-200 -z-0"></div>
                </div>
                <div className="relative">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-xl font-bold text-primary-600 shadow-md mx-auto mb-4 border-2 border-primary-100 z-10 relative">2</div>
                  <h4 className="font-bold text-gray-900 mb-2 text-center">Compare</h4>
                  <p className="text-sm text-gray-600 text-center">View ratings, prices, and distance</p>
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gray-200 -z-0"></div>
                </div>
                <div className="relative">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-xl font-bold text-primary-600 shadow-md mx-auto mb-4 border-2 border-primary-100 z-10 relative">3</div>
                  <h4 className="font-bold text-gray-900 mb-2 text-center">Book</h4>
                  <p className="text-sm text-gray-600 text-center">Select a time slot that works for you</p>
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gray-200 -z-0"></div>
                </div>
                <div className="relative">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-xl font-bold text-primary-600 shadow-md mx-auto mb-4 border-2 border-primary-100 z-10 relative">4</div>
                  <h4 className="font-bold text-gray-900 mb-2 text-center">Visit</h4>
                  <p className="text-sm text-gray-600 text-center">Get directions and see the doctor</p>
                </div>
              </div>
            </div>

            {/* Popular Specialties */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Popular Specialties</h2>
              <div className="flex flex-wrap justify-center gap-3">
                {['General Practice', 'Dentistry', 'Pediatrics', 'Dermatology', 'Cardiology', 'Orthopedics', 'Gynecology', 'Ophthalmology'].map((spec) => (
                  <span key={spec} className="px-4 py-2 bg-white rounded-full text-gray-600 border border-gray-200 text-sm font-medium shadow-sm">
                    {spec}
                  </span>
                ))}
                <span className="px-4 py-2 bg-gray-100 rounded-full text-gray-500 text-sm font-medium">+ 20 more</span>
              </div>
            </div>
          </div>

          {/* Location Permission Prompt */}
          {showLocationPrompt && !userLocation && (
            <div className="bg-gradient-to-br from-primary-600 to-secondary-600 rounded-3xl shadow-xl p-8 mb-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-12 -mb-12 blur-2xl"></div>
              
              <div className="relative flex items-center justify-between flex-wrap gap-6">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm p-4 rounded-2xl flex items-center justify-center">
                    <i className="ri-map-pin-user-line text-3xl"></i>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Enable Location Access</h3>
                    <p className="text-white/90 text-lg font-medium">
                      Allow us to find the best healthcare facilities near you using GPS technology
                    </p>
                    <div className="flex items-center gap-6 mt-3 text-sm text-white/80">
                      <div className="flex items-center gap-2">
                        <i className="ri-shield-check-line"></i>
                        <span className="font-medium">Secure & Private</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <i className="ri-time-line"></i>
                        <span className="font-medium">Instant Results</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={requestLocation}
                  disabled={isLoadingLocation}
                  className="bg-white text-primary-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 shadow-lg"
                >
                  {isLoadingLocation ? (
                    <>
                      <i className="ri-loader-4-line animate-spin text-xl"></i>
                      <span>Detecting Location...</span>
                    </>
                  ) : (
                    <>
                      <i className="ri-navigation-line text-xl"></i>
                      <span>Use My Location</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Location Status */}
          {userLocation && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3 text-green-800 animate-fade-in">
              <i className="ri-map-pin-2-fill text-xl"></i>
              <span className="font-medium">
                Location enabled: {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
              </span>
              <span className="text-sm text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                ±{userLocation.accuracy.toFixed(0)}m accuracy
              </span>
            </div>
          )}

          {/* Location Error */}
          {locationError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3 animate-fade-in">
              <i className="ri-error-warning-line text-red-600 text-xl mt-0.5"></i>
              <div>
                <p className="text-red-800 font-medium">{locationError}</p>
                <button
                  onClick={requestLocation}
                  className="text-red-600 underline text-sm mt-1 hover:text-red-700 font-medium"
                >
                  Try again
                </button>
              </div>
            </div>
          )}

          {/* Search Filters */}
          <div className="glass-panel p-8 rounded-3xl shadow-xl mb-8 relative z-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                  <i className="ri-map-pin-line text-primary-500"></i>
                  <span>Location</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter city or use GPS"
                    className="w-full px-4 py-3 pl-10 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none text-sm"
                    disabled={isLoadingLocation}
                  />
                  <i className="ri-map-pin-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  {!userLocation && (
                    <button
                      onClick={requestLocation}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary-600 hover:bg-primary-50 p-1.5 rounded-lg transition-all"
                      title="Use my location"
                    >
                      <i className="ri-navigation-line"></i>
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                  <i className="ri-stethoscope-line text-secondary-500"></i>
                  <span>Specialty</span>
                </label>
                <Dropdown
                  options={specialties}
                  value={specialty}
                  onChange={setSpecialty}
                  placeholder="All Specialties"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                  <i className="ri-shield-check-line text-green-500"></i>
                  <span>Insurance</span>
                </label>
                <Dropdown
                  options={insuranceOptions}
                  value={insuranceFilter}
                  onChange={setInsuranceFilter}
                  placeholder="All Insurance"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                  <i className="ri-search-line text-primary-500"></i>
                  <span>Search</span>
                </label>
                <button
                  onClick={() => {
                    if (userLocation) {
                      fetchNearbyClinics(userLocation.latitude, userLocation.longitude);
                    } else if (location) {
                      alert('Please enable GPS or enter a valid location');
                    } else {
                      alert('Please enter a location or enable GPS');
                    }
                  }}
                  disabled={isLoadingClinics}
                  className="btn-primary w-full h-[46px] rounded-xl font-bold shadow-lg shadow-primary-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoadingClinics ? (
                    <>
                      <i className="ri-loader-4-line animate-spin text-xl"></i>
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <i className="ri-search-line text-xl"></i>
                      <span>Find Clinics</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* AI Search Toggle */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-3 px-4 py-3 bg-purple-50 rounded-xl border border-purple-100 w-fit">
                <input
                  type="checkbox"
                  id="includeScraping"
                  checked={includeScraping}
                  onChange={(e) => setIncludeScraping(e.target.checked)}
                  className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500 focus:ring-2 border-gray-300"
                />
                <label htmlFor="includeScraping" className="text-sm text-purple-700 cursor-pointer font-medium flex items-center gap-2">
                  <i className="ri-ai-generate"></i>
                  <span>Include AI-powered web search for more results</span>
                </label>
              </div>
            </div>

            {/* Area of Interest Search */}
            {userLocation && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <i className="ri-ai-generate text-purple-500"></i>
                  AI-Powered Area Search
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={areaOfInterest}
                    onChange={(e) => setAreaOfInterest(e.target.value)}
                    placeholder="e.g., 'Downtown', 'Near University', 'Main Street area'"
                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all outline-none text-sm"
                  />
                  <button
                    onClick={scrapeAreaClinics}
                    disabled={isLoadingClinics || !areaOfInterest}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium shadow-lg shadow-purple-500/25"
                  >
                    {isLoadingClinics ? (
                      <>
                        <i className="ri-loader-4-line animate-spin"></i>
                        <span>Searching...</span>
                      </>
                    ) : (
                      <>
                        <i className="ri-search-line"></i>
                        <span>Search Area</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 ml-1">
                  Our AI will scrape the web to find additional healthcare facilities in your specified area
                </p>
              </div>
            )}
          </div>

          {/* GOOGLE MAP */}
          <div className="glass-panel p-2 rounded-3xl shadow-xl mb-8 overflow-hidden h-[300px] lg:h-[500px] relative [&_.gm-style-cc]:!hidden [&_.gmnoprint]:!hidden [&_a[href^='https://maps.google.com/maps']]:!hidden">
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={userLocation ? { lat: userLocation.latitude, lng: userLocation.longitude } : defaultCenter}
                zoom={userLocation ? 13 : 10}
                onLoad={onLoad}
                onUnmount={onUnmount}
                options={{
                  streetViewControl: false,
                  mapTypeControl: false,
                  disableDefaultUI: true,
                  zoomControl: true,
                }}
              >
                {/* User Marker */}
                {userLocation && (
                  <GoogleMarker
                    position={{ lat: userLocation.latitude, lng: userLocation.longitude }}
                    icon={{
                      url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                    }}
                    title="You are here"
                  />
                )}

                {/* Clinic Markers */}
                {clinics.map((clinic) => (
                  clinic.latitude && clinic.longitude && (
                    <GoogleMarker
                      key={clinic.id}
                      position={{ lat: clinic.latitude, lng: clinic.longitude }}
                      onClick={() => setSelectedMarker(clinic)}
                    />
                  )
                ))}

                {/* Info Window */}
                {selectedMarker && selectedMarker.latitude && selectedMarker.longitude && (
                  <GoogleInfoWindow
                    position={{ lat: selectedMarker.latitude, lng: selectedMarker.longitude }}
                    onCloseClick={() => setSelectedMarker(null)}
                  >
                    <div className="p-2 max-w-xs">
                      <h3 className="font-bold text-gray-900">{selectedMarker.name}</h3>
                      <p className="text-sm text-gray-600">{selectedMarker.specialty}</p>
                      <p className="text-xs text-primary-600 mt-1">{selectedMarker.address}</p>
                      <button
                        onClick={() => {
                          handleBookAppointment(selectedMarker);
                          setSelectedMarker(null);
                        }}
                        className="mt-2 w-full bg-primary-600 text-white text-xs py-2 rounded font-bold"
                      >
                        Book Now
                      </button>
                    </div>
                  </GoogleInfoWindow>
                )}
              </GoogleMap>
            ) : (
              <div className="flex items-center justify-center h-full glass-panel rounded-2xl">
                <div className="flex flex-col items-center gap-3">
                  <i className="ri-loader-4-line animate-spin text-3xl text-primary-500"></i>
                  <p className="text-gray-500 font-medium">Loading Map...</p>
                </div>
              </div>
            )}
          </div>

          {/* Clinics List */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                Available Clinics 
                <span className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full font-medium">
                  {filteredClinics.length}
                </span>
                {isLoadingClinics && (
                  <i className="ri-loader-4-line animate-spin text-primary-600"></i>
                )}
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-3 py-1.5 rounded-full border border-gray-100 shadow-sm">
                <i className="ri-time-line text-primary-500"></i>
                <span>Updated just now</span>
              </div>
            </div>

            {isLoadingClinics && (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-loader-4-line animate-spin text-3xl text-primary-600"></i>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Searching Nearby</h3>
                <p className="text-gray-500">Finding the best clinics near you...</p>
              </div>
            )}

            {!isLoadingClinics && filteredClinics.length === 0 && (
              <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-hospital-line text-4xl text-gray-300"></i>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No Clinics Found</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  We couldn&apos;t find any clinics matching your criteria. Try adjusting your filters or search area.
                </p>
              </div>
            )}

            {/* Registered Clinics Section */}
            {!isLoadingClinics && registeredClinics.length > 0 && (
              <div className="mb-12">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <i className="ri-verified-badge-fill text-blue-500"></i>
                  Partner Clinics
                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">Verified</span>
                </h3>
                <div className="grid grid-cols-1 gap-4 md:gap-6">
                  {registeredClinics.map((clinic) => (
                    <ClinicCard key={clinic.id} clinic={clinic} onBook={() => handleBookAppointment(clinic)} />
                  ))}
                </div>
              </div>
            )}

            {/* Other Clinics Section */}
            {!isLoadingClinics && otherClinics.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <i className="ri-map-pin-2-line text-gray-500"></i>
                  Nearby Facilities
                </h3>
                <div className="grid grid-cols-1 gap-4 md:gap-6">
                  {otherClinics.map((clinic) => (
                    <ClinicCard key={clinic.id} clinic={clinic} onBook={() => handleBookAppointment(clinic)} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {selectedClinic && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="glass-panel rounded-3xl max-w-md w-full p-8 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Book Appointment</h3>
              <button 
                onClick={closeModal} 
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-lg text-gray-900 mb-1">{selectedClinic.name}</h4>
                <p className="text-primary-600 font-medium">{selectedClinic.specialty}</p>
              </div>

              <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                <div className="flex items-center gap-2 text-green-800">
                  <i className="ri-calendar-check-line text-xl"></i>
                  <span className="font-medium">Next Available: {selectedClinic.nextAvailable}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Date</label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-sm"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Time</label>
                    <input
                      type="time"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-sm"
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Reason for Visit</label>
                  <textarea
                    rows={3}
                    maxLength={200}
                    placeholder="Brief description of your concerns..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all resize-none text-sm"
                    value={bookingReason}
                    onChange={(e) => setBookingReason(e.target.value)}
                  ></textarea>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={closeModal}
                  className="flex-1 py-3.5 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-all"
                  disabled={isBooking}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmBooking}
                  disabled={isBooking || !bookingDate || !bookingTime}
                  className="flex-1 btn-primary py-3.5 rounded-xl font-bold shadow-lg shadow-primary-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isBooking ? (
                    <>
                      <i className="ri-loader-4-line animate-spin"></i>
                      <span>Booking...</span>
                    </>
                  ) : (
                    <>
                      <i className="ri-check-line"></i>
                      <span>Confirm</span>
                    </>
                  )}
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

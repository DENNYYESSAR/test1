'use client';

/* eslint-disable @next/next/no-img-element */
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function About() {
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-blue-400/10 blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-400/10 blur-[100px]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full text-blue-600 text-sm font-medium mb-8 border border-blue-100">
              <i className="ri-information-line mr-2"></i>
              About AfyaLynx Platform
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Transforming Healthcare
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 block">Through Innovation</span>
            </h1>
            <p className="text-sm md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Revolutionizing healthcare accessibility through cutting-edge AI technology and connecting patients with quality healthcare providers worldwide.
            </p>
            
            {/* Hero stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-8 md:mt-12 max-w-4xl mx-auto">
              <div className="glass-panel p-4 md:p-6 rounded-xl md:rounded-2xl text-center hover:scale-105 transition-transform duration-300 group bg-white/50 backdrop-blur-xl border border-white/20">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                  <i className="ri-checkbox-circle-line text-white text-xl md:text-2xl"></i>
                </div>
                <div className="text-2xl md:text-4xl font-bold text-gray-900 mb-1 md:mb-2">98%</div>
                <div className="text-xs md:text-sm text-gray-600 font-medium">Accuracy Rate</div>
              </div>
              <div className="glass-panel p-4 md:p-6 rounded-xl md:rounded-2xl text-center hover:scale-105 transition-transform duration-300 group bg-white/50 backdrop-blur-xl border border-white/20">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                  <i className="ri-user-heart-line text-white text-xl md:text-2xl"></i>
                </div>
                <div className="text-2xl md:text-4xl font-bold text-gray-900 mb-1 md:mb-2">50K+</div>
                <div className="text-xs md:text-sm text-gray-600 font-medium">Users Served</div>
              </div>
              <div className="glass-panel p-4 md:p-6 rounded-xl md:rounded-2xl text-center hover:scale-105 transition-transform duration-300 group bg-white/50 backdrop-blur-xl border border-white/20">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform">
                  <i className="ri-time-line text-white text-xl md:text-2xl"></i>
                </div>
                <div className="text-2xl md:text-4xl font-bold text-gray-900 mb-1 md:mb-2">24/7</div>
                <div className="text-xs md:text-sm text-gray-600 font-medium">Availability</div>
              </div>
              <div className="glass-panel p-4 md:p-6 rounded-xl md:rounded-2xl text-center hover:scale-105 transition-transform duration-300 group bg-white/50 backdrop-blur-xl border border-white/20">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-lg shadow-green-500/20 group-hover:scale-110 transition-transform">
                  <i className="ri-hospital-line text-white text-xl md:text-2xl"></i>
                </div>
                <div className="text-2xl md:text-4xl font-bold text-gray-900 mb-1 md:mb-2">1000+</div>
                <div className="text-xs md:text-sm text-gray-600 font-medium">Partner Clinics</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Container with unified background */}
      <div className="relative">
        {/* Background Elements - matching AI Diagnosis page */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-[5%] right-[-5%] w-[300px] h-[300px] lg:w-[500px] lg:h-[500px] rounded-full bg-blue-400/10 blur-[60px] lg:blur-[100px]" />
          <div className="absolute top-[30%] left-[-10%] w-[350px] h-[350px] lg:w-[600px] lg:h-[600px] rounded-full bg-indigo-400/10 blur-[60px] lg:blur-[100px]" />
          <div className="absolute top-[60%] right-[-5%] w-[300px] h-[300px] lg:w-[450px] lg:h-[450px] rounded-full bg-purple-400/10 blur-[60px] lg:blur-[100px]" />
          <div className="absolute bottom-[10%] left-[-5%] w-[250px] h-[250px] lg:w-[400px] lg:h-[400px] rounded-full bg-green-400/10 blur-[60px] lg:blur-[100px]" />
        </div>

        {/* Mission Section */}
        <section className="py-24 relative">
          <div className="max-w-7xl mx-auto px-6 relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="animate-slideInLeft">
                <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full text-blue-600 text-sm font-medium mb-6 border border-blue-100">
                  <i className="ri-target-line mr-2"></i>
                  Our Mission
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-8">Empowering Global Healthcare Access</h2>
                <div className="space-y-6 text-lg text-gray-600">
                  <p className="leading-relaxed">
                    At AfyaLynx, we believe that quality healthcare should be accessible to everyone, everywhere. Our mission is to bridge the gap between patients and healthcare providers using advanced artificial intelligence and modern technology.
                  </p>
                  <p className="leading-relaxed">
                    We&apos;re committed to empowering individuals to take control of their health through AI-powered diagnosis, seamless clinic discovery, and comprehensive health record management.
                  </p>
                </div>
                
                {/* Mission pillars */}
                <div className="grid grid-cols-2 gap-3 md:gap-6 mt-8 md:mt-12">
                  <div className="bg-white/80 backdrop-blur-sm p-4 md:p-6 rounded-xl md:rounded-2xl text-center hover:scale-105 transition-transform duration-300 border border-gray-100 shadow-sm">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-lg shadow-blue-500/20">
                      <i className="ri-user-heart-line text-white text-xl md:text-2xl"></i>
                    </div>
                    <div className="text-xl md:text-2xl font-bold text-gray-900 mb-1 md:mb-2">50K+</div>
                    <div className="text-xs md:text-base text-gray-600 font-medium">Users Served</div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm p-4 md:p-6 rounded-xl md:rounded-2xl text-center hover:scale-105 transition-transform duration-300 border border-gray-100 shadow-sm">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-lg shadow-indigo-600/20">
                      <i className="ri-hospital-line text-white text-xl md:text-2xl"></i>
                    </div>
                    <div className="text-xl md:text-2xl font-bold text-indigo-600 mb-1 md:mb-2">1000+</div>
                    <div className="text-xs md:text-base text-gray-600 font-medium">Partner Clinics</div>
                  </div>
                </div>
              </div>
              
              <div className="relative animate-slideInRight">
                {/* Healthcare team mockup */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-gray-100">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <i className="ri-team-line text-white text-2xl"></i>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">Healthcare Team</h3>
                        <p className="text-sm text-gray-500">Global Network</p>
                      </div>
                    </div>
                    <div className="text-green-500">
                      <i className="ri-checkbox-circle-line text-2xl"></i>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <i className="ri-user-heart-line text-blue-600 text-xl"></i>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Licensed Physicians</p>
                        <p className="text-sm text-gray-500">Board-certified specialists</p>
                      </div>
                      <div className="text-blue-600 font-bold">2,500+</div>
                    </div>
                    <div className="flex items-center space-x-4 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
                      <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                        <i className="ri-hospital-line text-indigo-600 text-xl"></i>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Medical Centers</p>
                        <p className="text-sm text-gray-500">Accredited facilities</p>
                      </div>
                      <div className="text-indigo-600 font-bold">1,000+</div>
                    </div>
                    <div className="flex items-center space-x-4 p-4 bg-purple-50/50 rounded-xl border border-purple-100">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                        <i className="ri-global-line text-purple-600 text-xl"></i>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Countries Served</p>
                        <p className="text-sm text-gray-500">Global accessibility</p>
                      </div>
                      <div className="text-purple-600 font-bold">50+</div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                      <i className="ri-shield-check-line text-green-500"></i>
                      <span>HIPAA Compliant & Secure</span>
                    </div>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-6 -right-6 w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center animate-float">
                  <i className="ri-award-line text-2xl text-yellow-500"></i>
                </div>
                <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center animate-float" style={{animationDelay: '1s'}}>
                  <i className="ri-shield-check-line text-xl text-green-500"></i>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 relative">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-800 text-sm font-medium mb-6">
                <i className="ri-star-line mr-2"></i>
                What Drives Us
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Core Values</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">The principles that guide everything we do and inspire us to deliver exceptional healthcare</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/20">
                  <i className="ri-shield-check-line text-white text-3xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">Privacy & Security</h3>
                <p className="text-gray-600 leading-relaxed">
                  Your health data is sacred. We employ enterprise-grade security measures and comply with all healthcare privacy regulations to protect your information.
                </p>
                <div className="mt-6 flex items-center text-blue-600 font-medium group-hover:translate-x-2 transition-transform">
                  <span>Learn more</span>
                  <i className="ri-arrow-right-line ml-2"></i>
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-indigo-500/20">
                  <i className="ri-lightbulb-line text-white text-3xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors">Innovation</h3>
                <p className="text-gray-600 leading-relaxed">
                  We continuously advance our AI technology and platform capabilities to provide the most accurate and helpful healthcare solutions available.
                </p>
                <div className="mt-6 flex items-center text-indigo-600 font-medium group-hover:translate-x-2 transition-transform">
                  <span>Learn more</span>
                  <i className="ri-arrow-right-line ml-2"></i>
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-green-500/20">
                  <i className="ri-heart-line text-white text-3xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors">Compassionate Care</h3>
                <p className="text-gray-600 leading-relaxed">
                  Every feature we build is designed with empathy and understanding of the healthcare challenges people face every day.
                </p>
                <div className="mt-6 flex items-center text-green-600 font-medium group-hover:translate-x-2 transition-transform">
                  <span>Learn more</span>
                  <i className="ri-arrow-right-line ml-2"></i>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 relative">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 bg-purple-100 rounded-full text-purple-800 text-sm font-medium mb-6">
                <i className="ri-brain-line mr-2"></i>
                Our Technology
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Powered by Advanced AI</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">State-of-the-art AI technology specifically designed for healthcare diagnostics</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="animate-slideInLeft">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 shadow-xl border border-gray-100">
                  <img src="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80" 
                    alt="Advanced AI Technology" 
                    className="w-full h-auto rounded-2xl shadow-lg object-cover" />
                  <div className="mt-6 grid grid-cols-3 gap-4">
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-100">
                      <div className="text-2xl font-bold text-blue-600 mb-1">98%</div>
                      <div className="text-xs text-gray-600 font-medium">Accuracy</div>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-100">
                      <div className="text-2xl font-bold text-purple-600 mb-1">24/7</div>
                      <div className="text-xs text-gray-600 font-medium">Available</div>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-100">
                      <div className="text-2xl font-bold text-indigo-600 mb-1">10M+</div>
                      <div className="text-xs text-gray-600 font-medium">Records</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="animate-slideInRight">
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Our AI diagnosis system is built on advanced AI models specifically trained on biomedical literature and clinical data. This ensures our recommendations are based on the latest medical research and best practices.
                </p>
                <div className="space-y-6">
                  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group">
                    <div className="flex items-start space-x-4">
                      <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/20">
                        <i className="ri-brain-line text-white text-2xl"></i>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2 text-lg">Advanced Natural Language Processing</h4>
                        <p className="text-gray-600">Understands complex medical terminology and symptoms with human-like comprehension</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group">
                    <div className="flex items-start space-x-4">
                      <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                        <i className="ri-refresh-line text-white text-2xl"></i>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2 text-lg">Continuous Learning</h4>
                        <p className="text-gray-600">Constantly updated with the latest medical research and clinical guidelines</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group">
                    <div className="flex items-start space-x-4">
                      <div className="w-14 h-14 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                        <i className="ri-checkbox-circle-line text-white text-2xl"></i>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2 text-lg">High Accuracy</h4>
                        <p className="text-gray-600">Validated against clinical datasets with 98% accuracy for reliable diagnostics</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 relative">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-800 text-sm font-medium mb-6">
                <i className="ri-team-line mr-2"></i>
                Our Leadership
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">Healthcare professionals and technology experts dedicated to revolutionizing healthcare accessibility</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                <div className="relative">
                  <img src="https://readdy.ai/api/search-image?query=Professional%20portrait%20of%20confident%20African%20medical%20doctor%2C%20white%20coat%2C%20stethoscope%2C%20modern%20hospital%20background%2C%20warm%20smile%2C%20healthcare%20professional%20headshot%2C%20medical%20expertise%2C%20compassionate%20healthcare%20provider&width=400&height=400&seq=team1&orientation=squarish" 
                    alt="Dr. Sarah Johnson" 
                    className="w-full h-64 object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="p-8 text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">Dr. Sarah Johnson</h3>
                  <p className="text-blue-600 font-bold mb-4">Chief Medical Officer</p>
                  <p className="text-gray-600 leading-relaxed">15+ years in internal medicine and digital health innovation</p>
                  <div className="flex justify-center space-x-4 mt-6">
                    <a href="#" className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all group/icon">
                      <i className="ri-linkedin-line text-lg"></i>
                    </a>
                    <a href="#" className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all group/icon">
                      <i className="ri-twitter-line text-lg"></i>
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                <div className="relative">
                  <img src="https://readdy.ai/api/search-image?query=Professional%20portrait%20of%20technology%20executive%2C%20business%20suit%2C%20confident%20expression%2C%20modern%20office%20background%2C%20tech%20industry%20leader%2C%20innovation%20expert%2C%20digital%20health%20entrepreneur%2C%20professional%20headshot&width=400&height=400&seq=team2&orientation=squarish" 
                    alt="Michael Chen" 
                    className="w-full h-64 object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="p-8 text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">Michael Chen</h3>
                  <p className="text-indigo-600 font-bold mb-4">CTO & Co-Founder</p>
                  <p className="text-gray-600 leading-relaxed">AI researcher with expertise in biomedical natural language processing</p>
                  <div className="flex justify-center space-x-4 mt-6">
                    <a href="#" className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all group/icon">
                      <i className="ri-linkedin-line text-lg"></i>
                    </a>
                    <a href="#" className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all group/icon">
                      <i className="ri-twitter-line text-lg"></i>
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                <div className="relative">
                  <img src="https://readdy.ai/api/search-image?query=Professional%20portrait%20of%20healthcare%20administrator%2C%20business%20attire%2C%20welcoming%20smile%2C%20medical%20facility%20background%2C%20healthcare%20operations%20expert%2C%20patient%20care%20coordinator%2C%20professional%20healthcare%20management&width=400&height=400&seq=team3&orientation=squarish" 
                    alt="Emily Rodriguez" 
                    className="w-full h-64 object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="p-8 text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">Emily Rodriguez</h3>
                  <p className="text-green-600 font-bold mb-4">Head of Operations</p>
                  <p className="text-gray-600 leading-relaxed">Healthcare operations specialist focused on patient experience</p>
                  <div className="flex justify-center space-x-4 mt-6">
                    <a href="#" className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center hover:bg-green-600 hover:text-white transition-all group/icon">
                      <i className="ri-linkedin-line text-lg"></i>
                    </a>
                    <a href="#" className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center hover:bg-green-600 hover:text-white transition-all group/icon">
                      <i className="ri-twitter-line text-lg"></i>
                    </a>
                  </div>
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
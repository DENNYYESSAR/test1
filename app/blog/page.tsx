'use client';

import { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'AI & Technology', 'Preventive Care', 'Mental Health', 'Nutrition', 'Fitness'];

  const blogPosts = [
    {
      id: 1,
      title: 'How AI is Revolutionizing Medical Diagnosis: The Future of Healthcare',
      excerpt: 'Discover how artificial intelligence and machine learning are transforming the way doctors diagnose diseases, improving accuracy and reducing diagnosis time.',
      category: 'AI & Technology',
      author: 'Dr. Sarah Johnson',
      date: '2024-01-15',
      readTime: '8 min read',
      image: 'https://readdy.ai/api/search-image?query=AI%20medical%20diagnosis%20technology%2C%20doctor%20using%20artificial%20intelligence%20for%20patient%20care%2C%20futuristic%20medical%20interface%2C%20healthcare%20innovation%2C%20advanced%20medical%20technology%2C%20AI-powered%20healthcare%20systems%2C%20medical%20professional%20with%20digital%20tools&width=600&height=400&seq=blog1&orientation=landscape',
      featured: true
    },
    {
      id: 2,
      title: '10 Essential Preventive Care Steps for Better Health in 2024',
      excerpt: 'Learn about the most important preventive care measures you should take this year to maintain optimal health and prevent common diseases.',
      category: 'Preventive Care',
      author: 'Dr. Michael Chen',
      date: '2024-01-12',
      readTime: '6 min read',
      image: 'https://readdy.ai/api/search-image?query=Preventive%20healthcare%20concept%2C%20healthy%20lifestyle%20choices%2C%20medical%20checkup%2C%20wellness%20and%20prevention%2C%20healthy%20living%2C%20doctor%20patient%20consultation%2C%20preventive%20medicine%2C%20health%20screening&width=600&height=400&seq=blog2&orientation=landscape',
      featured: false
    },
    {
      id: 3,
      title: 'Mental Health in the Digital Age: Managing Stress and Anxiety',
      excerpt: 'Explore effective strategies for maintaining mental wellness in our connected world, including digital detox techniques and stress management.',
      category: 'Mental Health',
      author: 'Dr. Emily Rodriguez',
      date: '2024-01-10',
      readTime: '7 min read',
      image: 'https://readdy.ai/api/search-image?query=Mental%20health%20wellness%2C%20meditation%20and%20mindfulness%2C%20stress%20relief%2C%20peaceful%20mind%2C%20mental%20wellness%20concept%2C%20brain%20health%2C%20emotional%20wellbeing%2C%20relaxation%20and%20calm&width=600&height=400&seq=blog3&orientation=landscape',
      featured: false
    },
    {
      id: 4,
      title: 'The Science of Nutrition: Evidence-Based Eating for Optimal Health',
      excerpt: 'Understand the latest research on nutrition and how to make informed dietary choices that support your health goals and medical conditions.',
      category: 'Nutrition',
      author: 'Dr. James Wilson',
      date: '2024-01-08',
      readTime: '9 min read',
      image: 'https://readdy.ai/api/search-image?query=Healthy%20nutrition%20science%2C%20fresh%20fruits%20and%20vegetables%2C%20balanced%20diet%2C%20nutritious%20foods%2C%20healthy%20eating%20concept%2C%20medical%20nutrition%20therapy%2C%20food%20as%20medicine%2C%20healthy%20lifestyle&width=600&height=400&seq=blog4&orientation=landscape',
      featured: false
    },
    {
      id: 5,
      title: 'Telemedicine: Bridging Healthcare Gaps in Remote Communities',
      excerpt: 'Explore how telemedicine is making healthcare more accessible to underserved populations and the benefits of virtual medical consultations.',
      category: 'AI & Technology',
      author: 'Dr. Maria Gonzalez',
      date: '2024-01-05',
      readTime: '5 min read',
      image: 'https://readdy.ai/api/search-image?query=Telemedicine%20virtual%20consultation%2C%20doctor%20video%20call%20with%20patient%2C%20remote%20healthcare%2C%20digital%20medical%20consultation%2C%20telehealth%20technology%2C%20online%20medical%20care%2C%20healthcare%20accessibility&width=600&height=400&seq=blog5&orientation=landscape',
      featured: false
    },
    {
      id: 6,
      title: 'Building Healthy Habits: A Scientific Approach to Fitness',
      excerpt: 'Learn how to create sustainable fitness routines based on exercise science and behavioral psychology for long-term health benefits.',
      category: 'Fitness',
      author: 'Dr. Robert Kim',
      date: '2024-01-03',
      readTime: '6 min read',
      image: 'https://readdy.ai/api/search-image?query=Scientific%20fitness%20approach%2C%20exercise%20physiology%2C%20healthy%20workout%20routine%2C%20fitness%20science%2C%20athletic%20training%2C%20physical%20wellness%2C%20exercise%20medicine%2C%20health%20and%20fitness&width=600&height=400&seq=blog6&orientation=landscape',
      featured: false
    }
  ];

  const filteredPosts = selectedCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full"></div>
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <Header />
      
      <div className="pt-32 pb-16 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full text-blue-600 text-sm font-medium mb-6 border border-blue-100">
              <i className="ri-article-line mr-2"></i>
              Health & Wellness Blog
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Expert Health Insights &
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 block">Medical Knowledge</span>
            </h1>
            <p className="text-sm md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Stay informed with expert insights on healthcare, wellness, and medical innovations to help you make confident decisions about your health and wellbeing.
            </p>
          </div>

          {/* Category Filter */}
          <div className="glass-panel p-2 rounded-2xl mb-12 inline-block w-full bg-white/50 backdrop-blur-xl border border-white/20">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-xl transition-all duration-300 cursor-pointer whitespace-nowrap font-medium ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20'
                      : 'text-gray-600 hover:bg-white/50 hover:text-blue-600'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Featured Article */}
          {featuredPost && selectedCategory === 'All' && (
            <div className="mb-12">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white mb-8 shadow-xl shadow-blue-500/20">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <i className="ri-star-line text-white text-2xl"></i>
                  </div>
                  <div>
                    <span className="bg-white/20 text-white px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm">Featured Article</span>
                    <p className="text-white/90 mt-1">Don't miss our top recommendation</p>
                  </div>
                </div>
              </div>
              
              <div className="glass-panel rounded-3xl overflow-hidden hover:scale-[1.02] transition-transform duration-300 bg-white/50 backdrop-blur-xl border border-white/20 shadow-xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  <div className="relative h-80 lg:h-auto">
                    <img 
                      src={featuredPost.image} 
                      alt={featuredPost.title}
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute top-6 left-6">
                      <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                        <i className="ri-bookmark-line mr-1"></i>
                        {featuredPost.category}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                  
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                      {featuredPost.title}
                    </h2>
                    <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                      {featuredPost.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                          <i className="ri-user-line text-blue-600 text-xl"></i>
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{featuredPost.author}</p>
                          <p className="text-sm text-gray-600">{featuredPost.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <i className="ri-time-line"></i>
                        <span>{featuredPost.readTime}</span>
                      </div>
                    </div>
                    
                    <Link href={`/blog/${featuredPost.id}`} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-center shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 group inline-block">
                      <span className="flex items-center justify-center space-x-2">
                        <span>Read Full Article</span>
                        <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform"></i>
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {regularPosts.map((post, index) => (
              <article key={post.id} className="glass-panel rounded-2xl md:rounded-3xl overflow-hidden hover:scale-[1.02] transition-transform duration-300 group bg-white/50 backdrop-blur-xl border border-white/20 shadow-xl" style={{animationDelay: `${0.4 + index * 0.1}s`}}>
                <div className="relative overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-32 md:h-56 object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 md:top-4 md:left-4">
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-2 py-1 md:px-3 md:py-2 rounded-full text-[10px] md:text-sm font-bold shadow-lg">
                      <i className="ri-bookmark-line mr-1"></i>
                      {post.category}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                <div className="p-3 md:p-6">
                  <h3 className="text-sm md:text-xl font-bold text-gray-900 mb-2 md:mb-4 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-3 md:mb-6 line-clamp-3 leading-relaxed text-xs md:text-base">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between mb-3 md:mb-6">
                    <div className="flex items-center space-x-2 md:space-x-3">
                      <div className="w-6 h-6 md:w-10 md:h-10 bg-blue-50 rounded-lg md:rounded-2xl flex items-center justify-center">
                        <i className="ri-user-line text-blue-600 text-xs md:text-base"></i>
                      </div>
                      <div>
                        <p className="text-[10px] md:text-sm font-bold text-gray-900 truncate max-w-[80px] md:max-w-none">{post.author}</p>
                        <p className="text-[10px] md:text-xs text-gray-600">{post.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 text-[10px] md:text-xs text-gray-600">
                      <i className="ri-time-line"></i>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  
                  <Link href={`/blog/${post.id}`} className="block w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-2 md:px-4 md:py-3 rounded-xl md:rounded-2xl font-bold text-center shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 group/btn text-xs md:text-base">
                    <span className="flex items-center justify-center space-x-2">
                      <span>Read More</span>
                      <i className="ri-arrow-right-line group-hover/btn:translate-x-1 transition-transform"></i>
                    </span>
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Newsletter Subscription */}
          <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 lg:p-8 text-center shadow-xl shadow-blue-500/20">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <i className="ri-mail-send-line text-white text-2xl"></i>
              </div>
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3">Stay Updated with Health Insights</h2>
            <p className="text-white/90 mb-4 max-w-xl mx-auto text-base font-medium">
              Subscribe to our newsletter and get the latest health articles delivered weekly.
            </p>
            <p className="text-white/80 mb-6 max-w-lg mx-auto text-sm leading-relaxed">
              Join our community of health-conscious readers and receive expert medical advice, wellness tips, preventive care strategies, and the latest breakthroughs in healthcare technology directly to your inbox.
            </p>
            
            <form className="max-w-lg mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 rounded-xl text-gray-900 focus:ring-2 focus:ring-white focus:outline-none text-sm font-medium shadow-lg bg-white/90"
                />
                <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl whitespace-nowrap">
                  <span className="flex items-center justify-center space-x-2">
                    <span>Subscribe</span>
                    <i className="ri-send-plane-line"></i>
                  </span>
                </button>
              </div>
              <p className="text-white/80 text-xs mt-3 font-medium">
                <i className="ri-shield-check-line mr-1"></i>
                No spam, unsubscribe anytime.
              </p>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
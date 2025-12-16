'use client';

import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Link from 'next/link';

const blogPosts = {
  '1': {
    title: 'How AI is Revolutionizing Medical Diagnosis: The Future of Healthcare',
    content: `
      <p>Artificial Intelligence is transforming healthcare at an unprecedented pace, with medical diagnosis being one of the most promising frontiers. As we advance into 2024, AI-powered diagnostic tools are becoming increasingly sophisticated, offering healthcare providers and patients new levels of accuracy and efficiency.</p>

      <h2>The Current State of AI in Medical Diagnosis</h2>
      <p>Today's AI diagnostic systems, powered by advanced machine learning algorithms and natural language processing models like advanced AI, can analyze vast amounts of medical data in seconds. These systems are trained on millions of medical records, research papers, and clinical studies, enabling them to recognize patterns that might escape human observation.</p>

      <h2>Key Benefits of AI Diagnosis</h2>
      <p>The integration of AI in medical diagnosis brings several significant advantages:</p>
      <ul>
        <li><strong>Speed and Efficiency:</strong> AI can process symptoms and medical history instantly, providing preliminary diagnoses in real-time.</li>
        <li><strong>24/7 Availability:</strong> Unlike human doctors, AI systems are available around the clock, ensuring patients can get initial assessments anytime.</li>
        <li><strong>Consistency:</strong> AI doesn't suffer from fatigue or cognitive biases that can affect human judgment.</li>
        <li><strong>Accessibility:</strong> AI diagnosis makes healthcare more accessible, especially in underserved areas with limited medical professionals.</li>
      </ul>

      <h2>Advanced AI: Leading the Revolution</h2>
      <p>Advanced AI represents a significant leap forward in medical technology. Unlike general-purpose language models, our AI is specifically trained on biomedical literature and clinical data. This specialized training allows it to understand complex medical terminology, recognize subtle symptom patterns, and provide contextually relevant health insights.</p>

      <h2>The Future of AI in Healthcare</h2>
      <p>As we look toward the future, AI in healthcare will continue to evolve. We can expect to see more personalized medicine approaches, where AI systems take into account individual genetic profiles, lifestyle factors, and medical history to provide tailored health recommendations.</p>

      <p>Integration with wearable technology and IoT devices will enable continuous health monitoring, allowing AI systems to detect potential health issues before symptoms even appear. This proactive approach to healthcare could prevent serious conditions and reduce healthcare costs significantly.</p>

      <h2>Important Considerations</h2>
      <p>While AI diagnosis offers tremendous benefits, it's crucial to remember that these tools are designed to augment, not replace, human medical expertise. Healthcare professionals remain essential for confirming diagnoses, providing treatment, and offering the human touch that's so important in medical care.</p>

      <p>Privacy and security also remain paramount concerns. As AI systems handle sensitive medical data, robust security measures and compliance with healthcare regulations like HIPAA are essential to maintain patient trust and confidentiality.</p>

      <h2>Conclusion</h2>
      <p>AI is revolutionizing medical diagnosis by making healthcare more accessible, efficient, and accurate. As these technologies continue to advance, we can expect even more sophisticated diagnostic capabilities that will benefit patients and healthcare providers alike. The future of healthcare is here, and it's powered by artificial intelligence.</p>
    `,
    author: 'Dr. Sarah Johnson',
    date: '2024-01-15',
    readTime: '8 min read',
    category: 'AI & Technology',
    image: 'https://readdy.ai/api/search-image?query=AI%20medical%20diagnosis%20technology%2C%20doctor%20using%20artificial%20intelligence%20for%20patient%20care%2C%20futuristic%20medical%20interface%2C%20healthcare%20innovation%2C%20advanced%20medical%20technology%2C%20AI-powered%20healthcare%20systems%2C%20medical%20professional%20with%20digital%20tools&width=800&height=400&seq=blogdetail1&orientation=landscape'
  },
  '2': {
    title: '10 Essential Preventive Care Steps for Better Health in 2024',
    content: `
      <p>Prevention is always better than cure, and in 2024, taking proactive steps to maintain your health is more important than ever. Here are the essential preventive care measures that can help you stay healthy and catch potential health issues early.</p>

      <h2>1. Regular Health Screenings</h2>
      <p>Schedule annual physical exams and follow recommended screening schedules for your age group. This includes blood pressure checks, cholesterol levels, diabetes screening, and cancer screenings like mammograms and colonoscopies.</p>

      <h2>2. Stay Up-to-Date with Vaccinations</h2>
      <p>Ensure you're current with all recommended vaccines, including annual flu shots, COVID-19 boosters, and other vaccines based on your age, health conditions, and travel plans.</p>

      <h2>3. Maintain a Healthy Diet</h2>
      <p>Focus on a balanced diet rich in fruits, vegetables, whole grains, lean proteins, and healthy fats. Limit processed foods, excessive sugar, and saturated fats.</p>

      <h2>4. Exercise Regularly</h2>
      <p>Aim for at least 150 minutes of moderate-intensity aerobic activity or 75 minutes of vigorous-intensity activity per week, plus muscle-strengthening activities on two or more days.</p>

      <h2>5. Prioritize Mental Health</h2>
      <p>Practice stress management techniques, maintain social connections, and don't hesitate to seek professional help when needed. Mental health is just as important as physical health.</p>

      <h2>6. Get Quality Sleep</h2>
      <p>Aim for 7-9 hours of quality sleep each night. Establish a consistent sleep schedule and create a sleep-friendly environment.</p>

      <h2>7. Avoid Harmful Substances</h2>
      <p>Don't smoke, limit alcohol consumption, and avoid recreational drugs. If you currently smoke, seek help to quit as soon as possible.</p>

      <h2>8. Protect Your Skin</h2>
      <p>Use sunscreen with at least SPF 30, wear protective clothing, and perform regular skin self-examinations to check for changes in moles or new growths.</p>

      <h2>9. Practice Good Hygiene</h2>
      <p>Wash your hands frequently, maintain good dental hygiene with regular brushing and flossing, and follow food safety practices.</p>

      <h2>10. Know Your Family History</h2>
      <p>Be aware of your family's medical history and discuss it with your healthcare provider to understand your risk factors for hereditary conditions.</p>

      <h2>Making Prevention a Priority</h2>
      <p>Incorporating these preventive measures into your daily routine can significantly reduce your risk of developing chronic diseases and help you maintain optimal health throughout your life. Remember, small changes can lead to big improvements in your overall well-being.</p>
    `,
    author: 'Dr. Michael Chen',
    date: '2024-01-12',
    readTime: '6 min read',
    category: 'Preventive Care',
    image: 'https://readdy.ai/api/search-image?query=Preventive%20healthcare%20concept%2C%20healthy%20lifestyle%20choices%2C%20medical%20checkup%2C%20wellness%20and%20prevention%2C%20healthy%20living%2C%20doctor%20patient%20consultation%2C%20preventive%20medicine%2C%20health%20screening&width=800&height=400&seq=blogdetail2&orientation=landscape'
  }
};

interface BlogDetailProps {
  blogId: string;
}

export default function BlogDetail({ blogId }: BlogDetailProps) {
  const post = blogPosts[blogId as keyof typeof blogPosts];

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-32 pb-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="ri-file-warning-line text-gray-400 text-3xl"></i>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Article Not Found</h1>
            <p className="text-gray-600 mb-8">The article you're looking for doesn't exist.</p>
            <Link href="/blog" className="bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors cursor-pointer inline-flex items-center">
              <i className="ri-arrow-left-line mr-2"></i>
              Back to Blog
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <article className="pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          {/* Article Header */}
          <div className="mb-8">
            <div className="mb-6">
              <Link href="/blog" className="text-primary-600 hover:text-primary-700 text-sm font-medium cursor-pointer inline-flex items-center transition-colors">
                <i className="ri-arrow-left-line mr-1"></i>
                Back to Blog
              </Link>
            </div>
            
            <div className="mb-6">
              <span className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg shadow-primary-500/20">
                {post.category}
              </span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center">
                  <i className="ri-user-line text-primary-600 text-xl"></i>
                </div>
                <div>
                  <p className="font-bold text-gray-900">{post.author}</p>
                  <p className="text-sm text-gray-600">{post.date}</p>
                </div>
              </div>
              <div className="flex items-center text-gray-600 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                <i className="ri-time-line mr-2 text-primary-500"></i>
                <span className="text-sm font-medium">{post.readTime}</span>
              </div>
            </div>
            
            <div className="rounded-3xl overflow-hidden shadow-2xl mb-12">
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-64 lg:h-[500px] object-cover object-top"
              />
            </div>
          </div>

          {/* Article Content */}
          <div className="glass-panel p-8 lg:p-12 rounded-3xl shadow-xl mb-12">
            <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-primary-600 hover:prose-a:text-primary-700 prose-strong:text-gray-900 prose-ul:list-disc prose-ul:pl-6">
              <div 
                dangerouslySetInnerHTML={{ __html: post.content }}
                className="leading-relaxed"
              />
            </div>
          </div>

          {/* Article Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center space-x-4">
                <span className="text-gray-900 font-medium">Share this article:</span>
                <div className="flex space-x-3">
                  <button className="w-10 h-10 bg-[#1877F2] rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-pointer shadow-lg shadow-blue-500/20">
                    <i className="ri-facebook-fill text-white"></i>
                  </button>
                  <button className="w-10 h-10 bg-[#1DA1F2] rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-pointer shadow-lg shadow-cyan-500/20">
                    <i className="ri-twitter-fill text-white"></i>
                  </button>
                  <button className="w-10 h-10 bg-[#0A66C2] rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-pointer shadow-lg shadow-blue-700/20">
                    <i className="ri-linkedin-fill text-white"></i>
                  </button>
                </div>
              </div>
              <Link href="/blog" className="text-primary-600 hover:text-primary-700 font-medium cursor-pointer inline-flex items-center group">
                Read More Articles 
                <i className="ri-arrow-right-line ml-2 group-hover:translate-x-1 transition-transform"></i>
              </Link>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}
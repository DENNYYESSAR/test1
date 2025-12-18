'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  links?: { label: string; href: string }[];
}

// Knowledge base for quick assist mode
const responses: Record<string, { content: string; links?: { label: string; href: string }[] }> = {
  greeting: {
    content: "Hello! I'm AfyaLynx Assistant. I can help you navigate the website. What would you like to do?",
    links: [
      { label: 'AI Diagnosis', href: '/ai-diagnosis' },
      { label: 'Find Clinics', href: '/find-clinics' },
      { label: 'Dashboard', href: '/dashboard' }
    ]
  },
  symptoms: {
    content: "To check your symptoms, use our AI Diagnosis tool. It will analyze your symptoms and provide health insights.",
    links: [{ label: 'Try AI Diagnosis', href: '/ai-diagnosis' }]
  },
  clinics: {
    content: "Our Clinic Finder helps you locate healthcare facilities near you. You can filter by specialty, distance, and ratings.",
    links: [{ label: 'Find Clinics', href: '/find-clinics' }]
  },
  dashboard: {
    content: "Your Dashboard is your personal health hub. View your diagnosis history, manage appointments, and access your health records.",
    links: [{ label: 'Go to Dashboard', href: '/dashboard' }]
  },
  login: {
    content: "You can log in to access your personalized health dashboard and saved information.",
    links: [{ label: 'Log In', href: '/login' }]
  },
  signup: {
    content: "Create a free AfyaLynx account to save your health records, track diagnoses, and book appointments.",
    links: [{ label: 'Sign Up', href: '/signup' }]
  },
  about: {
    content: "AfyaLynx is an AI-powered healthcare platform that helps you understand your health better.",
    links: [{ label: 'About Us', href: '/about' }]
  },
  contact: {
    content: "Need help? Our support team is here to assist you with any questions.",
    links: [{ label: 'Contact Support', href: '/contact-support' }]
  },
  emergency: {
    content: "🚨 For emergencies, use the red SOS button at the bottom-left of your screen. If this is life-threatening, call emergency services immediately!",
    links: []
  },
  features: {
    content: "AfyaLynx offers:\n• AI Symptom Checker\n• Clinic Finder\n• Health Dashboard\n• Doctor Consultations\n• Emergency SOS\n\nHow can I help you today?",
    links: [
      { label: 'AI Diagnosis', href: '/ai-diagnosis' },
      { label: 'Find Clinics', href: '/find-clinics' }
    ]
  },
  blog: {
    content: "Our blog features health tips, medical news, and wellness articles to help you stay informed.",
    links: [{ label: 'Read Our Blog', href: '/blog' }]
  },
  consultation: {
    content: "You can book video consultations with verified healthcare professionals from your dashboard.",
    links: [{ label: 'Go to Dashboard', href: '/dashboard' }]
  },
  privacy: {
    content: "Your privacy matters to us. Read our privacy policy to understand how we protect your data.",
    links: [{ label: 'Privacy Policy', href: '/privacy-policy' }]
  },
  thanks: {
    content: "You're welcome! Is there anything else I can help you with? 😊",
    links: []
  },
  bye: {
    content: "Goodbye! Take care of your health, and feel free to chat anytime you need assistance. Stay healthy! 💚",
    links: []
  },
  default: {
    content: "I can help you with:\n• Checking symptoms (AI Diagnosis)\n• Finding nearby clinics\n• Accessing your dashboard\n• Account questions\n\nWhat would you like to do?",
    links: [
      { label: 'AI Diagnosis', href: '/ai-diagnosis' },
      { label: 'Find Clinics', href: '/find-clinics' },
      { label: 'Contact Support', href: '/contact-support' }
    ]
  }
};

function getResponse(input: string): { content: string; links?: { label: string; href: string }[] } {
  const lowerInput = input.toLowerCase();
  
  if (/^(hi|hello|hey|good morning|good afternoon|good evening|howdy|hola)/.test(lowerInput)) return responses.greeting;
  if (/thank|thanks|thx|appreciate/.test(lowerInput)) return responses.thanks;
  if (/bye|goodbye|see you|later/.test(lowerInput)) return responses.bye;
  if (/symptom|sick|ill|diagnos|check|health check|feeling|pain|ache/.test(lowerInput)) return responses.symptoms;
  if (/clinic|hospital|near|find|location|nearby/.test(lowerInput)) return responses.clinics;
  if (/dashboard|my account|profile|record|history|appointment/.test(lowerInput)) return responses.dashboard;
  if (/login|sign in|log in/.test(lowerInput)) return responses.login;
  if (/signup|sign up|register|create account|join/.test(lowerInput)) return responses.signup;
  if (/about|who|company|mission|team/.test(lowerInput)) return responses.about;
  if (/contact|support|help|email|phone/.test(lowerInput)) return responses.contact;
  if (/sos|emergency|urgent|911|ambulance/.test(lowerInput)) return responses.emergency;
  if (/what can|feature|service|do you|capabilities|offer/.test(lowerInput)) return responses.features;
  if (/blog|article|news|read|post/.test(lowerInput)) return responses.blog;
  if (/consult|video|call|doctor|telemedicine/.test(lowerInput)) return responses.consultation;
  if (/privacy|data|security/.test(lowerInput)) return responses.privacy;
  
  return responses.default;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "👋 Hi! I'm AfyaLynx Assistant. I can help you navigate the website, answer questions about our services, and guide you to the right features. What would you like to know?",
      links: [
        { label: 'AI Diagnosis', href: '/ai-diagnosis' },
        { label: 'Find Clinics', href: '/find-clinics' },
        { label: 'My Dashboard', href: '/dashboard' }
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageContent = inputValue.trim();
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay for natural feel
    setTimeout(() => {
      const response = getResponse(messageContent);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response.content,
        links: response.links
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 400 + Math.random() * 400);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleLinkClick = (href: string) => {
    router.push(href);
    setIsOpen(false);
  };

  const quickActions = [
    { label: 'Check Symptoms', action: () => handleLinkClick('/ai-diagnosis') },
    { label: 'Find Clinic', action: () => handleLinkClick('/find-clinics') },
    { label: 'My Dashboard', action: () => handleLinkClick('/dashboard') },
  ];

  const suggestedQuestions = [
    "What can AfyaLynx do?",
    "How do I check my symptoms?",
    "Where can I find nearby clinics?",
    "How do I book a consultation?",
  ];

  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question);
    // Auto-send after a brief delay
    setTimeout(() => {
      const input = inputRef.current;
      if (input) {
        input.focus();
      }
    }, 100);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-[9998] w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${
          isOpen 
            ? 'bg-gray-600 hover:bg-gray-700 rotate-0' 
            : 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700'
        }`}
        title={isOpen ? 'Close chat' : 'Chat with AfyaLynx Assistant'}
      >
        {isOpen ? (
          <i className="ri-close-line text-white text-2xl"></i>
        ) : (
          <i className="ri-chat-smile-3-fill text-white text-2xl"></i>
        )}
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-24 right-6 z-[9997] w-[380px] max-w-[calc(100vw-48px)] bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 transform ${
          isOpen 
            ? 'opacity-100 translate-y-0 scale-100' 
            : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-4 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <i className="ri-robot-2-fill text-xl"></i>
            </div>
            <div>
              <h3 className="font-semibold">AfyaLynx Assistant</h3>
              <p className="text-xs text-white/80 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Online • Here to help
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-4 py-3 bg-gray-50 border-b flex gap-2 overflow-x-auto">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-700 hover:bg-primary-50 hover:border-primary-200 hover:text-primary-600 transition-colors whitespace-nowrap"
            >
              {action.label}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="h-[350px] overflow-y-auto p-4 space-y-4 bg-gray-50/50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  message.type === 'user'
                    ? 'bg-primary-500 text-white rounded-br-md'
                    : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-md'
                }`}
              >
                <p className="text-sm whitespace-pre-line">{message.content}</p>
                {message.links && message.links.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.links.map((link, index) => (
                      <button
                        key={index}
                        onClick={() => handleLinkClick(link.href)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                          message.type === 'user'
                            ? 'bg-white/20 text-white hover:bg-white/30'
                            : 'bg-primary-50 text-primary-600 hover:bg-primary-100'
                        }`}
                      >
                        {link.label} →
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {/* Suggested Questions - show only when there's just the initial message */}
          {messages.length === 1 && !isTyping && (
            <div className="mt-4">
              <p className="text-xs text-gray-500 mb-2">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedQuestion(question)}
                    className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs text-gray-600 hover:bg-primary-50 hover:border-primary-200 hover:text-primary-600 transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-800 shadow-sm border border-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                  <span className="text-xs text-gray-400">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything..."
              disabled={isTyping}
              className="flex-1 px-4 py-2.5 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
              className="w-10 h-10 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
            >
              <i className={`ri-send-plane-fill text-white ${isTyping ? 'opacity-50' : ''}`}></i>
            </button>
          </div>
          <p className="text-[10px] text-gray-400 text-center mt-2">
            AfyaLynx Assistant • Not a substitute for medical advice
          </p>
        </div>
      </div>
    </>
  );
}

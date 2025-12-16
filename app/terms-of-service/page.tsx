'use client';

import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
            <p className="text-sm md:text-xl text-gray-600">
              Please read these terms carefully before using our platform.
            </p>
            <p className="text-sm text-gray-500 mt-4">Last updated: January 2024</p>
          </div>

          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <div className="text-gray-700 space-y-4">
                <p>
                  By accessing and using AfyaLynx ("the Platform", "we", "us", or "our"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
                <p>
                  These Terms of Service ("Terms") govern your use of our telemedicine platform, including our AI-powered diagnosis tools, clinic finder, and related services.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
              <div className="text-gray-700 space-y-4">
                <p>AfyaLynx provides the following services:</p>
                
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>AI-Powered Diagnosis:</strong> Preliminary health assessments using advanced AI technology</li>
                  <li><strong>Clinic Finder:</strong> Location-based healthcare provider search and appointment booking</li>
                  <li><strong>Personal Dashboard:</strong> Health record management and tracking</li>
                  <li><strong>Educational Content:</strong> Health and wellness blog articles</li>
                </ul>

                <p className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                  <strong>Important:</strong> Our AI diagnosis tool provides preliminary assessments only and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare professionals for medical decisions.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
              <div className="text-gray-700 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Account Creation</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You must provide accurate, complete, and current information during registration</li>
                  <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                  <li>You must be at least 18 years old to create an account</li>
                  <li>One person may not maintain multiple accounts</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Account Security</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You are responsible for all activities that occur under your account</li>
                  <li>Notify us immediately of any unauthorized use of your account</li>
                  <li>We may suspend or terminate accounts that violate these terms</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Medical Disclaimers</h2>
              <div className="text-gray-700 space-y-4">
                <div className="bg-red-50 p-6 rounded-lg border-l-4 border-red-400">
                  <h3 className="text-lg font-semibold text-red-900 mb-3">Important Medical Disclaimers</h3>
                  
                  <ul className="list-disc pl-6 space-y-2 text-red-800">
                    <li><strong>Not Medical Advice:</strong> Information provided through our platform is for educational purposes only and does not constitute medical advice</li>
                    <li><strong>Emergency Situations:</strong> Do not use our platform for medical emergencies. Call 911 or go to the nearest emergency room</li>
                    <li><strong>AI Limitations:</strong> Our AI diagnosis tool has limitations and may not detect all conditions or provide accurate assessments</li>
                    <li><strong>Professional Consultation:</strong> Always consult with qualified healthcare professionals before making medical decisions</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. User Conduct</h2>
              <div className="text-gray-700 space-y-4">
                <p>You agree not to use the platform to:</p>
                
                <ul className="list-disc pl-6 space-y-2">
                  <li>Violate any applicable laws or regulations</li>
                  <li>Impersonate any person or entity or misrepresent your affiliation</li>
                  <li>Upload, post, or share false, misleading, or fraudulent information</li>
                  <li>Interfere with or disrupt the platform's functionality</li>
                  <li>Attempt to gain unauthorized access to other user accounts</li>
                  <li>Use the platform for any commercial purpose without permission</li>
                  <li>Harass, abuse, or harm other users</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Privacy and Data Protection</h2>
              <div className="text-gray-700 space-y-4">
                <p>
                  Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference.
                </p>
                
                <ul className="list-disc pl-6 space-y-2">
                  <li>We comply with HIPAA regulations for protected health information</li>
                  <li>Your health data is encrypted and securely stored</li>
                  <li>We do not sell your personal information to third parties</li>
                  <li>You have rights regarding your personal data as outlined in our Privacy Policy</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Intellectual Property</h2>
              <div className="text-gray-700 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Our Content</h3>
                <p>
                  All content on the platform, including text, graphics, logos, software, and AI algorithms, is owned by AfyaLynx and protected by intellectual property laws.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">User Content</h3>
                <p>
                  You retain ownership of content you submit but grant us a license to use, modify, and display it as necessary to provide our services.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Payment and Billing</h2>
              <div className="text-gray-700 space-y-4">
                <ul className="list-disc pl-6 space-y-2">
                  <li>Certain features may require payment or subscription</li>
                  <li>All fees are non-refundable unless otherwise stated</li>
                  <li>We may change pricing with advance notice</li>
                  <li>You are responsible for all taxes associated with your use</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitation of Liability</h2>
              <div className="text-gray-700 space-y-4">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="font-semibold mb-2">IMPORTANT LEGAL NOTICE:</p>
                  <p>
                    To the fullest extent permitted by law, AfyaLynx shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or use, arising out of or relating to your use of the platform.
                  </p>
                  <p className="mt-2">
                    Our total liability to you for all claims arising from your use of the platform shall not exceed the amount you paid us in the 12 months preceding the claim.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Termination</h2>
              <div className="text-gray-700 space-y-4">
                <p>
                  Either party may terminate this agreement at any time:
                </p>
                
                <ul className="list-disc pl-6 space-y-2">
                  <li>You may delete your account at any time through your dashboard</li>
                  <li>We may suspend or terminate accounts that violate these terms</li>
                  <li>Upon termination, your right to use the platform ceases immediately</li>
                  <li>We may retain certain information as required by law or for legitimate business purposes</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to Terms</h2>
              <div className="text-gray-700 space-y-4">
                <p>
                  We reserve the right to modify these Terms at any time. We will notify users of material changes through email or platform notifications. Your continued use of the platform after changes constitute acceptance of the updated Terms.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Governing Law</h2>
              <div className="text-gray-700 space-y-4">
                <p>
                  These Terms are governed by the laws of [Your State/Country], without regard to conflict of law principles. Any disputes shall be resolved in the courts of [Your Jurisdiction].
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact Information</h2>
              <div className="text-gray-700 space-y-4">
                <p>
                  If you have questions about these Terms of Service, please contact us:
                </p>
                
                <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="space-y-2">
                    <p><strong>Email:</strong> legal@afyalynx.com</p>
                    <p><strong>Phone:</strong> +1 (555) 123-AFYA</p>
                    <p><strong>Address:</strong> 123 Healthcare Ave, Medical District, City, State 12345</p>
                  </div>
                </div>
              </div>
            </section>

            <div className="bg-blue-600 text-white p-6 rounded-lg text-center">
              <p className="font-semibold mb-2">Thank You for Using AfyaLynx</p>
              <p>By using our platform, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
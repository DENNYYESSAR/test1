'use client';

import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-sm md:text-xl text-gray-600">
              Your privacy is important to us. Learn how we collect, use, and protect your information.
            </p>
            <p className="text-sm text-gray-500 mt-4">Last updated: January 2024</p>
          </div>

          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
              <div className="text-gray-700 space-y-4">
                <p>
                  At AfyaLynx, we collect information to provide better healthcare services and improve user experience. The types of information we collect include:
                </p>
                
                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Personal Information</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Name, email address, phone number, and date of birth</li>
                  <li>Address and emergency contact information</li>
                  <li>Insurance information and payment details</li>
                  <li>Medical history and health records</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Health Information</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Symptoms and health concerns you report</li>
                  <li>AI diagnosis results and recommendations</li>
                  <li>Appointment history and medical records</li>
                  <li>Medications and treatment plans</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Technical Information</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Device information and IP address</li>
                  <li>Browser type and operating system</li>
                  <li>Usage patterns and interaction data</li>
                  <li>Location data (with your permission)</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
              <div className="text-gray-700 space-y-4">
                <p>We use your information for the following purposes:</p>
                
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Healthcare Services:</strong> To provide AI-powered diagnosis, connect you with healthcare providers, and manage your health records</li>
                  <li><strong>Account Management:</strong> To create and maintain your user account and provide customer support</li>
                  <li><strong>Communication:</strong> To send appointment reminders, health updates, and important notifications</li>
                  <li><strong>Platform Improvement:</strong> To analyze usage patterns and improve our AI algorithms and services</li>
                  <li><strong>Legal Compliance:</strong> To comply with healthcare regulations and legal requirements</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Information Sharing and Disclosure</h2>
              <div className="text-gray-700 space-y-4">
                <p>
                  We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
                </p>
                
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Healthcare Providers:</strong> With clinics and doctors you choose to visit for appointment booking and medical care</li>
                  <li><strong>Service Providers:</strong> With trusted third-party service providers who assist in operating our platform</li>
                  <li><strong>Legal Requirements:</strong> When required by law, court order, or legal process</li>
                  <li><strong>Emergency Situations:</strong> To protect your health and safety or that of others</li>
                  <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
              <div className="text-gray-700 space-y-4">
                <p>
                  We implement robust security measures to protect your personal and health information:
                </p>
                
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Encryption:</strong> All data is encrypted in transit and at rest using industry-standard protocols</li>
                  <li><strong>Access Controls:</strong> Strict access controls ensure only authorized personnel can access your information</li>
                  <li><strong>HIPAA Compliance:</strong> We comply with HIPAA regulations for handling protected health information</li>
                  <li><strong>Regular Audits:</strong> We conduct regular security audits and vulnerability assessments</li>
                  <li><strong>Secure Infrastructure:</strong> Our systems are hosted on secure, compliant cloud infrastructure</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights and Choices</h2>
              <div className="text-gray-700 space-y-4">
                <p>You have the following rights regarding your personal information:</p>
                
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Access:</strong> Request access to your personal information we hold</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal requirements)</li>
                  <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
                  <li><strong>Opt-out:</strong> Opt out of marketing communications at any time</li>
                </ul>
                
                <p className="mt-4">
                  To exercise these rights, please contact us at privacy@afyalynx.com or use the settings in your account dashboard.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies and Tracking</h2>
              <div className="text-gray-700 space-y-4">
                <p>
                  We use cookies and similar technologies to enhance your experience on our platform:
                </p>
                
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Essential Cookies:</strong> Required for basic platform functionality</li>
                  <li><strong>Analytics Cookies:</strong> Help us understand how you use our platform</li>
                  <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                </ul>
                
                <p>
                  You can control cookie settings through your browser preferences, though disabling certain cookies may affect platform functionality.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Retention</h2>
              <div className="text-gray-700 space-y-4">
                <p>
                  We retain your information for as long as necessary to provide our services and comply with legal obligations:
                </p>
                
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Account Information:</strong> Retained while your account is active and for a reasonable period after deactivation</li>
                  <li><strong>Health Records:</strong> Retained according to healthcare record retention requirements</li>
                  <li><strong>Legal Requirements:</strong> Some information may be retained longer to comply with legal obligations</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">International Data Transfers</h2>
              <div className="text-gray-700 space-y-4">
                <p>
                  Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place to protect your information during such transfers.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Policy</h2>
              <div className="text-gray-700 space-y-4">
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on our website and updating the "Last updated" date. Your continued use of our services after such changes constitutes acceptance of the updated policy.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
              <div className="text-gray-700 space-y-4">
                <p>
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                
                <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="space-y-2">
                    <p><strong>Email:</strong> privacy@afyalynx.com</p>
                    <p><strong>Phone:</strong> +1 (555) 123-AFYA</p>
                    <p><strong>Address:</strong> 123 Healthcare Ave, Medical District, City, State 12345</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
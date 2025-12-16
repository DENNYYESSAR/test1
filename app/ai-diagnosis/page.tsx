'use client';

import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Dropdown from '../../components/Dropdown';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { analyzeSymptoms } from '../actions/diagnosis';
import { saveDiagnosis } from '../actions/history';
import { useAuth } from '@/context/AuthContext';

interface Diagnosis {
  condition: string;
  confidence: number;
  description: string;
  severity: string;
  recommendations: string[];
  specialists: string[];
  nextSteps: string;
}

export default function AIDiagnosis() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Removed automatic redirect to allow for a teaser view
  // useEffect(() => {
  //   if (!loading && !user) {
  //     router.push('/login');
  //   }
  // }, [user, loading, router]);

  const [symptoms, setSymptoms] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say'];

  const handleSave = async () => {
    if (!diagnosis || saveSuccess) return;
    setSaving(true);
    setError(null);
    try {
      if (!user) {
        throw new Error('You must be logged in to save results.');
      }

      const idToken = await user.getIdToken();

      // We need to pass symptoms state as well
      const diagnosisData = { ...diagnosis, symptoms };

      await saveDiagnosis(diagnosisData, idToken);

      setSaveSuccess(true);
    } catch (err: any) {
      console.error('Failed to save diagnosis:', err);
      setError(err.message || 'Failed to save diagnosis');
    } finally {
      setSaving(false);
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setError(null);
    setDiagnosis(null);
    setSaveSuccess(false);

    try {
      const result = await analyzeSymptoms({ symptoms, age, gender });
      setDiagnosis(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during analysis. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen selection:bg-primary-100 selection:text-primary-900">
        <Header />
        <div className="relative min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8 lg:pt-24 lg:pb-16">
          {/* Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
            <div className="absolute top-[-10%] right-[-5%] w-[300px] h-[300px] lg:w-[500px] lg:h-[500px] rounded-full bg-blue-400/10 blur-[60px] lg:blur-[100px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[350px] h-[350px] lg:w-[600px] lg:h-[600px] rounded-full bg-indigo-400/10 blur-[60px] lg:blur-[100px]" />
          </div>

          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center px-3 py-1.5 lg:px-4 lg:py-2 bg-blue-50 rounded-full text-blue-700 text-xs lg:text-sm font-medium mb-6 border border-blue-100">
              <i className="ri-magic-line mr-2"></i>
              AI-Powered Analysis
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
              Intelligent Health Diagnosis
            </h1>
            <p className="text-sm md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-10 lg:mb-12">
              Describe your symptoms and get instant insights powered by advanced AI technology. Our system analyzes your inputs against a vast medical database to provide preliminary assessments.
            </p>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-16 lg:mb-20 text-left">
              <div className="bg-white/80 backdrop-blur-sm p-6 lg:p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-4 lg:mb-6">
                  <i className="ri-brain-line text-2xl lg:text-3xl"></i>
                </div>
                <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-2 lg:mb-3">AI-Aided Diagnostics</h3>
                <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
                  Our advanced AI algorithms analyze your symptoms against a vast database of medical conditions. This helps in identifying potential health issues early, providing a preliminary assessment that can guide your next steps.
                </p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-6 lg:p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-4 lg:mb-6">
                  <i className="ri-speed-line text-2xl lg:text-3xl"></i>
                </div>
                <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-2 lg:mb-3">Speed & Efficiency</h3>
                <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
                  Get instant feedback on your health concerns without the wait. AI diagnostics can quickly process complex symptom patterns, offering immediate insights that might otherwise take time to determine.
                </p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-6 lg:p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mb-4 lg:mb-6">
                  <i className="ri-shield-check-line text-2xl lg:text-3xl"></i>
                </div>
                <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-2 lg:mb-3">Enhanced Accuracy</h3>
                <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
                  By cross-referencing your symptoms with millions of medical cases, our AI reduces the risk of oversight. It serves as a powerful tool to support doctors in making more accurate and timely diagnoses.
                </p>
              </div>
            </div>

            {/* How It Works */}
            <div className="mb-20">
              <h2 className="text-3xl font-bold text-gray-900 mb-12">How It Works</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="relative p-6">
                  <div className="text-6xl font-bold text-blue-100 absolute top-0 left-0 -z-10">01</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 mt-4">Describe Symptoms</h3>
                  <p className="text-gray-600">Enter your symptoms in plain English. Be as detailed as possible about what you&apos;re feeling.</p>
                </div>
                <div className="relative p-6">
                  <div className="text-6xl font-bold text-blue-100 absolute top-0 left-0 -z-10">02</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 mt-4">AI Analysis</h3>
                  <p className="text-gray-600">Our AI compares your symptoms against thousands of medical conditions to find matches.</p>
                </div>
                <div className="relative p-6">
                  <div className="text-6xl font-bold text-blue-100 absolute top-0 left-0 -z-10">03</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 mt-4">Get Results</h3>
                  <p className="text-gray-600">Receive a detailed report with potential conditions, severity levels, and recommended next steps.</p>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 mb-16 text-left flex items-start gap-4">
              <i className="ri-alert-line text-2xl text-amber-600 mt-1"></i>
              <div>
                <h4 className="font-bold text-amber-900 mb-2">Medical Disclaimer</h4>
                <p className="text-amber-800 text-sm leading-relaxed">
                  This tool is for informational purposes only and does not constitute medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. If you think you may have a medical emergency, call your doctor or emergency services immediately.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 md:p-12 shadow-xl border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-full -z-10 opacity-50"></div>
              
              <div className="relative z-10">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">Ready to check your symptoms?</h2>
                <p className="text-sm md:text-lg text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto">
                  Join thousands of users who trust AfyaLynx for their preliminary health assessments. It&apos;s fast, free, and easy to use.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
                  <Link 
                    href="/signup" 
                    className="w-full sm:w-auto px-6 py-3 md:px-8 md:py-4 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20 flex items-center justify-center text-base md:text-lg"
                  >
                    <i className="ri-user-add-line mr-2"></i>
                    Get Started Now
                  </Link>
                  <Link 
                    href="/login" 
                    className="w-full sm:w-auto px-6 py-3 md:px-8 md:py-4 bg-gray-50 text-gray-700 border border-gray-200 rounded-xl font-bold hover:bg-gray-100 transition-all flex items-center justify-center text-base md:text-lg"
                  >
                    <i className="ri-login-circle-line mr-2"></i>
                    Login to Account
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans selection:bg-primary-100 selection:text-primary-900">
      <Header />

      <div className="relative min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-blue-400/10 blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-400/10 blur-[100px]" />
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full text-blue-700 text-sm font-medium mb-6 border border-blue-100">
              <i className="ri-magic-line mr-2"></i>
              AI-Powered Analysis
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-6 tracking-tight">Intelligent Health Diagnosis</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Describe your symptoms and get instant insights powered by advanced AI technology
            </p>
          </div>

          {/* Disclaimer */}
          <div className="glass-panel p-6 rounded-2xl mb-8 border-l-4 border-l-blue-500 flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 text-blue-600">
              <i className="ri-shield-check-line text-xl"></i>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Medical Disclaimer</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                This AI diagnosis tool provides preliminary insights for informational purposes only.
                Always consult with qualified healthcare providers for accurate diagnosis and treatment.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Section */}
            <div className="lg:col-span-1 space-y-6">
              <div className="glass-panel p-6 rounded-2xl shadow-lg relative z-20">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <i className="ri-user-settings-line text-blue-500"></i>
                  Patient Details
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '') {
                          setAge('');
                          return;
                        }
                        const num = parseInt(val);
                        if (!isNaN(num) && num >= 0 && num <= 150) {
                          setAge(val);
                        }
                      }}
                      min="0"
                      max="150"
                      placeholder="e.g. 25"
                      className="block w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <Dropdown
                      options={genderOptions}
                      value={gender}
                      onChange={setGender}
                      placeholder="Select gender"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="glass-panel p-6 rounded-2xl shadow-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white border-none">
                <h3 className="font-bold text-lg mb-2">Need Help?</h3>
                <p className="text-white/80 text-sm mb-4">
                  Try to be as specific as possible with your symptoms for better accuracy.
                </p>
                <ul className="text-sm space-y-2 text-white/90">
                  <li className="flex items-center gap-2">
                    <i className="ri-check-line"></i> Mention duration
                  </li>
                  <li className="flex items-center gap-2">
                    <i className="ri-check-line"></i> Note severity (1-100)
                  </li>
                  <li className="flex items-center gap-2">
                    <i className="ri-check-line"></i> List triggers
                  </li>
                </ul>
              </div>
            </div>

            {/* Main Analysis Section */}
            <div className="lg:col-span-2">
              <div className="glass-panel p-8 rounded-3xl shadow-xl h-full flex flex-col">
                <label className="block text-lg font-bold text-gray-900 mb-4">
                  Describe your symptoms
                </label>
                <textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="e.g., I have been experiencing a severe headache on the left side of my head for 2 days, accompanied by sensitivity to light..."
                  className="flex-1 w-full p-6 bg-white/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none resize-none text-gray-700 placeholder-gray-400 min-h-[200px] text-lg leading-relaxed"
                />
                
                <div className="mt-6 flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    {symptoms.length} characters
                  </p>
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !symptoms || !age || !gender}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-8 rounded-xl font-semibold shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
                  >
                    {isAnalyzing ? (
                      <>
                        <i className="ri-loader-4-line animate-spin text-xl"></i>
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <i className="ri-magic-line text-xl"></i>
                        <span>Analyze Symptoms</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-8 bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl flex items-center gap-3 animate-fade-in">
              <i className="ri-error-warning-fill text-xl"></i>
              <p>{error}</p>
            </div>
          )}

          {diagnosis && (
            <div className="mt-12 animate-fade-in-up">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Analysis Results</h2>
                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    disabled={saving || saveSuccess}
                    className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
                      saveSuccess
                        ? 'bg-green-100 text-green-700 cursor-default'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                    } ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {saveSuccess ? (
                      <>
                        <i className="ri-check-line"></i> Saved
                      </>
                    ) : (
                      <>
                        {saving ? (
                          <i className="ri-loader-4-line animate-spin"></i>
                        ) : (
                          <i className="ri-save-line"></i>
                        )}
                        {saving ? 'Saving...' : 'Save Result'}
                      </>
                    )}
                  </button>
                  <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all flex items-center gap-2">
                    <i className="ri-share-forward-line"></i> Share
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-blue-500">
                  <p className="text-sm text-gray-500 mb-1">Potential Condition</p>
                  <h3 className="text-xl font-bold text-gray-900">{diagnosis.condition}</h3>
                </div>
                <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-indigo-500">
                  <p className="text-sm text-gray-500 mb-1">Confidence Score</p>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-gray-900">{diagnosis.confidence}%</h3>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500 rounded-full"
                        style={{ width: `${diagnosis.confidence}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-red-500">
                  <p className="text-sm text-gray-500 mb-1">Severity Level</p>
                  <h3 className="text-xl font-bold text-gray-900">{diagnosis.severity}</h3>
                </div>
              </div>

              <div className="glass-panel p-8 rounded-3xl shadow-xl space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <i className="ri-file-list-3-line text-blue-500"></i>
                    Description
                  </h3>
                  <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                    {diagnosis.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <i className="ri-stethoscope-line text-green-500"></i>
                      Recommended Actions
                    </h3>
                    <ul className="space-y-3">
                      {diagnosis.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-3 bg-green-50/50 p-3 rounded-xl border border-green-100">
                          <i className="ri-check-double-line text-green-600 mt-0.5"></i>
                          <span className="text-gray-700 text-sm">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <i className="ri-hospital-line text-purple-500"></i>
                      Suggested Specialists
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {diagnosis.specialists.map((spec, index) => (
                        <span key={index} className="px-4 py-2 bg-purple-50 text-purple-700 rounded-xl text-sm font-medium border border-purple-100 flex items-center gap-2">
                          <i className="ri-user-star-line"></i>
                          {spec}
                        </span>
                      ))}
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="text-sm font-bold text-gray-900 mb-2">Next Steps</h4>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                        {diagnosis.nextSteps}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex justify-end gap-4">
                  <button
                    onClick={() => {
                      setDiagnosis(null);
                      setSymptoms('');
                      setAge('');
                      setGender('');
                      setError(null);
                      setSaveSuccess(false);
                    }}
                    className="px-6 py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold transition-all"
                  >
                    New Analysis
                  </button>
                  <Link 
                    href="/find-clinics" 
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-6 rounded-xl font-semibold shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
                  >
                    <span>Find Nearby Specialists</span>
                    <i className="ri-arrow-right-line"></i>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

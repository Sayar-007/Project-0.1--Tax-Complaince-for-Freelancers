"use client";

import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { StepIndicator } from '@/components/ui/StepIndicator';
import { CriticalAlertBanner } from '@/components/CriticalAlertBanner';
import CompliancePlanView from '@/components/CompliancePlanView';
import { QuestionnaireState, validateQuestionnaire } from '@/lib/questionnaireSchema';
import { useSession } from 'next-auth/react'; // Import useSession
import { useRouter } from 'next/navigation'; // Import useRouter

// Initial empty state
const INITIAL_STATE: QuestionnaireState = {
  entity_type: 'sole_prop',
  profession_nature: 'specified',
  annual_turnover: 'under_20l',
  client_countries: [],
  payment_modes: [],
  gst_status: 'no',
  lut_status: undefined,
};

// Question Configuration
const QUESTIONS = [
  {
    id: 'entity_type',
    question: "Are you operating as a Sole Proprietor (Individual) or a Private Limited Company?",
    options: [
      { value: "sole_prop", label: "Sole Proprietor / Individual Freelancer" },
      { value: "pvt_ltd", label: "Private Limited Company" }
    ],
    context: "Most freelancers are Sole Props. Pvt Ltd triggers heavy compliance (Audits, MCA filing requirements)"
  },
  {
    id: 'profession_nature',
    question: "What best describes your work?",
    options: [
      { value: "specified", label: "Specified Profession (Coding, Design, Consulting, Legal, Accounting)" },
      { value: "business", label: "Business/Trading (Dropshipping, Selling Goods, YouTube Revenue)" }
    ],
    context: "Determines Section 44ADA (50% presumptive profit) vs 44AD (6%/8% profit)"
  },
  {
    id: 'annual_turnover',
    question: "What is your expected total receipts for this Financial Year (Apr-Mar)?",
    options: [
      { value: "under_20l", label: "Less than ₹20 Lakhs" },
      { value: "20l_to_75l", label: "₹20 Lakhs to ₹75 Lakhs" },
      { value: "above_75l", label: "Above ₹75 Lakhs" }
    ],
    context: "Critical for GST (₹20L threshold) and Tax Audit (₹75L for professionals)"
  },
  {
    id: 'client_countries',
    question: "Where are your clients located? (Select all that apply)",
    multi: true,
    options: [
      { value: "usa", label: "USA" },
      { value: "uk", label: "United Kingdom" },
      { value: "uae", label: "UAE" },
      { value: "europe", label: "Europe (EU countries)" },
      { value: "india", label: "India (Domestic clients)" }
    ],
    context: "Determines DTAA forms, mixed income scenarios, and GST complexity"
  },
  {
    id: 'payment_modes',
    question: "How do you receive payments? (Select all that apply)",
    multi: true,
    options: [
      { value: "bank_wire", label: "Direct Bank Wire Transfer (SWIFT)" },
      { value: "paypal", label: "PayPal" },
      { value: "wise", label: "Wise (formerly TransferWise)" },
      { value: "payoneer", label: "Payoneer" },
      { value: "crypto", label: "Cryptocurrency (USDT, BTC, etc.)" }
    ],
    context: "Determines forex documentation requirements and crypto tax implications"
  },
  {
    id: 'gst_status',
    question: "Do you currently have a GST Registration Number?",
    options: [
      { value: "yes", label: "Yes, I have a GSTIN" },
      { value: "no", label: "No, I am not registered" }
    ],
    context: "If turnover > ₹20L and answer is 'No', triggers CRITICAL ALERT"
  },
  {
    id: 'lut_status',
    question: "Did you file the Letter of Undertaking (LUT) for the current Financial Year?",
    showIf: (state: QuestionnaireState) => state.gst_status === 'yes',
    options: [
      { value: "yes", label: "Yes, LUT is filed (Form GST RFD-11)" },
      { value: "no", label: "No, not filed yet" },
      { value: "not_sure", label: "I don't know what LUT is" }
    ],
    context: "LUT allows export of services without paying 18% IGST."
  }
];

export default function QuestionnairePage() {
  const { data: session, status } = useSession(); // Get session data
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // State
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<QuestionnaireState>(INITIAL_STATE);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<{severity: 'critical'|'high'|'medium', message: string}[]>([]);

  // Load from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('compliance_alpha_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Basic merging or validation could go here
        setFormData(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error("Failed to load saved state", e);
      }
    }
  }, []);

  // Save to LocalStorage on change
  useEffect(() => {
    localStorage.setItem('compliance_alpha_state', JSON.stringify(formData));
  }, [formData]);

  // Real-time Logic Checks for Alerts
  useEffect(() => {
    const newAlerts: {severity: 'critical'|'high'|'medium', message: string}[] = [];

    // Logic: Turnover > 20L and No GST
    if (formData.annual_turnover !== 'under_20l' && formData.gst_status === 'no') {
      newAlerts.push({
        severity: 'critical',
        message: "URGENT: You are likely required to register for GST immediately as your turnover exceeds ₹20 Lakhs."
      });
    }

    // Logic: GST Yes but LUT No/Unsure
    if (formData.gst_status === 'yes' && (formData.lut_status === 'no' || formData.lut_status === 'not_sure')) {
      newAlerts.push({
        severity: 'critical',
        message: "CRITICAL: Without LUT, you're liable for 18% IGST on all export income. File Form GST RFD-11 immediately!"
      });
    }

    setAlerts(newAlerts);
  }, [formData]);

  // Loading Text Logic
  const [loadingText, setLoadingText] = useState("Analyzing tax residency...");
  
  useEffect(() => {
    if (!isGenerating) return;
    
    const messages = [
      "Analyzing tax residency...",
      "Checking DTAA rules...",
      "Calculating tax liability...",
      "Finalizing report..."
    ];
    
    let i = 0;
    setLoadingText(messages[0]);

    const interval = setInterval(() => {
      i = (i + 1) % messages.length;
      setLoadingText(messages[i]);
    }, 3000);

    return () => clearInterval(interval);
  }, [isGenerating]);


  // Handlers
  const handleOptionSelect = (field: keyof QuestionnaireState, value: any, isMulti: boolean = false) => {
    setFormData(prev => {
      if (isMulti) {
        const currentArray = prev[field] as string[];
        if (currentArray.includes(value)) {
          return { ...prev, [field]: currentArray.filter(item => item !== value) };
        } else {
          return { ...prev, [field]: [...currentArray, value] };
        }
      } else {
        return { ...prev, [field]: value };
      }
    });
  };

  const isStepValid = () => {
    const questionIndex = currentStep - 1;
    const question = QUESTIONS[questionIndex];
    
    // If question is skipped (hidden), it's valid
    if (question.showIf && !question.showIf(formData)) return true;

    const value = formData[question.id as keyof QuestionnaireState];
    
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return !!value;
  };

  const handleNext = () => {
    let nextStep = currentStep + 1;

    // Find the next valid step (skip hidden questions)
    while (nextStep <= QUESTIONS.length) {
      const nextQ = QUESTIONS[nextStep - 1];
      if (!nextQ.showIf || nextQ.showIf(formData)) {
        break;
      }
      nextStep++;
    }

    // If we've gone past the last question, generate the plan
    if (nextStep > QUESTIONS.length) {
      generatePlan();
    } else {
      setCurrentStep(nextStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      let prevStep = currentStep - 1;
      while (prevStep > 0) {
        const prevQ = QUESTIONS[prevStep - 1];
        if (!prevQ.showIf || prevQ.showIf(formData)) {
          break;
        }
        prevStep--;
      }
      setCurrentStep(prevStep);
    }
  };

  const generatePlan = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate plan');
      }

      setGeneratedPlan(data.plan);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  // Render
  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="ml-2 text-gray-600">Loading session...</p>
      </div>
    );
  }

  if (generatedPlan) {
    return <CompliancePlanView plan={generatedPlan} userDetails={formData} />;
  }

  const currentQuestion = QUESTIONS[currentStep - 1];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Alerts */}
      {alerts.map((alert, idx) => (
        <CriticalAlertBanner key={idx} severity={alert.severity} message={alert.message} />
      ))}

      <div className="max-w-3xl mx-auto">
        <StepIndicator currentStep={currentStep} totalSteps={QUESTIONS.length} />

        <div className="bg-white shadow-lg rounded-2xl p-6 md:p-10 mt-8 transition-all duration-300 min-h-[400px] flex flex-col justify-center">
          
          {isGenerating ? (
             <div className="flex flex-col items-center justify-center py-8 space-y-6">
               <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
               <p className="text-xl font-semibold text-slate-700 animate-pulse text-center">
                 {loadingText}
               </p>
               <p className="text-slate-400 text-sm text-center max-w-md">
                 This uses advanced AI to analyze your specific situation. It typically takes about 15-20 seconds. Please do not close this tab.
               </p>
             </div>
          ) : (
            <>
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {currentQuestion.question}
                </h1>
                <p className="text-slate-500 text-sm md:text-base bg-slate-50 p-3 rounded-lg border border-slate-100 inline-block">
                  💡 {currentQuestion.context}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option) => {
                  const fieldVal = formData[currentQuestion.id as keyof QuestionnaireState];
                  const isSelected = Array.isArray(fieldVal) 
                    ? (fieldVal as string[]).includes(option.value)
                    : fieldVal === option.value;

                  return (
                    <button
                      key={option.value}
                      onClick={() => handleOptionSelect(currentQuestion.id as keyof QuestionnaireState, option.value, currentQuestion.multi)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group
                        ${isSelected 
                          ? 'border-blue-600 bg-blue-50 shadow-sm' 
                          : 'border-gray-200 hover:border-blue-300 hover:bg-slate-50'
                        }`}
                    >
                      <span className={`font-medium text-lg flex-1 mr-4 ${isSelected ? 'text-blue-900' : 'text-gray-700'}`}>
                        {option.label}
                      </span>
                      <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center
                        ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-300 group-hover:border-blue-400'}`}>
                        {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Error Message */}
              {error && (
                <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  {error}
                </div>
              )}

              {/* Navigation */}
              <div className="mt-10 flex justify-between items-center">
                <button
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2 px-6 py-3 text-gray-500 font-medium hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>

                <button
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg shadow-blue-200 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed transition-all transform active:scale-95"
                >
                  {currentStep === QUESTIONS.length ? (
                    <>Generate My Plan <ArrowRight className="w-5 h-5" /></>
                  ) : (
                    <>Next <ArrowRight className="w-5 h-5" /></>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
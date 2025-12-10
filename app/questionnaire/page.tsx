"use client";

import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Loader2, AlertCircle, Upload, Star } from 'lucide-react';
import { StepIndicator } from '@/components/ui/StepIndicator';
import { CriticalAlertBanner } from '@/components/CriticalAlertBanner';
import CompliancePlanView from '@/components/CompliancePlanView';
import { QuestionnaireState } from '@/lib/questionnaireSchema';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// Define the Question interface for better typing
type QuestionType = 'options' | 'text' | 'textarea' | 'rating' | 'file';

interface QuestionOption {
  value: string;
  label: string;
}

interface Question {
  id: keyof QuestionnaireState;
  question: string;
  type: QuestionType;
  options?: QuestionOption[]; // For 'options' type
  multi?: boolean; // For 'options' type
  context?: string;
  showIf?: (state: Partial<QuestionnaireState>) => boolean;
  placeholder?: string; // For text/textarea
}

// Initial empty state (using Partial to allow empty initial values)
const INITIAL_STATE: Partial<QuestionnaireState> = {
  client_location: [],
  payment_methods: [],
  expense_records: 3, // Default middle value
};

// Question Configuration
const QUESTIONS: Question[] = [
  {
    id: 'revenue',
    question: "Estimated Total Revenue (Apr 2025 - Mar 2026)",
    type: 'options',
    options: [
      { value: "less_than_20l", label: "< ₹20 Lakhs" },
      { value: "20l_to_50l", label: "₹20 Lakhs - ₹50 Lakhs" },
      { value: "50l_to_75l", label: "₹50 Lakhs - ₹75 Lakhs" },
      { value: "above_75l", label: "> ₹75 Lakhs" }
    ],
    context: "This determines your GST liability and potential audit requirements."
  },
  {
    id: 'client_location',
    question: "Client Location (Select all regions where your clients are located)",
    type: 'options',
    multi: true,
    options: [
      { value: "india", label: "India (Domestic)" },
      { value: "usa", label: "USA" },
      { value: "uk_europe", label: "UK / Europe" },
      { value: "uae_middle_east", label: "UAE / Middle East" },
      { value: "other", label: "Other" }
    ],
    context: "Different regions have specific DTAA (Double Taxation Avoidance Agreement) rules."
  },
  {
    id: 'payment_methods',
    question: "How do you primarily receive payments from international clients?",
    type: 'options',
    multi: true,
    options: [
      { value: "paypal_stripe", label: "Paypal / Stripe" },
      { value: "wise_payoneer", label: "Wise / Payoneer" },
      { value: "swift", label: "Direct Swift Transfer to Bank" },
      { value: "crypto", label: "Crypto" }
    ],
    context: "Affects FIRC (Foreign Inward Remittance Certificate) and compliance tracking."
  },
  {
    id: 'gst_number',
    question: "Do you currently have a Goods and Services Tax (GST) Number?",
    type: 'options',
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" }
    ],
    context: "GST is mandatory if turnover > ₹20 Lakhs (or > ₹10L in some states) or for export of services."
  },
  {
    id: 'lut_filed',
    question: "If you have a GST number, have you filed a Letter of Undertaking (LUT) for the current financial year?",
    type: 'options',
    showIf: (state) => state.gst_number === 'yes',
    options: [
      { value: "yes", label: "Yes" },
      { value: "no_dont_know", label: "No / I don't know what that is" }
    ],
    context: "LUT allows you to export services without paying IGST upfront."
  },
  {
    id: 'tax_forms',
    question: "Have your US/International clients asked you to sign any tax forms (e.g., W-8BEN)?",
    type: 'options',
    options: [
      { value: "signed", label: "Yes, I signed them." },
      { value: "ignored", label: "Yes, but I ignored them." },
      { value: "no", label: "No." }
    ],
    context: "W-8BEN is crucial for avoiding withholding tax in the US."
  },
  {
    id: 'profession',
    question: "What is your main profession?",
    type: 'text',
    placeholder: "e.g., Software Developer, Graphic Designer, Consultant...",
    context: "Helps in identifying the correct Presumptive Taxation code (44ADA)."
  },
  {
    id: 'capital_expenditure',
    question: "Do you have any significant capital expenditure planned or incurred this year (e.g., Laptop, high-end software license)?",
    type: 'options',
    options: [
      { value: "above_50k", label: "Yes, above ₹50,000" },
      { value: "below_50k", label: "Yes, but minor (below ₹50,000)" },
      { value: "no", label: "No" }
    ],
    context: "Capital assets can be depreciated to reduce taxable income."
  },
  {
    id: 'expense_records',
    question: "How would you rate the quality and organization of your expense records (invoices, bills, etc.)?",
    type: 'rating',
    context: "Good record keeping is essential for tax audits and claiming expenses."
  },
  {
    id: 'investments',
    question: "Do you make any qualified investments for tax saving purposes (e.g., LIC, PPF, ELSS, NPS)?",
    type: 'options',
    options: [
      { value: "regular", label: "Yes, I invest regularly (Section 80C, 80CCD)" },
      { value: "small", label: "Yes, but only small amounts" },
      { value: "no", label: "No" }
    ],
    context: "Investments under 80C can save up to ₹46,800 in taxes."
  },
  {
    id: 'entity_type',
    question: "What is your entity type?",
    type: 'options',
    options: [
      { value: "proprietorship", label: "Individual / Proprietorship" },
      { value: "partnership", label: "Partnership Firm" },
      { value: "pvt_ltd", label: "Private Limited Company" },
      { value: "llp", label: "LLP" }
    ],
    context: "Sole Proprietorship is most common for freelancers."
  },
  {
    id: 'hire_freelancers',
    question: "Do you hire freelancers, agencies, or interns to help you?",
    type: 'options',
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" }
    ],
    context: "Payments to residents may require TDS deduction."
  },
  {
    id: 'pay_above_30k',
    question: "Do you pay anyone else > ₹30k/year?",
    type: 'options',
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" }
    ],
    context: "Threshold for TDS deduction under certain sections."
  },
  {
    id: 'documents',
    question: "Any other documents you received from your client?",
    type: 'file',
    context: "Upload up to 5 supported files. Max 100 MB per file."
  },
  {
    id: 'other_info',
    question: "Any other information regarding your taxes that you want to share.",
    type: 'textarea',
    placeholder: "Any specific concerns or details...",
    context: "Provide any additional context here."
  }
];

export default function QuestionnairePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // State
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<QuestionnaireState>>(INITIAL_STATE);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<{severity: 'critical'|'high'|'medium', message: string}[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('compliance_alpha_state_v2'); // Changed key to avoid conflict with old schema
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error("Failed to load saved state", e);
      }
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('compliance_alpha_state_v2', JSON.stringify(formData));
  }, [formData]);

  // Real-time Alerts
  useEffect(() => {
    const newAlerts: {severity: 'critical'|'high'|'medium', message: string}[] = [];

    // GST Threshold Alert
    if ((formData.revenue === '20l_to_50l' || formData.revenue === '50l_to_75l' || formData.revenue === 'above_75l') && formData.gst_number === 'no') {
      newAlerts.push({
        severity: 'critical',
        message: "URGENT: Your turnover exceeds ₹20 Lakhs. You are likely required to register for GST immediately."
      });
    }

    // LUT Alert
    if (formData.gst_number === 'yes' && formData.lut_filed === 'no_dont_know') {
      newAlerts.push({
        severity: 'critical',
        message: "CRITICAL: Without an LUT, you may be liable to pay 18% IGST on exports. File Form GST RFD-11 immediately."
      });
    }

    setAlerts(newAlerts);
  }, [formData]);

  // Loading Animation Text
  const [loadingText, setLoadingText] = useState("Analyzing tax profile...");
  useEffect(() => {
    if (!isGenerating) return;
    const messages = [
      "Analyzing tax residency...",
      "Checking GST compliance...",
      "Evaluating deductions...",
      "Generating personalized plan..."
    ];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % messages.length;
      setLoadingText(messages[i]);
    }, 3000);
    return () => clearInterval(interval);
  }, [isGenerating]);


  const handleValueChange = (field: keyof QuestionnaireState, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMultiSelect = (field: keyof QuestionnaireState, value: string) => {
    setFormData(prev => {
      const current = (prev[field] as string[]) || [];
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter(item => item !== value) };
      } else {
        return { ...prev, [field]: [...current, value] };
      }
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
      // We don't store files in formData for JSON submission, but we acknowledge them
      handleValueChange('documents', true); // Just a flag
    }
  };

  const isStepValid = () => {
    const q = QUESTIONS[currentStep - 1];
    if (q.showIf && !q.showIf(formData)) return true;

    const val = formData[q.id];

    if (q.type === 'file') return true; // Optional
    if (q.type === 'textarea') return true; // Optional usually, or check if specific field required
    if (q.id === 'other_info') return true; // Explicitly optional

    if (q.multi) {
      return Array.isArray(val) && val.length > 0;
    }
    
    if (q.type === 'text') {
      return typeof val === 'string' && val.trim().length > 0;
    }

    return val !== undefined && val !== null && val !== '';
  };

  const handleNext = () => {
    let nextStep = currentStep + 1;
    while (nextStep <= QUESTIONS.length) {
      const nextQ = QUESTIONS[nextStep - 1];
      if (!nextQ.showIf || nextQ.showIf(formData)) break;
      nextStep++;
    }

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
        if (!prevQ.showIf || prevQ.showIf(formData)) break;
        prevStep--;
      }
      setCurrentStep(prevStep);
    }
  };

  const generatePlan = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      // Filter out 'documents' if it causes issues, or send it as is (it's boolean true/false or undefined in formData)
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

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (generatedPlan) {
    return <CompliancePlanView plan={generatedPlan} userDetails={formData as any} />;
  }

  const currentQ = QUESTIONS[currentStep - 1];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      {alerts.map((alert, idx) => (
        <CriticalAlertBanner key={idx} severity={alert.severity} message={alert.message} />
      ))}

      <div className="max-w-3xl mx-auto">
        <StepIndicator currentStep={currentStep} totalSteps={QUESTIONS.length} />

        <div className="bg-white shadow-lg rounded-2xl p-6 md:p-10 mt-8 min-h-[400px] flex flex-col justify-center">
          {isGenerating ? (
             <div className="flex flex-col items-center justify-center py-8 space-y-6">
               <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
               <p className="text-xl font-semibold text-slate-700 animate-pulse text-center">
                 {loadingText}
               </p>
             </div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {currentQ.question}
                </h1>
                {currentQ.context && (
                  <p className="text-slate-500 text-sm md:text-base bg-slate-50 p-3 rounded-lg border border-slate-100 inline-block">
                    💡 {currentQ.context}
                  </p>
                )}
              </div>

              <div className="space-y-4">
                {/* Options (Single/Multi) */}
                {currentQ.type === 'options' && currentQ.options?.map((opt) => {
                   const val = formData[currentQ.id];
                   const isSelected = currentQ.multi 
                     ? (val as string[])?.includes(opt.value)
                     : val === opt.value;

                   return (
                    <button
                      key={opt.value}
                      onClick={() => currentQ.multi 
                        ? handleMultiSelect(currentQ.id, opt.value)
                        : handleValueChange(currentQ.id, opt.value)
                      }
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between group
                        ${isSelected ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                    >
                      <span className={`font-medium text-lg ${isSelected ? 'text-blue-900' : 'text-gray-700'}`}>
                        {opt.label}
                      </span>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                        ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-300'}`}>
                        {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                    </button>
                   );
                })}

                {/* Text Input */}
                {currentQ.type === 'text' && (
                  <input
                    type="text"
                    id={currentQ.id}
                    name={currentQ.id}
                    value={(formData[currentQ.id] as string) || ''}
                    onChange={(e) => handleValueChange(currentQ.id, e.target.value)}
                    placeholder={currentQ.placeholder}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
                  />
                )}

                {/* Textarea */}
                {currentQ.type === 'textarea' && (
                  <textarea
                    id={currentQ.id}
                    name={currentQ.id}
                    value={(formData[currentQ.id] as string) || ''}
                    onChange={(e) => handleValueChange(currentQ.id, e.target.value)}
                    placeholder={currentQ.placeholder}
                    rows={4}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
                  />
                )}

                {/* Rating */}
                {currentQ.type === 'rating' && (
                  <div className="flex justify-between items-center px-4">
                    <span className="text-sm text-gray-500">Poor/Unorganized</span>
                    <div className="flex gap-4">
                      {[1, 2, 3, 4, 5].map((rate) => (
                        <button
                          key={rate}
                          type="button" // Explicitly type button to prevent form submission if inside a form
                          onClick={() => handleValueChange(currentQ.id, rate)}
                          className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold text-lg transition-all
                            ${formData[currentQ.id] === rate 
                              ? 'bg-blue-600 text-white border-blue-600 scale-110' 
                              : 'border-gray-300 text-gray-600 hover:border-blue-400'}`}
                        >
                          {rate}
                        </button>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">Excellent</span>
                  </div>
                )}

                {/* File Upload */}
                {currentQ.type === 'file' && (
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">Click to upload documents</p>
                    <input 
                      type="file" 
                      multiple 
                      onChange={handleFileChange} 
                      className="hidden" 
                      id={currentQ.id}
                      name={currentQ.id}
                    />
                    <label htmlFor={currentQ.id} className="mt-4 inline-block px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
                      Select Files
                    </label>
                    {uploadedFiles.length > 0 && (
                      <div className="mt-4 text-left">
                        <p className="font-semibold text-sm mb-2">Selected files:</p>
                        <ul className="list-disc pl-5 text-sm text-gray-600">
                          {uploadedFiles.map((f, i) => (
                            <li key={i}>{f.name} ({(f.size / 1024 / 1024).toFixed(2)} MB)</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {error && (
                <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  {error}
                </div>
              )}

              <div className="mt-10 flex justify-between items-center">
                <button
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2 px-6 py-3 text-gray-500 font-medium hover:text-gray-800 disabled:opacity-30"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>

                <button
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg disabled:opacity-50 disabled:shadow-none"
                >
                  {currentStep === QUESTIONS.length ? 'Generate My Plan' : 'Next'}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
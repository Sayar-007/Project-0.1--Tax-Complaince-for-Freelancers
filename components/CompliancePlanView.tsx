import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Download, Share2, Lock, Copy, Check, Save } from 'lucide-react';
import { QuestionnaireState } from '@/lib/questionnaireSchema';
import { generatePDF } from '@/lib/pdfGenerator';
import { useSession } from 'next-auth/react'; // Import useSession

interface CompliancePlanViewProps {
  plan: string;
  userDetails: QuestionnaireState;
}

export default function CompliancePlanView({ plan, userDetails }: CompliancePlanViewProps) {
  const { data: session } = useSession(); // Get session data
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSavingPlan, setIsSavingPlan] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error' | 'loading'>('idle');

  const [isDisclaimerChecked, setIsDisclaimerChecked] = useState(false);

  const handleDownloadPdf = async () => {
    try {
      setIsGeneratingPdf(true);
      
      // Generate PDF client-side
      const blob = await generatePDF(plan, userDetails);
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
      a.download = `ComplianceAlpha_Plan_${dateStr}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to generate PDF", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(plan);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent("My Tax Compliance Plan - ComplianceAlpha");
    const body = encodeURIComponent(`Here is my generated compliance plan:\n\n${plan}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleSavePlan = async () => {
    if (!session?.user) {
      alert("Please log in to save your plan.");
      return;
    }

    setIsSavingPlan(true);
    setSaveStatus('loading');
    try {
      const response = await fetch('/api/plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planContent: plan,
          sourceData: userDetails, // Save userDetails as sourceData
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save plan');
      }

      setSaveStatus('success');
      alert('Plan saved successfully!');
    } catch (error: any) {
      console.error('Error saving plan:', error);
      setSaveStatus('error');
      alert(`Error saving plan: ${error.message}`);
    } finally {
      setIsSavingPlan(false);
      setTimeout(() => setSaveStatus('idle'), 3000); // Reset status after some time
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 bg-white shadow-xl rounded-xl my-8 border border-gray-100">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 pb-6 border-b border-gray-200 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Your Compliance Roadmap</h2>
          <p className="text-sm text-gray-500 mt-1">Generated via Claude 3.5 Sonnet</p>
        </div>
        <div className="flex gap-2">
          {session?.user && ( // Conditionally render Save Plan button
            <button
              onClick={handleSavePlan}
              disabled={isSavingPlan || saveStatus === 'loading'}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50"
              title="Save Plan"
            >
              {isSavingPlan ? (
                <span className="flex items-center"><Save className="w-4 h-4 animate-spin mr-2" /> Saving...</span>
              ) : saveStatus === 'success' ? (
                <span className="flex items-center"><Check className="w-4 h-4 mr-2" /> Saved!</span>
              ) : (
                <span className="flex items-center"><Save className="w-4 h-4 mr-2" /> Save Plan</span>
              )}
            </button>
          )}
          <button
            onClick={handleCopy}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            title="Copy to clipboard"
          >
            {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
          </button>
          <button
            onClick={handleShareEmail}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            title="Share via Email"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {isGeneratingPdf ? 'Generating...' : 'Download PDF'}
          </button>
        </div>
      </div>

      {/* Markdown Content */}
      <div className="prose prose-blue max-w-none">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-blue-900 mt-8 mb-4 pb-2 border-b border-blue-100" {...props} />,
            h2: ({node, ...props}) => <h2 className="text-xl font-bold text-gray-800 mt-6 mb-3" {...props} />,
            ul: ({node, ...props}) => <ul className="list-disc pl-5 space-y-1 text-gray-700" {...props} />,
            li: ({node, ...props}) => <li className="text-gray-700" {...props} />,
            p: ({node, ...props}) => <p className="text-gray-700 leading-relaxed mb-4" {...props} />,
            blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-blue-300 bg-blue-50 pl-4 py-2 my-4 italic text-gray-700 rounded-r" {...props} />,
            code: ({node, ...props}) => <code className="bg-gray-100 text-red-500 px-1 py-0.5 rounded text-sm font-mono" {...props} />,
          }}
        >
          {plan}
        </ReactMarkdown>
      </div>

      {/* Premium Upsell */}
      <div className="mt-12 p-6 bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Lock className="w-5 h-5 text-yellow-400" />
            Unlock Premium Templates
          </h3>
          <p className="text-slate-300 text-sm mt-1">
            Get ready-to-use W-8BEN, Invoice Formats, and Email Scripts.
          </p>
          
          <div className="mt-4 flex items-start gap-2">
            <input 
              type="checkbox" 
              id="legal-disclaimer" 
              className="mt-1 w-4 h-4 rounded border-slate-500 text-blue-600 focus:ring-blue-500"
              checked={isDisclaimerChecked}
              onChange={(e) => setIsDisclaimerChecked(e.target.checked)}
            />
            <label htmlFor="legal-disclaimer" className="text-xs text-slate-300 cursor-pointer select-none">
              I understand this is an AI-generated report and does not constitute professional legal or tax advice.
            </label>
          </div>
        </div>
        <button 
          className={`bg-yellow-400 text-slate-900 font-bold py-2 px-6 rounded-md transition-all shadow-md whitespace-nowrap
            ${!isDisclaimerChecked ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-500 hover:shadow-lg'}
          `}
          onClick={() => {
            if (isDisclaimerChecked) {
              alert("Stripe integration coming soon!");
            }
          }}
          disabled={!isDisclaimerChecked}
        >
          Buy for ₹499
        </button>
      </div>

      <div className="mt-8 text-center text-xs text-gray-400">
        <p>Disclaimer: This plan is AI-generated and does not constitute professional legal or tax advice.</p>
      </div>
    </div>
  );
}

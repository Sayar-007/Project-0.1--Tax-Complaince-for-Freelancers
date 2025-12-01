import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-2xl text-center space-y-8">
        <div className="flex justify-center">
          <div className="p-4 bg-blue-600 rounded-full shadow-lg">
            <ShieldCheck className="w-12 h-12 text-white" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight">
          Compliance<span className="text-blue-600">Alpha</span>
        </h1>
        
        <p className="text-xl text-slate-600 max-w-lg mx-auto leading-relaxed">
          The AI-powered tax compliance roadmap for Indian freelancers and SMBs. 
          Get your personalized cross-border tax plan in minutes.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link 
            href="/questionnaire" 
            className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 hover:shadow-2xl hover:-translate-y-1"
          >
            Start Assessment <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="pt-12 grid grid-cols-3 gap-8 text-center text-sm text-slate-500">
          <div>
            <strong className="block text-slate-900 text-lg mb-1">100%</strong>
            AI Generated
          </div>
          <div>
            <strong className="block text-slate-900 text-lg mb-1">Free</strong>
            Basic Plan
          </div>
          <div>
            <strong className="block text-slate-900 text-lg mb-1">Secure</strong>
            Client-side Data
          </div>
        </div>
      </div>
    </div>
  );
}

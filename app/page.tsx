"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();

  const handleOpenForm = () => {
    router.push('/questionnaire');
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="w-full bg-white py-20 px-6 border-b border-slate-200">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight tracking-tight">
            Earning in USD/GBP? Stop Worrying About the Income Tax Department.
          </h1>
          <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-3xl mx-auto">
            Generate a personalised compliance roadmap in 2 minutes. Built for Indian freelancers earning foreign income through Upwork, Fiverr, Stripe, and PayPal.
          </p>
          <button
            onClick={handleOpenForm}
            className="btn-primary bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-lg px-10 py-4 rounded-lg inline-block"
          >
            Generate My Compliance Report
          </button>
          <p className="text-sm text-slate-500 mt-5 font-medium">
            🔒 Updated for FY 2025-26 | No credit card required | 100% private
          </p>
        </div>
      </section>

      {/* Problem Section: The Minefield */}
      <section className="w-full py-20 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              The Minefield You're Walking Through
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              One small mistake can trigger an audit or cost you thousands in penalties.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1: GST Trap */}
            <div className="bg-white rounded-xl p-8 border border-slate-200 card-hover">
              <div className="icon-wrapper w-14 h-14 bg-amber-100 rounded-lg flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">The "Zero-Rated" Trap</h3>
              <p className="text-slate-600 leading-relaxed">
                Foreign income is technically <span className="font-semibold text-slate-900">zero-rated under GST</span>, but if you don't file a <span className="font-semibold text-slate-900">Letter of Undertaking (LUT)</span>, the department can still demand <span className="font-bold text-red-600">18% GST</span> retrospectively. Most freelancers don't even know what an LUT is.
              </p>
            </div>

            {/* Card 2: Double Taxation */}
            <div className="bg-white rounded-xl p-8 border border-slate-200 card-hover">
              <div className="icon-wrapper w-14 h-14 bg-amber-100 rounded-lg flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Double Taxation</h3>
              <p className="text-slate-600 leading-relaxed">
                You might be paying tax to the US (via Upwork's 1099) <span className="font-semibold text-slate-900">and</span> India. Without knowing about <span className="font-semibold text-slate-900">DTAA (Double Tax Avoidance Agreement)</span> and Form 67, you're leaving money on the table—or worse, paying twice.
              </p>
            </div>

            {/* Card 3: Red Flag */}
            <div className="bg-white rounded-xl p-8 border border-slate-200 card-hover">
              <div className="icon-wrapper w-14 h-14 bg-amber-100 rounded-lg flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">The "High Value Transaction" Red Flag</h3>
              <p className="text-slate-600 leading-relaxed">
                If your foreign remittances cross <span className="font-bold text-red-600">₹10 lakh in a year</span>, your bank auto-reports it to the IT department. If your ITR doesn't match, expect a notice. And if you haven't maintained a proper <span className="font-semibold text-slate-900">Foreign Exchange Management Act (FEMA)</span> trail? You're in deeper trouble.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section: Autopilot */}
      <section className="w-full py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Your Compliance on Autopilot
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Answer 15 questions. Get a bulletproof roadmap. Sleep easy.
            </p>
          </div>
          <div className="space-y-16">
            {/* Step 1 */}
            <div className="timeline-step">
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center shadow-sm border border-blue-200">
                  <svg className="w-8 h-8 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">Answer 15 Simple Questions</h3>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    We ask about your income sources (Upwork, Stripe, etc.), your total foreign earnings, whether you're registered under GST, and if you've filed an LUT. That's it. No tax jargon. No 20-page forms.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="timeline-step">
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center shadow-sm border border-blue-200">
                  <svg className="w-8 h-8 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">The Compliance Engine Runs</h3>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    Our system checks if you're eligible for <span className="font-semibold text-blue-900">Section 44ADA</span> (presumptive taxation at 50% of gross receipts), whether you need to register for GST, and if you're at risk for double taxation. It cross-references DTAA rates for your client countries and flags any FEMA violations.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="timeline-step">
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center shadow-sm border border-emerald-200">
                  <svg className="w-8 h-8 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">Get Your Audit-Proof Roadmap</h3>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    You receive a personalized PDF with: Your exact tax liability (with Section 44ADA applied if eligible), step-by-step instructions for filing LUT (if needed), a checklist for claiming foreign tax credit (Form 67), and red flags you need to fix before the next audit cycle.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="w-full py-20 px-6 bg-slate-100 overflow-hidden">
        <div className="max-w-6xl mx-auto mb-12">
          <h2 className="text-4xl font-bold text-slate-900 text-center mb-4">
            Trusted by Freelancers Across India
          </h2>
          <p className="text-lg text-slate-600 text-center">
            Join hundreds of freelancers who've secured their foreign income.
          </p>
        </div>
        <div className="flex gap-6 animate-scroll" style={{ width: "200%" }}>
          {/* Testimonial 1 */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 flex-shrink-0" style={{ width: "calc(33.333% - 16px)" }}>
            <div className="text-slate-300 mb-5">
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>
            <p className="text-slate-700 mb-6 leading-relaxed text-base">
              "I was terrified of getting a GST notice. This tool showed me I needed to file an LUT immediately. Dodged a bullet."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center text-white font-bold text-base">
                RM
              </div>
              <div>
                <p className="font-semibold text-slate-900">Rohan M.</p>
                <p className="text-sm text-slate-500">Full Stack Developer, Mumbai</p>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 flex-shrink-0" style={{ width: "calc(33.333% - 16px)" }}>
            <div className="text-slate-300 mb-5">
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>
            <p className="text-slate-700 mb-6 leading-relaxed text-base">
              "I had no idea I could claim foreign tax credit under DTAA. Saved ₹80,000 on my last ITR."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center text-white font-bold text-base">
                AS
              </div>
              <div>
                <p className="font-semibold text-slate-900">Ananya S.</p>
                <p className="text-sm text-slate-500">UX Designer, Bangalore</p>
              </div>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 flex-shrink-0" style={{ width: "calc(33.333% - 16px)" }}>
            <div className="text-slate-300 mb-5">
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>
            <p className="text-slate-700 mb-6 leading-relaxed text-base">
              "Section 44ADA changed everything. My tax liability dropped by 40%. Wish I'd known about this 3 years ago."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center text-white font-bold text-base">
                VD
              </div>
              <div>
                <p className="font-semibold text-slate-900">Vikram D.</p>
                <p className="text-sm text-slate-500">Content Writer, Delhi</p>
              </div>
            </div>
          </div>

          {/* Duplicates for seamless loop */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 flex-shrink-0" style={{ width: "calc(33.333% - 16px)" }}>
            <div className="text-slate-300 mb-5">
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>
            <p className="text-slate-700 mb-6 leading-relaxed text-base">
              "I was terrified of getting a GST notice. This tool showed me I needed to file an LUT immediately. Dodged a bullet."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center text-white font-bold text-base">
                RM
              </div>
              <div>
                <p className="font-semibold text-slate-900">Rohan M.</p>
                <p className="text-sm text-slate-500">Full Stack Developer, Mumbai</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 flex-shrink-0" style={{ width: "calc(33.333% - 16px)" }}>
            <div className="text-slate-300 mb-5">
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>
            <p className="text-slate-700 mb-6 leading-relaxed text-base">
              "I had no idea I could claim foreign tax credit under DTAA. Saved ₹80,000 on my last ITR."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center text-white font-bold text-base">
                AS
              </div>
              <div>
                <p className="font-semibold text-slate-900">Ananya S.</p>
                <p className="text-sm text-slate-500">UX Designer, Bangalore</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 flex-shrink-0" style={{ width: "calc(33.333% - 16px)" }}>
            <div className="text-slate-300 mb-5">
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>
            <p className="text-slate-700 mb-6 leading-relaxed text-base">
              "Section 44ADA changed everything. My tax liability dropped by 40%. Wish I'd known about this 3 years ago."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center text-white font-bold text-base">
                VD
              </div>
              <div>
                <p className="font-semibold text-slate-900">Vikram D.</p>
                <p className="text-sm text-slate-500">Content Writer, Delhi</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="w-full bg-blue-900 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-10 leading-tight">
            Don't let a paperwork error cost you 18% of your revenue.
          </h2>
          <button
            onClick={handleOpenForm}
            className="btn-primary bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-lg px-10 py-4 rounded-lg inline-block"
          >
            Secure My Foreign Income Now
          </button>
          <p className="text-blue-200 text-sm mt-6 font-medium">
            Takes 2 minutes • No credit card • Instant download
          </p>
        </div>
      </section>
    </div>
  );
}

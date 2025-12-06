"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  AlertTriangle, 
  DollarSign, 
  Flag, 
  ClipboardList, 
  Cpu, 
  FileCheck, 
  Quote,
  ShieldCheck
} from "lucide-react"

export default function LandingPage() {
  const handleGenerateReport = () => {
    console.log("Open Form")
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Hero Section */}
      <section className="w-full px-4 py-20 md:py-32 bg-white">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight">
            Earning in USD? Stop Worrying About the Income Tax Department.
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
            Generate a personalised compliance report that handles GST, 44ADA, and FIRC documentation.
          </p>
          <div className="flex flex-col items-center gap-4">
            <Button 
              variant="emerald" 
              size="lg" 
              className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all"
              onClick={handleGenerateReport}
            >
              Generate My Compliance Report
            </Button>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Updated for FY 2025-26 • Audit-Proof Logic</span>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section (The Minefield) */}
      <section className="w-full px-4 py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              The Freelancer Tax Minefield
            </h2>
            <p className="text-slate-600">
              Most CAs don't understand foreign income. One mistake can cost you dearly.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-slate-200 hover:shadow-md transition-shadow bg-white">
              <CardHeader className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                </div>
                <CardTitle className="text-xl">The Zero-Rated Trap</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Forget to file an LUT? You might be liable to pay <span className="font-bold text-red-600">18% GST</span> on your entire foreign revenue, instantly wiping out your profits.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 hover:shadow-md transition-shadow bg-white">
              <CardHeader className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Double Taxation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Without proper DTAA (Double Taxation Avoidance Agreement) documentation, you could be taxed in both the US and India.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 hover:shadow-md transition-shadow bg-white">
              <CardHeader className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <Flag className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle className="text-xl">High Value Red Flags</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Inconsistent filing between GST returns and Income Tax returns is the #1 trigger for scrutiny notices for high-value freelancers.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Solution Section (Autopilot) */}
      <section className="w-full px-4 py-20 bg-white">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Put Your Compliance on Autopilot
            </h2>
          </div>

          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 -translate-x-1/2 hidden md:block"></div>
            
            <div className="space-y-12">
              {/* Step 1 */}
              <div className="relative flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-1/2 flex justify-start md:justify-end">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm z-10 relative">
                    <ClipboardList className="w-8 h-8 text-emerald-600" />
                  </div>
                </div>
                <div className="md:w-1/2 text-left">
                  <h3 className="text-xl font-bold text-slate-900">Answer 5 Simple Questions</h3>
                  <p className="text-slate-600">Tell us about your income sources and expenses. No complex jargon.</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative flex flex-col md:flex-row-reverse items-center gap-8">
                <div className="md:w-1/2 flex justify-start md:justify-end">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm z-10 relative">
                    <Cpu className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                <div className="md:w-1/2 text-left md:text-right">
                  <h3 className="text-xl font-bold text-slate-900">The Compliance Engine Runs</h3>
                  <p className="text-slate-600">We automatically calculate your optimal tax regime (including <span className="font-semibold text-slate-900">Section 44ADA</span>) and check for GST applicability.</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-1/2 flex justify-start md:justify-end">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm z-10 relative">
                    <FileCheck className="w-8 h-8 text-emerald-600" />
                  </div>
                </div>
                <div className="md:w-1/2 text-left">
                  <h3 className="text-xl font-bold text-slate-900">Get Your Audit-Proof Roadmap</h3>
                  <p className="text-slate-600">Receive a detailed PDF report with your tax liability, filing dates, and required documents list.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="w-full px-4 py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto space-y-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900">
            Trusted by 500+ Indian Freelancers
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Rohan M.",
                role: "Full Stack Developer",
                text: "I was terrified of the 18% GST rule. This tool clarified everything in 5 minutes. Saved me lakhs."
              },
              {
                name: "Ananya S.",
                role: "UI/UX Designer",
                text: "My CA didn't know about FIRC. This report gave me the exact checklist I needed to show the bank."
              },
              {
                name: "Vikram D.",
                role: "SaaS Consultant",
                text: "Finally, something that explains Section 44ADA simply. The roadmap is a lifesaver."
              }
            ].map((testimonial, i) => (
              <Card key={i} className="bg-white border-none shadow-sm">
                <CardHeader>
                  <Quote className="w-8 h-8 text-blue-200 mb-2" />
                  <CardContent className="p-0">
                    <p className="text-slate-600 mb-6">"{testimonial.text}"</p>
                    <div>
                      <p className="font-bold text-slate-900">{testimonial.name}</p>
                      <p className="text-sm text-slate-500">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="w-full px-4 py-24 bg-blue-900 text-white text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold leading-tight">
            Don't let a paperwork error cost you 18% of your revenue.
          </h2>
          <Button 
            variant="emerald" 
            size="lg" 
            className="text-lg px-10 py-8 shadow-xl hover:shadow-2xl transition-all"
            onClick={handleGenerateReport}
          >
            Secure My Foreign Income Now
          </Button>
        </div>
      </section>
    </div>
  )
}
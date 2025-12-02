import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { questionnaireSchema, QuestionnaireState } from '@/lib/questionnaireSchema';

// In-memory rate limiter (simple implementation for demo)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowSize = 60 * 60 * 1000; // 1 hour
  const limit = 10;

  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowSize });
    return false;
  }

  if (record.count >= limit) {
    return true;
  }

  record.count += 1;
  return false;
}

export async function POST(request: NextRequest) {
  // 1. Basic Environment Check
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { success: false, error: 'Server configuration error: API Key missing' },
      { status: 500 }
    );
  }

  // 2. Rate Limiting
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { success: false, error: 'Rate limit exceeded. Please try again later.' },
      { status: 429 }
    );
  }

  try {
    // 3. Parse & Validate Body
    const body = await request.json();
    const validation = questionnaireSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid questionnaire data', details: validation.error.errors },
        { status: 400 }
      );
    }

    const data: QuestionnaireState = validation.data;

    // 4. Construct Prompt
    // Logic for "if_has_alerts" and "if_edge_cases" simulation
    // In a real scenario, we might pre-calculate these in JS, but here we let Claude infer or we pass flags.
    // The prompt template uses handlebars-like syntax, we'll do manual string interpolation.

    const userPrompt = `
# User Profile

**Entity Type:** ${data.entity_type}
**Profession:** ${data.profession_nature}
**Annual Turnover:** ${data.annual_turnover}
**Client Countries:** ${data.client_countries.join(', ')}
**Payment Methods:** ${data.payment_modes.join(', ')}
**GST Registered:** ${data.gst_status}
**LUT Filed:** ${data.lut_status || 'N/A'}

---

# Task

Generate a comprehensive, step-by-step compliance plan for this Indian freelancer/SMB. The plan must include:

## 1. Registration & Setup
- GST registration requirement (mandatory/optional/exempt)
- LUT filing requirement (if GST registered)
- MSME/UDYAM registration recommendation
- Tax regime applicability (44ADA/44AD/Regular)

## 2. Client Onboarding Documents
- Forms required for each client country (W-8BEN, TRC, etc.)
- Where to get these forms
- How to fill them (key sections)
- Renewal timelines

## 3. Payment & Invoicing Protocol
- Invoice format requirements
- Proof documents needed (FIRC/FIRA)
- Forex loss/gain handling
- GST rate to charge (0% export vs 18% domestic)

## 4. Annual Tax Filing
- ITR form type (ITR-2/ITR-3/ITR-4)
- Tax calculation method (presumptive/regular)
- Advance tax deadlines (15 Jun, 15 Sep, 15 Dec, 15 Mar)
- Audit requirement (Yes/No + Section)

## 5. Critical Alerts
- Analyze the profile for ANY critical compliance gaps (e.g. turnover > 20L without GST, missing LUT).

## 6. Edge Case Warnings
- Consider specific risks like 'Intermediary Services', 'Crypto Tax', or 'PayPal FIRA issues' based on the inputs.

## 7. Estimated Tax Liability
- Calculate approximate tax based on turnover and tax regime
- Show breakdown (Income Tax + GST + TDS if applicable)

## 8. Next 30 Days Action Items
- Prioritized checklist with deadlines
- Cost estimates for CA fees, registrations, etc.

---

**Output Format:** Markdown with clear headings, bullet points, and emphasis on ACTION ITEMS.
**Tone:** Professional but accessible. Avoid jargon where possible.
**Length:** Comprehensive (2000-2500 words).
    `;

    // 5. Call Gemini API
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      systemInstruction: "You are an expert Indian Chartered Accountant (CA) specializing in cross-border taxation for freelancers and SMBs. Your responses must be specific to Indian tax law (FY 2024-25), action-oriented, risk-aware, and practical."
    });

    const result = await model.generateContent(userPrompt);
    const response = await result.response;
    const planText = response.text();

    return NextResponse.json({ success: true, plan: planText });

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

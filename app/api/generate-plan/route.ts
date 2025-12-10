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
**Profession:** ${data.profession}
**Annual Revenue (Est. Apr 2025 - Mar 2026):** ${data.revenue}
**Client Locations:** ${data.client_location.join(', ')}
**Payment Methods:** ${data.payment_methods.join(', ')}
**GST Number:** ${data.gst_number}
**LUT Filed:** ${data.lut_filed || 'N/A'}
**Signed Tax Forms (e.g. W-8BEN):** ${data.tax_forms}
**Capital Expenditure:** ${data.capital_expenditure}
**Expense Records Quality (1-5):** ${data.expense_records}
**Investments (80C/80CCD):** ${data.investments}
**Hires Freelancers/Agencies:** ${data.hire_freelancers}
**Pays > ₹30k/year:** ${data.pay_above_30k}
**Other Info:** ${data.other_info || 'None'}

---

# Task

Generate a comprehensive, step-by-step compliance plan for this Indian freelancer/SMB. The plan must include:

## 1. Registration & Setup
- GST registration requirement (mandatory/optional/exempt) based on turnover and export status.
- LUT filing requirement (if GST registered) and implications of not filing.
- MSME/UDYAM registration recommendation.
- Tax regime applicability (44ADA/44AD/Regular) based on profession and turnover.

## 2. Cross-Border Compliance
- Forms required for each client country (W-8BEN for US, TRC, etc.).
- Analysis of "Signed Tax Forms" status: If "Ignored", explain risks.
- FIRC/FIRA requirements for payment methods used (especially PayPal/Wise).

## 3. Expense & Tax Management
- **Depreciation:** specific advice on claiming depreciation for reported Capital Expenditure.
- **Record Keeping:** Advice based on their reported "Expense Records Quality".
- **Investments:** Optimization strategy for 80C/80CCD based on their current investment status.

## 4. TDS & Hiring Compliance
- **TDS Deduction:** If they hire freelancers or pay > 30k, explain TAN requirement and TDS rates (194J/194C).
- **Compliance:** Filing quarterly TDS returns.

## 5. Annual Tax Filing
- ITR form type (ITR-2/ITR-3/ITR-4).
- Tax calculation method (presumptive/regular).
- Advance tax deadlines (15 Jun, 15 Sep, 15 Dec, 15 Mar).
- Audit requirement (Yes/No + Section).

## 6. Critical Alerts
- Analyze the profile for ANY critical compliance gaps (e.g. turnover > 20L without GST, missing LUT, ignoring W-8BEN).

## 7. Estimated Tax Liability
- Calculate approximate tax based on turnover and tax regime.
- Show breakdown (Income Tax + GST + TDS if applicable).

## 8. Next 30 Days Action Items
- Prioritized checklist with deadlines.
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

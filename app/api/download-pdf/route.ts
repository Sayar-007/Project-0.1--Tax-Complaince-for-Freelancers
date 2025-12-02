import { NextRequest, NextResponse } from 'next/server';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'; // This might crash in Node without a mock window, but let's try.
import { QuestionnaireState } from '@/lib/questionnaireSchema';

// Junior Dev Note: I'm moving the PDF generation to the backend here.
// This way the client doesn't have to do the heavy lifting!

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { plan, userDetails } = body;

    if (!plan || !userDetails) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    // Initialize PDF
    // I read online that new jsPDF() works in Node if you just import it.
    const doc = new jsPDF();

    // --- Branding ---
    const primaryColor = '#2563eb';
    doc.setFillColor(primaryColor);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text("ComplianceAlpha", 14, 20);
    doc.setFontSize(12);
    doc.text("Indian Freelancer Tax Compliance Roadmap (Server Generated)", 14, 28);
    
    doc.setTextColor(0, 0, 0);

    // --- User Details ---
    // I'm trying to replicate the client-side table here.
    // If autoTable fails on the server, I might need to switch to simple text.
    // But for now, let's try to manually write it out if table is hard.
    
    let currentY = 50;
    doc.setFontSize(14);
    doc.text("User Profile Summary", 14, currentY);
    currentY += 10;
    doc.setFontSize(11);

    // Manual printing because autotable is tricky in Node environment without DOM
    const details = [
      `Entity Type: ${userDetails.entity_type}`,
      `Profession: ${userDetails.profession_nature}`,
      `Turnover: ${userDetails.annual_turnover}`,
      `GST Status: ${userDetails.gst_status}`,
      `LUT Status: ${userDetails.lut_status || 'N/A'}`
    ];

    details.forEach(line => {
        doc.text(line, 14, currentY);
        currentY += 7;
    });

    currentY += 10;

    // --- Plan Content ---
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Your Compliance Plan", 14, currentY);
    currentY += 10;
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    // Clean up the markdown a bit
    const cleanPlan = plan.replace(/\*\*/g, '').replace(/##/g, '');
    const lines = doc.splitTextToSize(cleanPlan, 180);

    // Loop through lines to handle page breaks
    for (let i = 0; i < lines.length; i++) {
        if (currentY > 280) {
            doc.addPage();
            currentY = 20;
        }
        doc.text(lines[i], 14, currentY);
        currentY += 5;
    }

    // Convert to Buffer
    const pdfBuffer = doc.output('arraybuffer');

    // Return as a downloadable file
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="compliance_plan.pdf"',
      },
    });

  } catch (error: any) {
    console.error("PDF Generation Error:", error);
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}

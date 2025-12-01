import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { QuestionnaireState } from './questionnaireSchema';

/**
 * Generates a branded PDF compliance plan.
 * @param plan The markdown/text content of the plan (we will strip markdown for simple text PDF or format it)
 * @param userDetails The user's questionnaire answers
 * @returns Promise<Blob> The PDF file as a Blob
 */
export async function generatePDF(plan: string, userDetails: QuestionnaireState): Promise<Blob> {
  const doc = new jsPDF();

  // --- Branding & Header ---
  const primaryColor = '#2563eb'; // Blue
  
  // Logo Placeholder
  doc.setFillColor(primaryColor);
  doc.rect(0, 0, 210, 40, 'F'); // Blue header bar
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("ComplianceAlpha", 14, 20);
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Indian Freelancer Tax Compliance Roadmap", 14, 28);

  doc.setTextColor(0, 0, 0); // Reset text color

  // --- User Profile Summary ---
  let currentY = 50;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("User Profile Summary", 14, currentY);
  currentY += 5;

  const profileData = [
    ["Entity Type", userDetails.entity_type === 'sole_prop' ? 'Sole Proprietor' : 'Pvt Ltd Company'],
    ["Profession", userDetails.profession_nature === 'specified' ? 'Specified Profession' : 'Business/Trading'],
    ["Turnover Range", userDetails.annual_turnover.replace(/_/g, ' ').toUpperCase()],
    ["Client Locations", userDetails.client_countries.join(', ').toUpperCase()],
    ["Payment Modes", userDetails.payment_modes.join(', ').toUpperCase()],
    ["GST Registered", userDetails.gst_status.toUpperCase()],
    ["LUT Filed", userDetails.lut_status ? userDetails.lut_status.toUpperCase() : 'N/A'],
  ];

  autoTable(doc, {
    startY: currentY,
    head: [['Parameter', 'Value']],
    body: profileData,
    theme: 'striped',
    headStyles: { fillColor: primaryColor },
    margin: { top: 10 },
  });

  // @ts-ignore
  currentY = doc.lastAutoTable.finalY + 15;

  // --- AI Generated Plan Content ---
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Your Compliance Plan", 14, currentY);
  currentY += 10;
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  // Simple Markdown stripping/formatting for PDF (MVP approach)
  // In a full production app, we would parse the Markdown tree to PDF nodes.
  // Here, we'll do basic cleaning to make it readable text.
  const lines = doc.splitTextToSize(plan.replace(/\*\*/g, '').replace(/##/g, ''), 180);
  
  // Check for page breaks
  for (let i = 0; i < lines.length; i++) {
    if (currentY > 280) {
      doc.addPage();
      currentY = 20;
    }
    doc.text(lines[i], 14, currentY);
    currentY += 5;
  }

  // --- Footer ---
  const pageCount = doc.getNumberOfPages();
  doc.setFontSize(8);
  doc.setTextColor(150);
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const footerText = "This compliance plan is AI-generated based on information you provided. It is for informational purposes only and does not constitute professional tax advice. Please consult a Chartered Accountant before filing returns or making tax decisions.";
    const splitFooter = doc.splitTextToSize(footerText, 180);
    doc.text(splitFooter, 14, 285);
    doc.text(`Page ${i} of ${pageCount}`, 190, 290, { align: 'right' });
  }

  return doc.output('blob');
}

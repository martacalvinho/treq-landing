import { NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function POST(request: Request) {
  try {
    const { riskAmount, violations } = await request.json();
    console.log('Generating PDF...');

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    let currentPage = pdfDoc.addPage([595.276, 841.890]); // A4 size
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    let yPosition = 800;

    // Helper function to add text
    const addText = (text: string, options: { size: number; font: typeof helveticaFont | typeof helveticaBold; color?: [number, number, number]; x?: number }) => {
      currentPage.drawText(text, {
        x: options.x || 50,
        y: yPosition,
        ...options,
      });
      yPosition -= options.size + 10;
    };

    // Helper function to add new page
    const addNewPage = () => {
      currentPage = pdfDoc.addPage([595.276, 841.890]);
      yPosition = 800;
    };

    // Header with logo text
    addText('Treqy', { size: 24, font: helveticaBold, color: rgb(0.11, 0.38, 0.94) });
    addText('NYC Restaurant Compliance Checklist', { size: 20, font: helveticaBold });
    yPosition -= 20;

    // Summary
    addText('Your Compliance Summary:', { size: 14, font: helveticaBold });
    addText(`Potential Risk Amount: $${riskAmount}`, { 
      size: 12, 
      font: helveticaFont,
      color: rgb(0.8, 0, 0),
    });
    addText(`Areas Needing Attention: ${violations}`, { size: 12, font: helveticaFont });
    yPosition -= 20;

    // Sections
    const sections = {
      "General Business Licenses & Permits": [
        "Do you have an active Food Service Establishment Permit? (Yes/No): _______",
        "NYC Health Department Letter Grade (A, B, C, Pending): _______",
        "Do you have a valid Certificate of Occupancy (CO)? (Yes/No): _______",
        "Food Protection Certificate Expiry Date: _______",
      ],
      "Food Safety & Handling": [
        "Do all food handlers have valid licenses? (Yes/No): _______",
        "Refrigerator temperature (°F): _______",
        "Are food temperature logs updated daily? (Yes/No): _______",
        "Do you have a pest control service scheduled regularly? (Yes/No): _______",
      ],
      "Fire Safety & Equipment": [
        "Do you have a valid Fire Suppression System (ANSUL) inspection? (Yes/No): _______",
        "Last kitchen hood & duct cleaning date: _______",
        "Are emergency exits clear and lights working? (Yes/No): _______",
      ],
      "Waste Management & Sustainability": [
        "Do you separate waste correctly (organic, recyclable, landfill)? (Yes/No): _______",
        "Last grease trap cleaning date: _______",
        "Are all employees trained in NYC's waste disposal regulations? (Yes/No): _______",
      ],
      "Inspection Readiness (DOH, FDNY, DEP, OSHA)": [
        "Last DOH inspection result (Pass/Fail): _______",
        "Have previous violations been corrected? (Yes/No): _______",
        "Do you have an OSHA-compliant first aid kit? (Yes/No): _______",
        "Have employees completed required safety training? (Yes/No): _______",
      ],
    };

    Object.entries(sections).forEach(([section, items]) => {
      if (yPosition < 150) {
        addNewPage();
      }

      // Section title
      addText(section, { size: 14, font: helveticaBold });

      // Items
      items.forEach(item => {
        if (yPosition < 100) {
          addNewPage();
        }
        currentPage.drawText('[ ]', {
          x: 50,
          y: yPosition,
          size: 12,
          font: helveticaFont,
        });
        currentPage.drawText(item, {
          x: 70,
          y: yPosition,
          size: 11,
          font: helveticaFont,
        });
        yPosition -= 25;
      });
      yPosition -= 15;
    });

    // Risk Level Guide
    if (yPosition < 200) {
      addNewPage();
    }
    yPosition -= 20;
    addText('Risk Level Guide', { size: 14, font: helveticaBold });
    addText(" 0-5 Checks Missing: You are in good shape! Keep tracking renewals.", { 
      size: 11, 
      font: helveticaFont,
      color: rgb(0, 0.6, 0) 
    });
    addText(" 6-15 Checks Missing: You have compliance risks - schedule renewals ASAP.", { 
      size: 11, 
      font: helveticaFont,
      color: rgb(0.8, 0.6, 0) 
    });
    addText(" 16+ Checks Missing: Your restaurant could face fines or closure!", { 
      size: 11, 
      font: helveticaFont,
      color: rgb(0.8, 0, 0) 
    });

    // Footer with CTA
    yPosition -= 20;
    addText(" Next Step: Start tracking your compliance deadlines in one place with Treqy.", { 
      size: 12, 
      font: helveticaBold 
    });
    addText(" Join the Waitlist & Get 30% Off at www.treqy.com", { 
      size: 12, 
      font: helveticaFont,
      color: rgb(0.11, 0.38, 0.94)
    });

    // Generate PDF bytes
    console.log('Generating PDF bytes...');
    const pdfBytes = await pdfDoc.save();
    console.log('PDF generated successfully');

    // Convert to Base64
    const base64String = Buffer.from(pdfBytes).toString('base64');

    return NextResponse.json({ 
      pdf: base64String,
      message: 'PDF generated successfully' 
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}

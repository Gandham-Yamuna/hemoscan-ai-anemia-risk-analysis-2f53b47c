import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { AnalysisResult } from "@/lib/anemiaAnalysis";
import type { CBCData } from "@/components/CBCInputForm";

const PRIMARY = [220, 50, 50] as const;
const DARK = [15, 20, 35] as const;
const MUTED = [120, 130, 150] as const;

function getDietFoods(type: string): string[] {
  const map: Record<string, string[]> = {
    "Iron Deficiency Anemia": ["Red Meat & Liver", "Spinach & Dark Greens", "Lentils & Beans", "Citrus Fruits", "Eggs", "Fortified Cereals"],
    "Megaloblastic Anemia (B12/Folate)": ["Shellfish & Fish", "Organ Meats", "Fortified Nutritional Yeast", "Asparagus & Broccoli", "Eggs & Dairy", "Leafy Greens"],
    "Anemia of Chronic Disease": ["Fatty Fish (Salmon)", "Turmeric & Ginger", "Berries & Cherries", "Olive Oil", "Nuts & Seeds", "Leafy Greens"],
    "Thalassemia Trait": ["Folate-Rich Greens", "Whole Grains", "Tea (with meals)", "Calcium-Rich Foods", "Fruits & Vegetables", "Legumes & Nuts"],
  };
  return map[type] || ["Lean Red Meat", "Dark Leafy Greens", "Fish & Seafood", "Eggs", "Citrus Fruits", "Water & Hydration"];
}

function getDietAvoid(type: string): string[] {
  const map: Record<string, string[]> = {
    "Iron Deficiency Anemia": ["Tea/coffee within 1hr of meals", "Excess dairy with iron meals", "Processed foods", "Antacids near meals"],
    "Megaloblastic Anemia (B12/Folate)": ["Alcohol", "Excessive cooking of vegetables", "Processed grains", "Smoking"],
    "Anemia of Chronic Disease": ["Refined sugars", "Trans fats & fried foods", "Excess red meat", "Alcohol"],
    "Thalassemia Trait": ["Iron supplements", "Excess red meat & organ meats", "Iron-fortified cereals", "Vitamin C with meals"],
  };
  return map[type] || ["Excess caffeine", "Processed foods", "Alcohol", "Calcium with iron meals"];
}

export function generatePDFReport(result: AnalysisResult, cbcData: CBCData) {
  const doc = new jsPDF();
  const pageW = doc.internal.pageSize.getWidth();
  let y = 15;

  // Header
  doc.setFillColor(...DARK);
  doc.rect(0, 0, pageW, 40, "F");
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text("HemoScan AI", 14, 18);
  doc.setFontSize(10);
  doc.setTextColor(200, 200, 210);
  doc.text("Anemia Detection & Risk Analysis Report", 14, 26);
  doc.setFontSize(8);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 34);
  doc.text(`Patient: ${cbcData.gender === "male" ? "Male" : "Female"}, Age ${cbcData.age}`, pageW - 14, 34, { align: "right" });

  y = 50;

  // Classification box
  doc.setFillColor(250, 245, 245);
  doc.roundedRect(14, y, pageW - 28, 30, 3, 3, "F");
  doc.setFontSize(14);
  doc.setTextColor(...PRIMARY);
  doc.text(result.classification.type, 20, y + 12);
  doc.setFontSize(10);
  doc.setTextColor(...MUTED);
  doc.text(`Severity: ${result.classification.severity.toUpperCase()}  |  Confidence: ${(result.classification.confidence * 100).toFixed(1)}%`, 20, y + 22);
  doc.setFontSize(12);
  doc.setTextColor(...DARK);
  doc.text(`Risk: ${result.riskScore}/100 (${result.riskLevel})`, pageW - 20, y + 12, { align: "right" });

  y += 40;

  // CBC Parameters Table
  doc.setFontSize(12);
  doc.setTextColor(...DARK);
  doc.text("CBC Parameters", 14, y);
  y += 4;

  autoTable(doc, {
    startY: y,
    head: [["Parameter", "Value", "Unit", "Ref Range", "Status"]],
    body: result.parameters.map((p) => [
      p.name,
      p.value.toString(),
      p.unit,
      `${p.refMin} – ${p.refMax}`,
      p.status.toUpperCase(),
    ]),
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [...PRIMARY], textColor: [255, 255, 255], fontStyle: "bold" },
    alternateRowStyles: { fillColor: [248, 248, 252] },
    didParseCell: (data) => {
      if (data.column.index === 4 && data.section === "body") {
        const val = data.cell.raw as string;
        if (val === "LOW") data.cell.styles.textColor = [...PRIMARY];
        else if (val === "HIGH") data.cell.styles.textColor = [200, 120, 20];
        else data.cell.styles.textColor = [40, 160, 100];
        data.cell.styles.fontStyle = "bold";
      }
    },
  });

  y = (doc as any).lastAutoTable.finalY + 12;

  // Recommendations
  doc.setFontSize(12);
  doc.setTextColor(...DARK);
  doc.text("Clinical Recommendations", 14, y);
  y += 6;
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  result.recommendations.forEach((rec, i) => {
    if (y > 260) { doc.addPage(); y = 20; }
    doc.text(`${i + 1}. ${rec}`, 18, y);
    y += 6;
  });

  // Diet Plan (only for non-normal)
  if (result.classification.severity !== "normal") {
    y += 6;
    if (y > 220) { doc.addPage(); y = 20; }
    doc.setFontSize(12);
    doc.setTextColor(...DARK);
    doc.text("Personalized Diet Plan", 14, y);
    y += 8;

    doc.setFontSize(10);
    doc.setTextColor(40, 160, 100);
    doc.text("Recommended Foods:", 18, y);
    y += 6;
    doc.setFontSize(9);
    doc.setTextColor(...MUTED);
    getDietFoods(result.classification.type).forEach((food) => {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.text(`• ${food}`, 22, y);
      y += 5;
    });

    y += 4;
    doc.setFontSize(10);
    doc.setTextColor(...PRIMARY);
    doc.text("Foods to Avoid:", 18, y);
    y += 6;
    doc.setFontSize(9);
    doc.setTextColor(...MUTED);
    getDietAvoid(result.classification.type).forEach((item) => {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.text(`• ${item}`, 22, y);
      y += 5;
    });
  }

  // Footer disclaimer
  y += 10;
  if (y > 260) { doc.addPage(); y = 20; }
  doc.setFillColor(245, 245, 250);
  doc.roundedRect(14, y, pageW - 28, 16, 2, 2, "F");
  doc.setFontSize(7);
  doc.setTextColor(...MUTED);
  doc.text("Disclaimer: This report is for educational and decision-support purposes only. Always consult a qualified healthcare professional.", 20, y + 6);
  doc.text("Generated by HemoScan AI — Anemia Detection & Risk Analysis System", 20, y + 12);

  doc.save(`HemoScan-Report-${new Date().toISOString().slice(0, 10)}.pdf`);
}

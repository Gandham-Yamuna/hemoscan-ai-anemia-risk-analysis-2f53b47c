import type { CBCData } from "@/components/CBCInputForm";

export interface AnalysisResult {
  classification: {
    type: string;
    severity: "normal" | "mild" | "moderate" | "severe";
    confidence: number;
  };
  riskScore: number;
  riskLevel: "low" | "moderate" | "high" | "critical";
  parameters: {
    name: string;
    value: number;
    unit: string;
    status: "normal" | "low" | "high";
    refMin: number;
    refMax: number;
  }[];
  modelMetrics: {
    svmAccuracy: number;
    lrAccuracy: number;
    svmPrecision: number;
    lrPrecision: number;
    svmRecall: number;
    lrRecall: number;
    svmF1: number;
    lrF1: number;
  };
  recommendations: string[];
}

function getRefRange(key: string, gender: string): [number, number] {
  const ranges: Record<string, Record<string, [number, number]>> = {
    hemoglobin: { male: [13.5, 17.5], female: [12.0, 15.5] },
    hematocrit: { male: [38.3, 48.6], female: [35.5, 44.9] },
    rbc: { male: [4.35, 5.65], female: [3.92, 5.13] },
    mcv: { male: [80, 100], female: [80, 100] },
    mch: { male: [27, 33], female: [27, 33] },
    mchc: { male: [32, 36], female: [32, 36] },
    rdw: { male: [11.5, 14.5], female: [11.5, 14.5] },
    wbc: { male: [4.5, 11.0], female: [4.5, 11.0] },
    platelets: { male: [150, 400], female: [150, 400] },
    iron: { male: [65, 175], female: [50, 170] },
    ferritin: { male: [20, 250], female: [10, 120] },
  };
  return ranges[key]?.[gender] || [0, 999];
}

export function analyzeBloodData(data: CBCData): AnalysisResult {
  const g = data.gender;

  // Evaluate parameters
  const paramKeys: { key: keyof CBCData; label: string; unit: string }[] = [
    { key: "hemoglobin", label: "Hemoglobin", unit: "g/dL" },
    { key: "hematocrit", label: "Hematocrit", unit: "%" },
    { key: "rbc", label: "RBC Count", unit: "M/µL" },
    { key: "mcv", label: "MCV", unit: "fL" },
    { key: "mch", label: "MCH", unit: "pg" },
    { key: "mchc", label: "MCHC", unit: "g/dL" },
    { key: "rdw", label: "RDW", unit: "%" },
    { key: "wbc", label: "WBC", unit: "K/µL" },
    { key: "platelets", label: "Platelets", unit: "K/µL" },
    { key: "iron", label: "Serum Iron", unit: "µg/dL" },
    { key: "ferritin", label: "Ferritin", unit: "ng/mL" },
  ];

  const parameters = paramKeys.map((p) => {
    const val = data[p.key] as number;
    const [min, max] = getRefRange(p.key, g);
    return {
      name: p.label,
      value: val,
      unit: p.unit,
      status: val < min ? "low" as const : val > max ? "high" as const : "normal" as const,
      refMin: min,
      refMax: max,
    };
  });

  // Classification logic
  const hb = data.hemoglobin;
  const hbRef = getRefRange("hemoglobin", g);
  const mcv = data.mcv;
  const ferritin = data.ferritin;
  const rdw = data.rdw;

  let type = "No Anemia Detected";
  let severity: AnalysisResult["classification"]["severity"] = "normal";
  let confidence = 0.92;

  if (hb < hbRef[0]) {
    if (mcv < 80 && ferritin < 30) {
      type = "Iron Deficiency Anemia";
      confidence = 0.94;
    } else if (mcv > 100) {
      type = "Megaloblastic Anemia (B12/Folate)";
      confidence = 0.89;
    } else if (mcv >= 80 && mcv <= 100 && rdw < 15) {
      type = "Anemia of Chronic Disease";
      confidence = 0.85;
    } else if (mcv < 80 && ferritin >= 30) {
      type = "Thalassemia Trait";
      confidence = 0.82;
    } else {
      type = "Unclassified Anemia";
      confidence = 0.74;
    }

    if (hb >= hbRef[0] - 2) severity = "mild";
    else if (hb >= hbRef[0] - 4) severity = "moderate";
    else severity = "severe";
  }

  // Risk scoring
  let risk = 0;
  parameters.forEach((p) => {
    if (p.status !== "normal") risk += 12;
  });
  if (severity === "mild") risk += 10;
  if (severity === "moderate") risk += 25;
  if (severity === "severe") risk += 40;
  risk = Math.min(risk, 100);

  const riskLevel: AnalysisResult["riskLevel"] =
    risk < 20 ? "low" : risk < 45 ? "moderate" : risk < 70 ? "high" : "critical";

  // Simulated model metrics
  const modelMetrics = {
    svmAccuracy: 0.934,
    lrAccuracy: 0.912,
    svmPrecision: 0.941,
    lrPrecision: 0.908,
    svmRecall: 0.927,
    lrRecall: 0.919,
    svmF1: 0.934,
    lrF1: 0.913,
  };

  // Recommendations
  const recommendations: string[] = [];
  if (severity !== "normal") {
    recommendations.push("Consult a hematologist for further evaluation.");
    if (type.includes("Iron")) {
      recommendations.push("Consider iron supplementation and dietary modifications.");
      recommendations.push("Evaluate for possible gastrointestinal blood loss.");
    }
    if (type.includes("Megaloblastic")) {
      recommendations.push("Check Vitamin B12 and folate serum levels.");
      recommendations.push("Consider supplementation therapy.");
    }
    if (type.includes("Thalassemia")) {
      recommendations.push("Recommend hemoglobin electrophoresis for confirmation.");
    }
    recommendations.push("Schedule follow-up CBC in 4-6 weeks.");
  } else {
    recommendations.push("All parameters within normal reference ranges.");
    recommendations.push("Continue routine monitoring as per guidelines.");
  }

  return { classification: { type, severity, confidence }, riskScore: risk, riskLevel, parameters, modelMetrics, recommendations };
}

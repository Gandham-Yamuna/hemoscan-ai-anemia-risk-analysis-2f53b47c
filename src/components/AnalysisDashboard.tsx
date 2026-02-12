import { AnalysisResult } from "@/lib/anemiaAnalysis";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle, Info, XCircle, ArrowLeft, Activity, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend,
} from "recharts";
import AIInsightsPanel from "@/components/AIInsightsPanel";
import AdvancedCharts from "@/components/AdvancedCharts";
import DietPlanPanel from "@/components/DietPlanPanel";
import type { CBCData } from "@/components/CBCInputForm";

interface AnalysisDashboardProps {
  result: AnalysisResult;
  cbcData: CBCData;
  onBack: () => void;
}

const severityConfig = {
  normal: { color: "text-healthy", bg: "bg-healthy/10 border-healthy/30", icon: CheckCircle, label: "Normal" },
  mild: { color: "text-warning", bg: "bg-warning/10 border-warning/30", icon: Info, label: "Mild" },
  moderate: { color: "text-primary", bg: "bg-primary/10 border-primary/30", icon: AlertTriangle, label: "Moderate" },
  severe: { color: "text-destructive", bg: "bg-destructive/10 border-destructive/30", icon: XCircle, label: "Severe" },
};

const riskConfig = {
  low: { color: "text-healthy" },
  moderate: { color: "text-warning" },
  high: { color: "text-primary" },
  critical: { color: "text-destructive" },
};

const AnalysisDashboard = ({ result, cbcData, onBack }: AnalysisDashboardProps) => {
  const sev = severityConfig[result.classification.severity];
  const SevIcon = sev.icon;
  const rsk = riskConfig[result.riskLevel];

  const modelCompare = [
    { metric: "Accuracy", SVM: +(result.modelMetrics.svmAccuracy * 100).toFixed(1), LR: +(result.modelMetrics.lrAccuracy * 100).toFixed(1) },
    { metric: "Precision", SVM: +(result.modelMetrics.svmPrecision * 100).toFixed(1), LR: +(result.modelMetrics.lrPrecision * 100).toFixed(1) },
    { metric: "Recall", SVM: +(result.modelMetrics.svmRecall * 100).toFixed(1), LR: +(result.modelMetrics.lrRecall * 100).toFixed(1) },
    { metric: "F1 Score", SVM: +(result.modelMetrics.svmF1 * 100).toFixed(1), LR: +(result.modelMetrics.lrF1 * 100).toFixed(1) },
  ];

  const radarData = result.parameters.slice(0, 7).map((p) => {
    const range = p.refMax - p.refMin;
    const mid = (p.refMin + p.refMax) / 2;
    const normalized = Math.max(0, Math.min(100, ((p.value - mid) / (range || 1)) * 50 + 50));
    return { param: p.name, value: normalized, ref: 50 };
  });

  return (
    <section className="py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <Button variant="ghost" onClick={onBack} className="mb-6 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Input
        </Button>

        {/* Classification Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`border rounded-2xl p-8 mb-8 ${sev.bg}`}
        >
          <div className="flex items-start gap-4">
            <SevIcon className={`w-10 h-10 ${sev.color} shrink-0 mt-1`} />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h2 className="text-2xl font-bold text-foreground">{result.classification.type}</h2>
                <Badge variant="outline" className={`${sev.color} border-current`}>{sev.label}</Badge>
              </div>
              <p className="text-muted-foreground text-sm">
                Model confidence: <span className="font-mono font-semibold text-foreground">{(result.classification.confidence * 100).toFixed(1)}%</span>
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Risk Score */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-gradient-card border border-border rounded-2xl p-6 shadow-card"
          >
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Risk Score</h3>
            <div className="text-center mb-4">
              <span className={`text-5xl font-black font-mono ${rsk.color}`}>{result.riskScore}</span>
              <span className="text-muted-foreground text-lg">/100</span>
            </div>
            <Progress value={result.riskScore} className="h-2 mb-2" />
            <p className={`text-center text-sm font-semibold uppercase ${rsk.color}`}>{result.riskLevel} Risk</p>
          </motion.div>

          {/* Model Performance */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-gradient-card border border-border rounded-2xl p-6 shadow-card"
          >
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Model Performance</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={modelCompare} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 18%)" />
                <XAxis dataKey="metric" tick={{ fill: "hsl(215 20% 55%)", fontSize: 12 }} />
                <YAxis domain={[80, 100]} tick={{ fill: "hsl(215 20% 55%)", fontSize: 12 }} />
                <Tooltip contentStyle={{ background: "hsl(222 47% 9%)", border: "1px solid hsl(222 30% 18%)", borderRadius: 8 }} />
                <Bar dataKey="SVM" fill="hsl(0 72% 51%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="LR" fill="hsl(170 60% 45%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* AI Insights */}
        <div className="mb-8">
          <AIInsightsPanel cbcData={cbcData} result={result} />
        </div>

        {/* Advanced Charts */}
        <div className="mb-8">
          <AdvancedCharts />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Parameter Table */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="bg-gradient-card border border-border rounded-2xl p-6 shadow-card"
          >
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">CBC Parameters</h3>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {result.parameters.map((p) => (
                <div key={p.name} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div>
                    <span className="text-sm text-foreground font-medium">{p.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">({p.refMin}–{p.refMax} {p.unit})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-semibold text-foreground">{p.value} {p.unit}</span>
                    <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${
                      p.status === "normal" ? "text-healthy bg-healthy/10" : p.status === "low" ? "text-primary bg-primary/10" : "text-warning bg-warning/10"
                    }`}>{p.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Radar Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="bg-gradient-card border border-border rounded-2xl p-6 shadow-card"
          >
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Parameter Distribution</h3>
            <ResponsiveContainer width="100%" height={340}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(222 30% 18%)" />
                <PolarAngleAxis dataKey="param" tick={{ fill: "hsl(215 20% 55%)", fontSize: 10 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Patient" dataKey="value" stroke="hsl(0 72% 51%)" fill="hsl(0 72% 51%)" fillOpacity={0.2} />
                <Radar name="Reference" dataKey="ref" stroke="hsl(170 60% 45%)" fill="hsl(170 60% 45%)" fillOpacity={0.1} strokeDasharray="4 4" />
                <Legend wrapperStyle={{ fontSize: 12, color: "hsl(215 20% 55%)" }} />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Recommendations */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="bg-gradient-card border border-border rounded-2xl p-6 shadow-card"
        >
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            Clinical Recommendations
          </h3>
          <ul className="space-y-3">
            {result.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-foreground/90">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                {rec}
              </li>
            ))}
          </ul>
          <div className="mt-6 p-4 rounded-xl bg-secondary/50 border border-border">
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">Disclaimer:</strong> This analysis is for educational and decision-support purposes only. Always consult a qualified healthcare professional.
            </p>
          </div>
        </motion.div>

        {/* Diet Plan - shows only when risk detected */}
        <div className="mt-8">
          <DietPlanPanel result={result} />
        </div>
      </div>
    </section>
  );
};

export default AnalysisDashboard;

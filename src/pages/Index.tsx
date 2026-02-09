import { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CBCInputForm, { type CBCData } from "@/components/CBCInputForm";
import AnalysisDashboard from "@/components/AnalysisDashboard";
import { analyzeBloodData, type AnalysisResult } from "@/lib/anemiaAnalysis";

const Index = () => {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const analysisRef = useRef<HTMLDivElement>(null);

  const handleStartAnalysis = () => {
    document.getElementById("analysis")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleAnalyze = (data: CBCData) => {
    const res = analyzeBloodData(data);
    setResult(res);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {result ? (
        <div className="pt-16">
          <AnalysisDashboard result={result} onBack={() => setResult(null)} />
        </div>
      ) : (
        <>
          <HeroSection onStartAnalysis={handleStartAnalysis} />
          <div ref={analysisRef}>
            <CBCInputForm onAnalyze={handleAnalyze} />
          </div>
        </>
      )}
    </div>
  );
};

export default Index;

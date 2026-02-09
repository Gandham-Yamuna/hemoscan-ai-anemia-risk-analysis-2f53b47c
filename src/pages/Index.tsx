import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CBCInputForm, { type CBCData } from "@/components/CBCInputForm";
import AnalysisDashboard from "@/components/AnalysisDashboard";
import SamplePatientPicker from "@/components/SamplePatientPicker";
import TechStackSection from "@/components/TechStackSection";
import AnalysisHistory, { saveToHistory } from "@/components/AnalysisHistory";
import { analyzeBloodData, type AnalysisResult } from "@/lib/anemiaAnalysis";

const Index = () => {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [cbcData, setCbcData] = useState<CBCData | null>(null);

  const handleStartAnalysis = () => {
    document.getElementById("samples")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleAnalyze = (data: CBCData) => {
    const res = analyzeBloodData(data);
    setCbcData(data);
    setResult(res);
    saveToHistory(data, res);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLoadHistory = (data: CBCData, res: AnalysisResult) => {
    setCbcData(data);
    setResult(res);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSampleSelect = (data: CBCData) => {
    handleAnalyze(data);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <AnimatePresence mode="wait">
        {result && cbcData ? (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pt-16"
          >
            <AnalysisDashboard result={result} cbcData={cbcData} onBack={() => { setResult(null); setCbcData(null); }} />
          </motion.div>
        ) : (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <HeroSection onStartAnalysis={handleStartAnalysis} />
            <div id="samples">
              <SamplePatientPicker onSelect={handleSampleSelect} />
            </div>
            <AnalysisHistory onLoad={handleLoadHistory} />
            <CBCInputForm onAnalyze={handleAnalyze} />
            <div id="tech">
              <TechStackSection />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;

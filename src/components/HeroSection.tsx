import { Activity, Brain, Shield, TrendingUp, Dna, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import BloodCellParticles from "@/components/BloodCellParticles";
import heroBg from "@/assets/hero-bg.jpg";

const features = [
  { icon: Activity, label: "CBC Analysis", desc: "Complete blood count parameter evaluation with reference ranges" },
  { icon: Brain, label: "AI Classification", desc: "SVM & Logistic Regression powered anemia detection" },
  { icon: Shield, label: "Risk Assessment", desc: "Multi-factor scoring with clinical recommendations" },
  { icon: TrendingUp, label: "Prediction Accuracy", desc: "ROC curves, confusion matrix & model comparison" },
  { icon: Dna, label: "AI Clinical Insights", desc: "Real-time AI-generated medical interpretation" },
  { icon: Zap, label: "6 Sample Cases", desc: "Pre-loaded patient data for instant demo" },
];

interface HeroSectionProps {
  onStartAnalysis: () => void;
}

const HeroSection = ({ onStartAnalysis }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-hero" />
      </div>

      <BloodCellParticles />

      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-accent/5 blur-[100px] animate-pulse-slow" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 mb-8">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-primary-foreground/80">AI-Powered Hematology Analysis</span>
          </div>

          <h1 className="text-5xl md:text-8xl font-black tracking-tight mb-6 leading-[1.05]">
            <span className="text-foreground">Hemo</span>
            <span className="text-gradient-primary">Scan</span>
            <span className="text-foreground"> AI</span>
          </h1>

          <p className="text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-4 font-light">
            Anemia Detection & Risk Analysis System
          </p>
          <p className="text-sm text-muted-foreground/70 max-w-xl mx-auto mb-10">
            Leveraging SVM & Logistic Regression models with real-time AI clinical insights
            for accurate anemia classification, risk assessment, and medical decision support.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-20"
        >
          <Button
            size="lg"
            onClick={onStartAnalysis}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow px-10 py-7 text-lg font-semibold"
          >
            <Activity className="w-5 h-5 mr-2" />
            Start Analysis
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => document.getElementById("tech")?.scrollIntoView({ behavior: "smooth" })}
            className="border-border hover:bg-secondary text-foreground px-10 py-7 text-lg"
          >
            View ML Pipeline
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.08 }}
              className="bg-gradient-card border border-border rounded-xl p-5 text-left shadow-card hover:border-primary/30 transition-colors duration-300"
            >
              <f.icon className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold text-foreground text-sm mb-1">{f.label}</h3>
              <p className="text-xs text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-16 flex flex-wrap justify-center gap-8 text-center"
        >
          {[
            { value: "93.4%", label: "SVM Accuracy" },
            { value: "91.2%", label: "LR Accuracy" },
            { value: "0.967", label: "ROC-AUC" },
            { value: "6", label: "Anemia Types" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-2xl md:text-3xl font-black font-mono text-gradient-primary">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;

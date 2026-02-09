import { Activity, Brain, Shield, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

const features = [
  { icon: Activity, label: "CBC Analysis", desc: "Complete blood count parameter evaluation" },
  { icon: Brain, label: "AI Classification", desc: "SVM & Logistic Regression models" },
  { icon: Shield, label: "Risk Assessment", desc: "Multi-factor anemia risk scoring" },
  { icon: TrendingUp, label: "Prediction Accuracy", desc: "Model performance evaluation" },
];

interface HeroSectionProps {
  onStartAnalysis: () => void;
}

const HeroSection = ({ onStartAnalysis }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-hero" />
      </div>

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-accent/5 blur-[100px] animate-pulse-slow" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 mb-8">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm font-medium text-primary-foreground/80">AI-Powered Hematology Analysis</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[1.1]">
          <span className="text-foreground">Hemo</span>
          <span className="text-gradient-primary">Scan</span>
          <span className="text-foreground"> AI</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
          Anemia Detection & Risk Analysis System
        </p>
        <p className="text-sm text-muted-foreground/70 max-w-xl mx-auto mb-10">
          Leveraging SVM & Logistic Regression models trained on CBC data for accurate anemia classification,
          risk assessment, and medical decision support.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
          <Button
            size="lg"
            onClick={onStartAnalysis}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow px-8 py-6 text-base font-semibold"
          >
            <Activity className="w-5 h-5 mr-2" />
            Start Analysis
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-border hover:bg-secondary text-foreground px-8 py-6 text-base"
          >
            View Documentation
          </Button>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f) => (
            <div
              key={f.label}
              className="bg-gradient-card border border-border rounded-xl p-5 text-left shadow-card hover:border-primary/30 transition-colors duration-300"
            >
              <f.icon className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold text-foreground text-sm mb-1">{f.label}</h3>
              <p className="text-xs text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

import { motion } from "framer-motion";
import { Code2, Database, Brain, BarChart3, Shield, Cpu } from "lucide-react";

const stack = [
  { icon: Code2, name: "Python", desc: "Core ML pipeline & data preprocessing", color: "text-info" },
  { icon: Database, name: "Pandas & NumPy", desc: "Data manipulation & numerical computing", color: "text-accent" },
  { icon: Brain, name: "Scikit-learn", desc: "ML model training & evaluation", color: "text-primary" },
  { icon: Cpu, name: "SVM Classifier", desc: "Support Vector Machine with RBF kernel", color: "text-warning" },
  { icon: BarChart3, name: "Logistic Regression", desc: "Probabilistic binary/multi-class classification", color: "text-accent" },
  { icon: Shield, name: "Cross-Validation", desc: "K-fold CV for robust model evaluation", color: "text-primary" },
];

const pipeline = [
  { step: "01", title: "Data Collection", desc: "CBC samples from clinical datasets" },
  { step: "02", title: "Preprocessing", desc: "Normalization, outlier removal, feature scaling" },
  { step: "03", title: "Feature Engineering", desc: "RBC indices, iron panel ratios, derived features" },
  { step: "04", title: "Model Training", desc: "SVM & Logistic Regression with hyperparameter tuning" },
  { step: "05", title: "Evaluation", desc: "ROC-AUC, precision, recall, confusion matrix" },
  { step: "06", title: "Deployment", desc: "Real-time inference via React + AI gateway" },
];

const TechStackSection = () => (
  <section className="py-20 px-6">
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Technology & ML Pipeline</h2>
        <p className="text-muted-foreground">Built with cutting-edge machine learning and web technologies</p>
      </motion.div>

      {/* Tech stack grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
        {stack.map((s, i) => (
          <motion.div
            key={s.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="bg-gradient-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors"
          >
            <s.icon className={`w-8 h-8 ${s.color} mb-3`} />
            <h3 className="font-semibold text-foreground mb-1">{s.name}</h3>
            <p className="text-xs text-muted-foreground">{s.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Pipeline */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <h3 className="text-xl font-bold text-foreground mb-8 text-center">ML Pipeline</h3>
        <div className="relative">
          {/* Connection line */}
          <div className="absolute top-0 bottom-0 left-[29px] w-px bg-border hidden md:block" />
          <div className="space-y-4">
            {pipeline.map((p, i) => (
              <motion.div
                key={p.step}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-5"
              >
                <div className="w-[60px] h-[60px] rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
                  <span className="text-lg font-black font-mono text-primary">{p.step}</span>
                </div>
                <div className="pt-2">
                  <h4 className="font-semibold text-foreground text-sm">{p.title}</h4>
                  <p className="text-xs text-muted-foreground">{p.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default TechStackSection;

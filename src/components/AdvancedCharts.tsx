import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, ZAxis, Cell, PieChart, Pie } from "recharts";

// Simulated ROC curve data
const rocData = Array.from({ length: 50 }, (_, i) => {
  const x = i / 49;
  const svmY = Math.min(1, Math.pow(x, 0.35));
  const lrY = Math.min(1, Math.pow(x, 0.45));
  return { fpr: +(x * 100).toFixed(1), SVM: +(svmY * 100).toFixed(1), LR: +(lrY * 100).toFixed(1), random: +(x * 100).toFixed(1) };
});

// Confusion matrix data
const confusionMatrix = {
  svm: { tp: 187, fp: 11, fn: 14, tn: 188 },
  lr: { tp: 179, fp: 17, fn: 16, tn: 188 },
};

// Feature importance
const featureImportance = [
  { feature: "Hemoglobin", importance: 95 },
  { feature: "MCV", importance: 88 },
  { feature: "Ferritin", importance: 82 },
  { feature: "RDW", importance: 75 },
  { feature: "MCH", importance: 70 },
  { feature: "Iron", importance: 65 },
  { feature: "MCHC", importance: 58 },
  { feature: "Hematocrit", importance: 52 },
];

const COLORS = ["hsl(170, 60%, 45%)", "hsl(0, 72%, 51%)", "hsl(38, 92%, 50%)", "hsl(217, 91%, 60%)"];

const ConfusionCell = ({ value, label, color }: { value: number; label: string; color: string }) => (
  <div className={`p-4 rounded-lg text-center ${color}`}>
    <div className="text-2xl font-black font-mono">{value}</div>
    <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">{label}</div>
  </div>
);

const AdvancedCharts = () => {
  const svmPie = [
    { name: "Correct", value: confusionMatrix.svm.tp + confusionMatrix.svm.tn },
    { name: "Errors", value: confusionMatrix.svm.fp + confusionMatrix.svm.fn },
  ];

  return (
    <div className="space-y-6">
      {/* ROC Curve */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-card border border-border rounded-2xl p-6 shadow-card"
      >
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
          ROC Curve — Model Comparison
        </h3>
        <div className="flex items-center gap-4 mb-2 text-xs text-muted-foreground">
          <span>SVM AUC: <strong className="text-primary font-mono">0.967</strong></span>
          <span>LR AUC: <strong className="text-accent font-mono">0.943</strong></span>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={rocData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
            <XAxis dataKey="fpr" label={{ value: "False Positive Rate (%)", position: "bottom", fill: "hsl(215,20%,55%)", fontSize: 11 }} tick={{ fill: "hsl(215,20%,55%)", fontSize: 10 }} />
            <YAxis label={{ value: "True Positive Rate (%)", angle: -90, position: "insideLeft", fill: "hsl(215,20%,55%)", fontSize: 11 }} tick={{ fill: "hsl(215,20%,55%)", fontSize: 10 }} />
            <Tooltip contentStyle={{ background: "hsl(222,47%,9%)", border: "1px solid hsl(222,30%,18%)", borderRadius: 8 }} />
            <Area type="monotone" dataKey="SVM" stroke="hsl(0,72%,51%)" fill="hsl(0,72%,51%)" fillOpacity={0.15} strokeWidth={2} />
            <Area type="monotone" dataKey="LR" stroke="hsl(170,60%,45%)" fill="hsl(170,60%,45%)" fillOpacity={0.1} strokeWidth={2} />
            <Area type="monotone" dataKey="random" stroke="hsl(215,20%,35%)" fill="none" strokeDasharray="5 5" strokeWidth={1} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Confusion Matrix */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-card border border-border rounded-2xl p-6 shadow-card"
        >
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
            Confusion Matrix — SVM
          </h3>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <ConfusionCell value={confusionMatrix.svm.tp} label="True Positive" color="bg-healthy/10" />
            <ConfusionCell value={confusionMatrix.svm.fp} label="False Positive" color="bg-destructive/10" />
            <ConfusionCell value={confusionMatrix.svm.fn} label="False Negative" color="bg-warning/10" />
            <ConfusionCell value={confusionMatrix.svm.tn} label="True Negative" color="bg-healthy/10" />
          </div>
          <div className="flex justify-center">
            <ResponsiveContainer width={140} height={140}>
              <PieChart>
                <Pie data={svmPie} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value" strokeWidth={0}>
                  {svmPie.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? "hsl(170,60%,45%)" : "hsl(0,72%,51%)"} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="text-center text-xs text-muted-foreground">
            Overall Accuracy: <span className="font-mono font-bold text-foreground">93.75%</span>
          </p>
        </motion.div>

        {/* Feature Importance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-card border border-border rounded-2xl p-6 shadow-card"
        >
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
            Feature Importance — SVM Model
          </h3>
          <div className="space-y-3">
            {featureImportance.map((f, i) => (
              <div key={f.feature} className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-20 text-right">{f.feature}</span>
                <div className="flex-1 h-5 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${f.importance}%` }}
                    transition={{ delay: 0.3 + i * 0.05, duration: 0.6 }}
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, hsl(0,72%,51%), hsl(350,80%,${40 + (100 - f.importance) * 0.3}%))`,
                    }}
                  />
                </div>
                <span className="text-xs font-mono font-bold text-foreground w-8">{f.importance}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdvancedCharts;

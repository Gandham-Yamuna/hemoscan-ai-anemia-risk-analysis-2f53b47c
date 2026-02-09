import { motion } from "framer-motion";
import { samplePatients } from "@/lib/sampleData";
import type { CBCData } from "@/components/CBCInputForm";
import { User, Beaker } from "lucide-react";

interface SamplePatientPickerProps {
  onSelect: (data: CBCData) => void;
}

const severityColors: Record<string, string> = {
  "No Anemia": "border-healthy/40 bg-healthy/5",
  "Iron Deficiency Anemia": "border-primary/40 bg-primary/5",
  "Megaloblastic Anemia": "border-warning/40 bg-warning/5",
  "Thalassemia Minor": "border-info/40 bg-info/5",
  "Anemia of Chronic Disease": "border-warning/40 bg-warning/5",
  "Severe Iron Deficiency": "border-destructive/40 bg-destructive/5",
};

const SamplePatientPicker = ({ onSelect }: SamplePatientPickerProps) => {
  return (
    <section className="py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/30 bg-accent/10 mb-4">
            <Beaker className="w-3 h-3 text-accent" />
            <span className="text-xs font-medium text-accent">Demo Mode</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Sample Patient Cases</h2>
          <p className="text-sm text-muted-foreground">Select a pre-configured case to see the analysis in action</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {samplePatients.map((p, i) => (
            <motion.button
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => onSelect(p.data)}
              className={`text-left p-5 rounded-xl border ${severityColors[p.condition] || "border-border bg-card"} hover:scale-[1.02] transition-transform cursor-pointer`}
            >
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-semibold text-foreground">{p.name}</span>
              </div>
              <span className="text-xs font-mono font-bold text-primary">{p.condition}</span>
              <p className="text-xs text-muted-foreground mt-1">{p.description}</p>
              <div className="flex gap-3 mt-3 text-[10px] text-muted-foreground font-mono">
                <span>Hb: {p.data.hemoglobin}</span>
                <span>MCV: {p.data.mcv}</span>
                <span>Fer: {p.data.ferritin}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SamplePatientPicker;

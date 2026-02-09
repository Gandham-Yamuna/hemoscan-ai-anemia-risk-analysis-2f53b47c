import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, RotateCcw } from "lucide-react";

export interface CBCData {
  hemoglobin: number;
  hematocrit: number;
  rbc: number;
  mcv: number;
  mch: number;
  mchc: number;
  rdw: number;
  wbc: number;
  platelets: number;
  iron: number;
  ferritin: number;
  gender: "male" | "female";
  age: number;
}

interface CBCInputFormProps {
  onAnalyze: (data: CBCData) => void;
}

const defaultData: CBCData = {
  hemoglobin: 12.5,
  hematocrit: 37.5,
  rbc: 4.5,
  mcv: 82,
  mch: 27,
  mchc: 33,
  rdw: 13.5,
  wbc: 7.0,
  platelets: 250,
  iron: 70,
  ferritin: 50,
  gender: "female",
  age: 35,
};

const fields: { key: keyof CBCData; label: string; unit: string; min: number; max: number; step: number }[] = [
  { key: "hemoglobin", label: "Hemoglobin (Hb)", unit: "g/dL", min: 3, max: 20, step: 0.1 },
  { key: "hematocrit", label: "Hematocrit (Hct)", unit: "%", min: 10, max: 60, step: 0.1 },
  { key: "rbc", label: "RBC Count", unit: "M/µL", min: 1, max: 8, step: 0.1 },
  { key: "mcv", label: "MCV", unit: "fL", min: 50, max: 120, step: 0.1 },
  { key: "mch", label: "MCH", unit: "pg", min: 15, max: 40, step: 0.1 },
  { key: "mchc", label: "MCHC", unit: "g/dL", min: 25, max: 40, step: 0.1 },
  { key: "rdw", label: "RDW", unit: "%", min: 10, max: 25, step: 0.1 },
  { key: "wbc", label: "WBC Count", unit: "K/µL", min: 1, max: 30, step: 0.1 },
  { key: "platelets", label: "Platelet Count", unit: "K/µL", min: 50, max: 600, step: 1 },
  { key: "iron", label: "Serum Iron", unit: "µg/dL", min: 10, max: 200, step: 1 },
  { key: "ferritin", label: "Ferritin", unit: "ng/mL", min: 5, max: 500, step: 1 },
];

const CBCInputForm = ({ onAnalyze }: CBCInputFormProps) => {
  const [data, setData] = useState<CBCData>(defaultData);

  const update = (key: keyof CBCData, value: string | number) => {
    setData((prev) => ({ ...prev, [key]: typeof prev[key] === "number" ? Number(value) : value }));
  };

  return (
    <section id="analysis" className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">CBC Data Input</h2>
          <p className="text-muted-foreground">Enter complete blood count parameters for analysis</p>
        </div>

        <div className="bg-gradient-card border border-border rounded-2xl p-8 shadow-card">
          {/* Demographics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 pb-8 border-b border-border">
            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs uppercase tracking-wider">Gender</Label>
              <Select value={data.gender} onValueChange={(v) => update("gender", v)}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs uppercase tracking-wider">Age</Label>
              <Input
                type="number"
                value={data.age}
                onChange={(e) => update("age", e.target.value)}
                className="bg-secondary border-border"
                min={1}
                max={120}
              />
            </div>
          </div>

          {/* CBC Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {fields.map((f) => (
              <div key={f.key} className="space-y-2">
                <Label className="text-muted-foreground text-xs uppercase tracking-wider">
                  {f.label}
                  <span className="text-muted-foreground/50 ml-1">({f.unit})</span>
                </Label>
                <Input
                  type="number"
                  value={data[f.key] as number}
                  onChange={(e) => update(f.key, e.target.value)}
                  className="bg-secondary border-border font-mono"
                  min={f.min}
                  max={f.max}
                  step={f.step}
                />
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-4 mt-10 justify-end">
            <Button
              variant="outline"
              onClick={() => setData(defaultData)}
              className="border-border text-muted-foreground hover:bg-secondary"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button
              onClick={() => onAnalyze(data)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow px-8"
            >
              Run Analysis
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CBCInputForm;

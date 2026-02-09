import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, Trash2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AnalysisResult } from "@/lib/anemiaAnalysis";
import type { CBCData } from "@/components/CBCInputForm";

interface HistoryEntry {
  id: string;
  timestamp: number;
  cbcData: CBCData;
  result: AnalysisResult;
}

interface AnalysisHistoryProps {
  onLoad: (data: CBCData, result: AnalysisResult) => void;
}

const STORAGE_KEY = "hemoscan-history";

export function saveToHistory(cbcData: CBCData, result: AnalysisResult) {
  const history = getHistory();
  const entry: HistoryEntry = {
    id: Date.now().toString(),
    timestamp: Date.now(),
    cbcData,
    result,
  };
  history.unshift(entry);
  if (history.length > 10) history.pop();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

function getHistory(): HistoryEntry[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

const riskColors: Record<string, string> = {
  low: "text-healthy",
  moderate: "text-warning",
  high: "text-primary",
  critical: "text-destructive",
};

const AnalysisHistory = ({ onLoad }: AnalysisHistoryProps) => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const clear = () => {
    localStorage.removeItem(STORAGE_KEY);
    setHistory([]);
  };

  if (history.length === 0) return null;

  return (
    <div className="px-6">
      <div className="max-w-5xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => setOpen(!open)}
          className="text-muted-foreground hover:text-foreground mb-2"
        >
          <History className="w-4 h-4 mr-2" />
          Analysis History ({history.length})
        </Button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-gradient-card border border-border rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Recent Analyses</span>
                  <Button variant="ghost" size="sm" onClick={clear} className="text-destructive hover:text-destructive/80 h-7 text-xs">
                    <Trash2 className="w-3 h-3 mr-1" /> Clear
                  </Button>
                </div>
                <div className="space-y-2">
                  {history.map((entry) => (
                    <button
                      key={entry.id}
                      onClick={() => onLoad(entry.cbcData, entry.result)}
                      className="w-full text-left p-3 rounded-lg bg-secondary/50 hover:bg-secondary border border-transparent hover:border-border transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">{entry.result.classification.type}</span>
                        <span className={`text-xs font-bold uppercase ${riskColors[entry.result.riskLevel]}`}>
                          {entry.result.riskLevel}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {new Date(entry.timestamp).toLocaleString()}
                        <span className="font-mono">Hb: {entry.cbcData.hemoglobin}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AnalysisHistory;

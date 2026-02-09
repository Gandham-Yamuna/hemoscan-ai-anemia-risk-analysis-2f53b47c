import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CBCData } from "@/components/CBCInputForm";
import type { AnalysisResult } from "@/lib/anemiaAnalysis";

interface AIInsightsPanelProps {
  cbcData: CBCData;
  result: AnalysisResult;
}

const AIInsightsPanel = ({ cbcData, result }: AIInsightsPanelProps) => {
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);

  const fetchInsights = async () => {
    setLoading(true);
    setStarted(true);
    setInsight("");

    const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-insights`;

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          cbcData,
          classification: result.classification.type,
          riskLevel: result.riskLevel,
          riskScore: result.riskScore,
        }),
      });

      if (!resp.ok || !resp.body) {
        if (resp.status === 429) {
          setInsight("⚠️ Rate limit exceeded. Please try again in a moment.");
          setLoading(false);
          return;
        }
        if (resp.status === 402) {
          setInsight("⚠️ AI credits exhausted. Please add credits to continue.");
          setLoading(false);
          return;
        }
        throw new Error("Failed to start AI stream");
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              fullText += content;
              setInsight(fullText);
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch (e) {
      console.error(e);
      setInsight("Failed to generate AI insights. Please try again.");
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-card border border-border rounded-2xl p-6 shadow-card"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <Brain className="w-4 h-4 text-primary" />
          AI Clinical Insights
          <span className="px-2 py-0.5 text-[10px] font-bold bg-primary/20 text-primary rounded-full">POWERED BY AI</span>
        </h3>
        {!started && (
          <Button
            onClick={fetchInsights}
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow"
          >
            <Sparkles className="w-3 h-3 mr-1" />
            Generate Insights
          </Button>
        )}
      </div>

      <AnimatePresence>
        {started && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="prose prose-invert prose-sm max-w-none"
          >
            {loading && !insight && (
              <div className="flex items-center gap-2 text-muted-foreground py-8 justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                <span>Analyzing CBC data with AI...</span>
              </div>
            )}
            {insight && (
              <div className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                {insight}
                {loading && <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1" />}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!started && (
        <p className="text-xs text-muted-foreground">
          Click "Generate Insights" to get an AI-powered clinical interpretation of the CBC results, including differential diagnosis and treatment considerations.
        </p>
      )}
    </motion.div>
  );
};

export default AIInsightsPanel;

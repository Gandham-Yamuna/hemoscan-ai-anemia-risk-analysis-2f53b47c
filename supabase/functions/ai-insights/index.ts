import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { cbcData, classification, riskLevel, riskScore } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are a senior hematologist AI assistant specializing in anemia diagnosis. Given CBC (Complete Blood Count) data and a preliminary classification, provide:
1. A detailed clinical interpretation of the CBC results
2. Differential diagnosis considerations
3. Recommended follow-up tests
4. Treatment considerations based on the anemia type
5. Key risk factors and prognosis

Be specific, evidence-based, and use medical terminology appropriately. Format with clear headers using markdown. Keep response concise but thorough (max 400 words).`;

    const userPrompt = `Patient CBC Data:
- Hemoglobin: ${cbcData.hemoglobin} g/dL
- Hematocrit: ${cbcData.hematocrit}%
- RBC: ${cbcData.rbc} M/µL
- MCV: ${cbcData.mcv} fL
- MCH: ${cbcData.mch} pg
- MCHC: ${cbcData.mchc} g/dL
- RDW: ${cbcData.rdw}%
- WBC: ${cbcData.wbc} K/µL
- Platelets: ${cbcData.platelets} K/µL
- Serum Iron: ${cbcData.iron} µg/dL
- Ferritin: ${cbcData.ferritin} ng/mL
- Gender: ${cbcData.gender}, Age: ${cbcData.age}

Preliminary Classification: ${classification}
Risk Level: ${riskLevel} (Score: ${riskScore}/100)

Provide your expert clinical analysis.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI analysis failed" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("ai-insights error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

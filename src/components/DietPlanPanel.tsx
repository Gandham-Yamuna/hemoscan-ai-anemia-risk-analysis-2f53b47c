import { AnalysisResult } from "@/lib/anemiaAnalysis";
import { motion } from "framer-motion";
import { Apple, Leaf, Fish, Beef, Egg, GlassWater, Ban, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DietPlanPanelProps {
  result: AnalysisResult;
}

interface FoodItem {
  name: string;
  benefit: string;
  icon: React.ReactNode;
}

interface MealPlan {
  meal: string;
  items: string[];
}

function getDietPlan(type: string) {
  const plans: Record<string, {
    title: string;
    summary: string;
    foods: FoodItem[];
    avoid: string[];
    meals: MealPlan[];
    tips: string[];
  }> = {
    "Iron Deficiency Anemia": {
      title: "Iron-Rich Recovery Diet",
      summary: "Focus on heme iron sources paired with vitamin C to maximize absorption. Avoid calcium and tannins near iron-rich meals.",
      foods: [
        { name: "Red Meat & Liver", benefit: "Highest heme iron bioavailability (2-3mg per 100g)", icon: <Beef className="w-5 h-5 text-primary" /> },
        { name: "Spinach & Dark Greens", benefit: "Non-heme iron + folate for RBC production", icon: <Leaf className="w-5 h-5 text-healthy" /> },
        { name: "Lentils & Beans", benefit: "Plant-based iron (3.3mg per cup) + protein", icon: <Apple className="w-5 h-5 text-warning" /> },
        { name: "Eggs (especially yolks)", benefit: "Iron + B12 for hemoglobin synthesis", icon: <Egg className="w-5 h-5 text-warning" /> },
        { name: "Citrus Fruits", benefit: "Vitamin C enhances iron absorption by 67%", icon: <Apple className="w-5 h-5 text-primary" /> },
        { name: "Fortified Cereals", benefit: "Up to 18mg iron per serving", icon: <Apple className="w-5 h-5 text-accent-foreground" /> },
      ],
      avoid: ["Tea/coffee within 1hr of meals (tannins block iron)", "Excess dairy with iron meals (calcium competes)", "Processed foods low in nutrients", "Antacids near meal times"],
      meals: [
        { meal: "Breakfast", items: ["Fortified oatmeal with strawberries", "Orange juice (vitamin C boost)", "2 boiled eggs"] },
        { meal: "Lunch", items: ["Spinach salad with grilled chicken", "Lentil soup with lemon squeeze", "Whole grain bread"] },
        { meal: "Dinner", items: ["Lean beef stir-fry with bell peppers", "Brown rice", "Steamed broccoli"] },
        { meal: "Snacks", items: ["Dried apricots & pumpkin seeds", "Dark chocolate (70%+)", "Trail mix with nuts"] },
      ],
      tips: ["Pair iron foods with vitamin C sources", "Cook in cast iron cookware", "Space calcium supplements 2hrs from iron meals", "Soak beans/lentils to reduce phytates"],
    },
    "Megaloblastic Anemia (B12/Folate)": {
      title: "B12 & Folate Restoration Diet",
      summary: "Prioritize animal-based B12 sources and folate-rich vegetables. Consider supplementation if vegan/vegetarian.",
      foods: [
        { name: "Shellfish & Fish", benefit: "Clams provide 84µg B12 per 100g (3500% DV)", icon: <Fish className="w-5 h-5 text-primary" /> },
        { name: "Organ Meats (Liver)", benefit: "Richest natural B12 source + folate", icon: <Beef className="w-5 h-5 text-primary" /> },
        { name: "Fortified Nutritional Yeast", benefit: "Vegan B12 source (up to 17.6µg per tbsp)", icon: <Apple className="w-5 h-5 text-warning" /> },
        { name: "Asparagus & Broccoli", benefit: "High folate (134µg per cup asparagus)", icon: <Leaf className="w-5 h-5 text-healthy" /> },
        { name: "Eggs & Dairy", benefit: "Reliable B12 for vegetarians", icon: <Egg className="w-5 h-5 text-warning" /> },
        { name: "Leafy Greens", benefit: "Folate-dense for DNA synthesis", icon: <Leaf className="w-5 h-5 text-healthy" /> },
      ],
      avoid: ["Alcohol (depletes B12 & folate)", "Excessive cooking of vegetables (destroys folate)", "Processed grains (stripped of B vitamins)", "Smoking (impairs B12 absorption)"],
      meals: [
        { meal: "Breakfast", items: ["Scrambled eggs with cheese", "Fortified cereal with milk", "Glass of fortified orange juice"] },
        { meal: "Lunch", items: ["Grilled salmon salad", "Asparagus & avocado wrap", "Greek yogurt"] },
        { meal: "Dinner", items: ["Baked cod with lemon", "Steamed broccoli & spinach", "Quinoa pilaf"] },
        { meal: "Snacks", items: ["Fortified smoothie with nutritional yeast", "Cheese & whole grain crackers", "Edamame"] },
      ],
      tips: ["Get B12 levels checked every 3 months", "Consider sublingual B12 if absorption is poor", "Eat folate foods raw or lightly steamed", "Vegans must supplement B12"],
    },
    "Anemia of Chronic Disease": {
      title: "Anti-Inflammatory Nutrition Plan",
      summary: "Focus on anti-inflammatory foods to address underlying chronic inflammation. Support overall nutritional status.",
      foods: [
        { name: "Fatty Fish (Salmon, Sardines)", benefit: "Omega-3 reduces inflammation markers by 20%", icon: <Fish className="w-5 h-5 text-primary" /> },
        { name: "Turmeric & Ginger", benefit: "Curcumin has potent anti-inflammatory effects", icon: <Apple className="w-5 h-5 text-warning" /> },
        { name: "Berries & Cherries", benefit: "Anthocyanins combat oxidative stress", icon: <Apple className="w-5 h-5 text-primary" /> },
        { name: "Olive Oil (Extra Virgin)", benefit: "Oleocanthal mimics anti-inflammatory drugs", icon: <GlassWater className="w-5 h-5 text-healthy" /> },
        { name: "Nuts & Seeds", benefit: "Vitamin E + selenium for immune support", icon: <Apple className="w-5 h-5 text-accent-foreground" /> },
        { name: "Leafy Greens", benefit: "Antioxidants + micronutrients", icon: <Leaf className="w-5 h-5 text-healthy" /> },
      ],
      avoid: ["Refined sugars & processed foods", "Trans fats & fried foods", "Excess red meat (pro-inflammatory)", "Alcohol & sugary beverages"],
      meals: [
        { meal: "Breakfast", items: ["Berry smoothie with turmeric", "Chia seed pudding", "Green tea"] },
        { meal: "Lunch", items: ["Mediterranean salad with olive oil", "Grilled salmon", "Sweet potato"] },
        { meal: "Dinner", items: ["Anti-inflammatory soup (turmeric, ginger)", "Baked fish with herbs", "Steamed vegetables"] },
        { meal: "Snacks", items: ["Walnuts & almonds", "Fresh berries", "Ginger tea with honey"] },
      ],
      tips: ["Follow Mediterranean diet principles", "Stay well hydrated (8+ glasses/day)", "Include probiotics for gut health", "Manage stress — it worsens inflammation"],
    },
    "Thalassemia Trait": {
      title: "Thalassemia-Supportive Diet",
      summary: "Avoid excess iron (risk of overload) while supporting folate needs. Focus on antioxidants to combat oxidative stress.",
      foods: [
        { name: "Folate-Rich Greens", benefit: "Supports increased RBC turnover", icon: <Leaf className="w-5 h-5 text-healthy" /> },
        { name: "Whole Grains", benefit: "B vitamins without excess iron", icon: <Apple className="w-5 h-5 text-warning" /> },
        { name: "Tea (with meals)", benefit: "Tannins reduce iron absorption (beneficial here)", icon: <GlassWater className="w-5 h-5 text-primary" /> },
        { name: "Calcium-Rich Foods", benefit: "Dairy inhibits excess iron uptake", icon: <GlassWater className="w-5 h-5 text-accent-foreground" /> },
        { name: "Fruits & Vegetables", benefit: "Antioxidants to combat oxidative damage", icon: <Apple className="w-5 h-5 text-healthy" /> },
        { name: "Legumes & Nuts", benefit: "Protein + zinc for immune function", icon: <Apple className="w-5 h-5 text-warning" /> },
      ],
      avoid: ["Iron supplements (risk of iron overload)", "Excess red meat & organ meats", "Iron-fortified cereals", "Vitamin C supplements with meals (enhances iron)"],
      meals: [
        { meal: "Breakfast", items: ["Yogurt with granola & banana", "Tea with breakfast", "Whole grain toast"] },
        { meal: "Lunch", items: ["Chickpea & vegetable curry", "Brown rice", "Milk or cheese"] },
        { meal: "Dinner", items: ["Grilled chicken (moderate portions)", "Pasta with vegetable sauce", "Side salad with dairy dressing"] },
        { meal: "Snacks", items: ["Cheese & fruit", "Yogurt parfait", "Nuts & dried figs"] },
      ],
      tips: ["Do NOT take iron supplements", "Monitor ferritin levels regularly", "Folic acid supplementation may be needed", "Drink tea/coffee with meals to limit iron absorption"],
    },
  };

  return plans[type] || {
    title: "General Anemia Recovery Diet",
    summary: "A balanced, nutrient-dense diet to support blood health and recovery. Focus on iron, B12, folate, and vitamin C.",
    foods: [
      { name: "Lean Red Meat", benefit: "Best source of heme iron", icon: <Beef className="w-5 h-5 text-primary" /> },
      { name: "Dark Leafy Greens", benefit: "Iron + folate + vitamin K", icon: <Leaf className="w-5 h-5 text-healthy" /> },
      { name: "Fish & Seafood", benefit: "B12 + omega-3 fatty acids", icon: <Fish className="w-5 h-5 text-primary" /> },
      { name: "Eggs", benefit: "Complete protein + B12 + iron", icon: <Egg className="w-5 h-5 text-warning" /> },
      { name: "Citrus Fruits", benefit: "Vitamin C for iron absorption", icon: <Apple className="w-5 h-5 text-warning" /> },
      { name: "Water & Hydration", benefit: "Supports blood volume & circulation", icon: <GlassWater className="w-5 h-5 text-primary" /> },
    ],
    avoid: ["Excess caffeine near meals", "Processed & junk foods", "Alcohol", "Calcium supplements with iron-rich meals"],
    meals: [
      { meal: "Breakfast", items: ["Oatmeal with berries & eggs", "Orange juice", "Whole grain toast"] },
      { meal: "Lunch", items: ["Grilled chicken salad with spinach", "Lentil soup", "Whole wheat bread"] },
      { meal: "Dinner", items: ["Lean steak with broccoli", "Sweet potato", "Mixed vegetables"] },
      { meal: "Snacks", items: ["Trail mix", "Fresh fruit", "Yogurt"] },
    ],
    tips: ["Eat regular, balanced meals", "Combine iron + vitamin C foods", "Stay hydrated", "Follow up with your doctor"],
  };
}

const DietPlanPanel = ({ result }: DietPlanPanelProps) => {
  if (result.classification.severity === "normal") return null;

  const plan = getDietPlan(result.classification.type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-gradient-card border border-border rounded-2xl p-6 shadow-card"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-healthy/10 flex items-center justify-center">
          <Apple className="w-5 h-5 text-healthy" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">{plan.title}</h3>
          <p className="text-xs text-muted-foreground">Personalized for {result.classification.type}</p>
        </div>
        <Badge variant="outline" className="ml-auto text-healthy border-healthy/30">
          {result.riskLevel} risk
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{plan.summary}</p>

      <Tabs defaultValue="foods" className="w-full">
        <TabsList className="w-full grid grid-cols-4 bg-secondary/50">
          <TabsTrigger value="foods" className="text-xs">Top Foods</TabsTrigger>
          <TabsTrigger value="meals" className="text-xs">Meal Plan</TabsTrigger>
          <TabsTrigger value="avoid" className="text-xs">Avoid</TabsTrigger>
          <TabsTrigger value="tips" className="text-xs">Tips</TabsTrigger>
        </TabsList>

        <TabsContent value="foods">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {plan.foods.map((food, i) => (
              <motion.div
                key={food.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3 p-3 rounded-xl bg-secondary/30 border border-border/50"
              >
                <div className="w-8 h-8 rounded-lg bg-background/50 flex items-center justify-center shrink-0 mt-0.5">
                  {food.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{food.name}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{food.benefit}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="meals">
          <div className="space-y-4 mt-4">
            {plan.meals.map((meal, i) => (
              <motion.div
                key={meal.meal}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="p-4 rounded-xl bg-secondary/30 border border-border/50"
              >
                <h4 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">{i + 1}</span>
                  {meal.meal}
                </h4>
                <ul className="space-y-1">
                  {meal.items.map((item) => (
                    <li key={item} className="text-xs text-muted-foreground flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-healthy shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="avoid">
          <div className="space-y-2 mt-4">
            {plan.avoid.map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-destructive/5 border border-destructive/10"
              >
                <Ban className="w-4 h-4 text-destructive shrink-0" />
                <p className="text-sm text-foreground/90">{item}</p>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tips">
          <div className="space-y-2 mt-4">
            {plan.tips.map((tip, i) => (
              <motion.div
                key={tip}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3 p-3 rounded-xl bg-primary/5 border border-primary/10"
              >
                <AlertCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-foreground/90">{tip}</p>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-5 p-3 rounded-xl bg-secondary/30 border border-border/50">
        <p className="text-xs text-muted-foreground">
          <strong className="text-foreground">Note:</strong> This diet plan is AI-generated guidance based on your CBC results. Always consult a registered dietitian or physician before making dietary changes.
        </p>
      </div>
    </motion.div>
  );
};

export default DietPlanPanel;

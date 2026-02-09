import type { CBCData } from "@/components/CBCInputForm";

export interface SamplePatient {
  id: string;
  name: string;
  condition: string;
  description: string;
  data: CBCData;
}

export const samplePatients: SamplePatient[] = [
  {
    id: "normal",
    name: "Healthy Adult Female",
    condition: "No Anemia",
    description: "All CBC parameters within normal reference ranges",
    data: { hemoglobin: 13.5, hematocrit: 40, rbc: 4.5, mcv: 88, mch: 30, mchc: 33.5, rdw: 12.8, wbc: 6.5, platelets: 250, iron: 90, ferritin: 55, gender: "female", age: 32 },
  },
  {
    id: "iron-def",
    name: "Iron Deficiency Case",
    condition: "Iron Deficiency Anemia",
    description: "Classic microcytic hypochromic pattern with low ferritin",
    data: { hemoglobin: 9.2, hematocrit: 28, rbc: 4.1, mcv: 68, mch: 22, mchc: 30, rdw: 18.5, wbc: 7.2, platelets: 380, iron: 25, ferritin: 8, gender: "female", age: 28 },
  },
  {
    id: "b12-def",
    name: "B12 Deficiency Case",
    condition: "Megaloblastic Anemia",
    description: "Macrocytic anemia with elevated MCV",
    data: { hemoglobin: 8.5, hematocrit: 26, rbc: 2.8, mcv: 110, mch: 35, mchc: 34, rdw: 16.2, wbc: 4.1, platelets: 130, iron: 100, ferritin: 180, gender: "male", age: 62 },
  },
  {
    id: "thalassemia",
    name: "Thalassemia Trait",
    condition: "Thalassemia Minor",
    description: "Microcytic with normal ferritin — classic thalassemia pattern",
    data: { hemoglobin: 10.8, hematocrit: 33, rbc: 5.8, mcv: 65, mch: 21, mchc: 31, rdw: 13.2, wbc: 6.8, platelets: 270, iron: 80, ferritin: 65, gender: "male", age: 25 },
  },
  {
    id: "chronic",
    name: "Chronic Disease Case",
    condition: "Anemia of Chronic Disease",
    description: "Normocytic anemia with normal RDW",
    data: { hemoglobin: 10.0, hematocrit: 31, rbc: 3.5, mcv: 88, mch: 29, mchc: 32, rdw: 13.8, wbc: 9.5, platelets: 310, iron: 35, ferritin: 220, gender: "female", age: 55 },
  },
  {
    id: "severe",
    name: "Severe Anemia Case",
    condition: "Severe Iron Deficiency",
    description: "Critically low hemoglobin requiring urgent intervention",
    data: { hemoglobin: 5.8, hematocrit: 18, rbc: 2.9, mcv: 62, mch: 19, mchc: 28, rdw: 22.5, wbc: 8.1, platelets: 450, iron: 12, ferritin: 3, gender: "female", age: 19 },
  },
];

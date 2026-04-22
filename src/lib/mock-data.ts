export type DetectionStatus = "Healthy" | "Infected";

export interface Detection {
  id: string;
  itemName: string;
  imageInitial: string;
  prediction: string;
  confidence: number;
  date: string;
  status: DetectionStatus;
}

export const mockDetections: Detection[] = [
  {
    id: "DET-1042",
    itemName: "Tomato Leaf #A12",
    imageInitial: "TL",
    prediction: "Late Blight",
    confidence: 0.96,
    date: "2025-04-21",
    status: "Infected",
  },
  {
    id: "DET-1041",
    itemName: "Wheat Stalk #B07",
    imageInitial: "WS",
    prediction: "Healthy",
    confidence: 0.99,
    date: "2025-04-21",
    status: "Healthy",
  },
  {
    id: "DET-1040",
    itemName: "Corn Leaf #C19",
    imageInitial: "CL",
    prediction: "Northern Leaf Blight",
    confidence: 0.88,
    date: "2025-04-20",
    status: "Infected",
  },
  {
    id: "DET-1039",
    itemName: "Potato Leaf #D03",
    imageInitial: "PL",
    prediction: "Healthy",
    confidence: 0.97,
    date: "2025-04-20",
    status: "Healthy",
  },
  {
    id: "DET-1038",
    itemName: "Grape Leaf #E11",
    imageInitial: "GL",
    prediction: "Black Rot",
    confidence: 0.92,
    date: "2025-04-19",
    status: "Infected",
  },
  {
    id: "DET-1037",
    itemName: "Apple Leaf #F22",
    imageInitial: "AL",
    prediction: "Healthy",
    confidence: 0.95,
    date: "2025-04-19",
    status: "Healthy",
  },
  {
    id: "DET-1036",
    itemName: "Rice Leaf #G05",
    imageInitial: "RL",
    prediction: "Brown Spot",
    confidence: 0.84,
    date: "2025-04-18",
    status: "Infected",
  },
  {
    id: "DET-1035",
    itemName: "Soybean Leaf #H14",
    imageInitial: "SL",
    prediction: "Healthy",
    confidence: 0.98,
    date: "2025-04-18",
    status: "Healthy",
  },
];

export const stats = [
  { label: "Total Scans", value: "1,284", trend: "+12.4%" },
  { label: "Healthy", value: "892", trend: "+4.1%" },
  { label: "Infected", value: "392", trend: "-2.3%" },
  { label: "Avg. Confidence", value: "94.6%", trend: "+0.8%" },
];

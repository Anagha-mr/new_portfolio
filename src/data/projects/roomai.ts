import type { DetailedProject } from "./types";

export const roomai: DetailedProject = {
  slug: "roomai",
  title: "RoomAI",
  year: "2026",
  period: "2026–Present",
  category: "AI / Software",
  description: "AI-powered interior design application.",
  stack: [
    "Stable Diffusion",
    "ControlNet",
    "Depth Anything",
    "SAM",
    "CLIP",
    "Supabase",
    "Flask",
    "Flutter",
  ],
  featured: true,
  detail: {
    visual: "spatial",
    status: { label: "Ongoing" },
    overview: [
      "An AI-powered AR interior design app. It reads a room, preserves its structure, and generates redesigns as layouts and interactive visualisations.",
      "After each interaction, CLIP acts as a taste engine and personalises what the app proposes next.",
    ],
    role: {
      summary:
        "Building the application across the model pipeline, the API and the mobile frontend.",
      contributions: [
        "Structure-preserving generation with Stable Diffusion and ControlNet",
        "Depth and object understanding with Depth Anything and SAM",
        "A CLIP-based taste and personalisation engine",
        "Flask API, Flutter frontend and Supabase backend",
      ],
    },
    system: {
      title: "Pipeline",
      caption: "From a photograph of a room to a personalised redesign.",
      tone: "dark",
      data: {
        kind: "spatial",
        stages: [
          {
            name: "Image understanding",
            model: "CLIP",
            detail: "Reads the room image and its semantic content.",
          },
          {
            name: "Structure & depth",
            model: "Depth Anything",
            detail: "Recovers depth and layout so the room's structure can be preserved.",
          },
          {
            name: "Guided generation",
            model: "Stable Diffusion + ControlNet",
            detail: "Generates redesigns constrained by that structure.",
          },
          {
            name: "Segmentation",
            model: "SAM",
            detail: "Separates the scene into individual objects.",
          },
          {
            name: "Personalisation",
            model: "CLIP",
            detail: "Learns taste from user interactions to shape later suggestions.",
          },
        ],
      },
    },
    technology: [
      { group: "Generation", items: ["Stable Diffusion", "ControlNet"] },
      { group: "Understanding", items: ["Depth Anything", "SAM", "CLIP"] },
      { group: "Backend", items: ["Flask API", "Supabase"] },
      { group: "Client", items: ["Flutter"] },
    ],
  },
};

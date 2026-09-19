export type SkillGroup = {
  category: string;
  items: string[];
};

export const skills: SkillGroup[] = [
  {
    category: "Languages",
    items: ["Python", "TypeScript", "Java", "C/C++"],
  },
  {
    category: "Web & Backend",
    items: [
      "React",
      "Next.js",
      "Tailwind CSS",
      "FastAPI",
      "Flask",
      "Supabase",
      "REST APIs",
      "HLS.js",
      "FFmpeg",
    ],
  },
  {
    category: "AI & ML",
    items: [
      "Stable Diffusion",
      "ControlNet",
      "SAM",
      "CLIP",
      "RAG",
      "ChromaDB",
      "TensorFlow",
      "OpenCV",
      "MediaPipe",
    ],
  },
  {
    category: "Integrations & Tools",
    items: [
      "Google OAuth",
      "Groq LLM API",
      "DHTMLX Gantt",
      "Git",
      "Docker",
      "Power BI",
      "Tableau",
    ],
  },
];

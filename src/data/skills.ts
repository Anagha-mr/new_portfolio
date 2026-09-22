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

/** Grouping used on the About page. */
export const skillAreas: SkillGroup[] = [
  { category: "Languages", items: ["Python", "TypeScript", "Java", "C/C++"] },
  {
    category: "AI / ML",
    items: [
      "Stable Diffusion",
      "ControlNet",
      "SAM",
      "CLIP",
      "RAG",
      "ChromaDB",
      "sentence-transformers",
      "TensorFlow",
      "OpenCV",
      "MediaPipe",
    ],
  },
  {
    category: "Full-stack",
    items: ["React", "Next.js", "Vite", "Tailwind CSS", "Supabase", "FastAPI", "Flask"],
  },
  { category: "Systems / Media", items: ["FFmpeg", "RTSP", "HLS", "REST APIs"] },
  { category: "Tools", items: ["Git", "Docker", "Power BI", "Tableau"] },
];

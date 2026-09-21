import type { DetailedProject } from "./types";

export const gttc: DetailedProject = {
  slug: "gttc",
  title: "GTTC",
  year: "2026",
  period: "2026–Present",
  category: "Software Internship",
  description: "Unified security dashboard for GTTC, built across 8 integrated modules.",
  stack: ["React", "FastAPI", "FFmpeg", "HLS.js"],
  featured: true,
  detail: {
    visual: "monitoring",
    status: { label: "Ongoing", note: "Internship" },
    overview: [
      "A software internship at the Government Tool & Training Centre, contributing to an indigenous enterprise smart security platform. An imported reference system serves as the blueprint; the goal is full domestic hardware–software integration.",
      "The software layer is a unified security dashboard: eight integrated modules and live camera streams, on a FastAPI backend and a React + TypeScript frontend.",
    ],
    role: {
      summary:
        "Software development intern. Built the full-stack software layer and assisted with the hardware setup.",
      contributions: [
        "React + TypeScript frontend with Vite, Tailwind and shadcn/ui",
        "FastAPI backend and eight integrated security modules",
        "Live HLS camera streams through a custom FFmpeg sub-streaming pipeline",
        "Assembled and studied a CP PLUS multichannel NVR surveillance setup: IP camera configuration, PoE networking and RTSP stream handling",
        "Ongoing hardware–software integration across the NVR, access controllers and sensors",
      ],
    },
    system: {
      title: "Signal path",
      caption: "Where the hardware ends and the software begins.",
      tone: "dark",
      data: {
        kind: "monitoring",
        boundaryLabel: "RTSP",
        path: [
          {
            name: "Cameras & NVR",
            side: "hardware",
            detail: "IP cameras · CP PLUS multichannel NVR · PoE",
          },
          { name: "FFmpeg", side: "software", detail: "RTSP in, HLS out" },
          { name: "HLS stream", side: "software", detail: "Latency tuned" },
          { name: "Dashboard", side: "software", detail: "React + TypeScript" },
        ],
        modules: [
          "Video Surveillance",
          "Access Control",
          "AI Analytics",
          "Fire & Emergency",
          "Smart Parking",
          "Environment Monitoring",
        ],
        additionalModules: 2,
      },
    },
    features: {
      title: "Integration problems",
      items: [
        {
          label: "Static IP configuration",
          detail: "Cameras and recorder addressed statically on the local network.",
        },
        {
          label: "RTSP credential encoding",
          detail: "Credentials encoded correctly inside RTSP stream URLs.",
        },
        {
          label: "HLS latency tuning",
          detail: "Live-stream delay reduced from approximately 45 s to approximately 3 s.",
        },
        { label: "Multi-camera registry", detail: "Multiple cameras registered and managed centrally." },
        { label: "JSON persistence", detail: "State persisted as JSON." },
      ],
    },
    outcomes: {
      title: "Measured",
      items: [
        {
          value: "~45 s → ~3 s",
          label: "Live-stream latency",
          note: "Custom FFmpeg / HLS sub-streaming pipeline",
        },
        { value: "8", label: "Integrated modules" },
      ],
    },
    technology: [
      { group: "Frontend", items: ["React", "TypeScript", "Vite", "Tailwind CSS", "shadcn/ui"] },
      { group: "Backend", items: ["FastAPI"] },
      { group: "Streaming", items: ["FFmpeg", "HLS", "HLS.js", "RTSP"] },
      { group: "Hardware", items: ["CP PLUS NVR", "IP cameras", "PoE", "Access controllers", "Sensors"] },
    ],
  },
};

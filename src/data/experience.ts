export type Experience = {
  organization: string;
  role: string;
  period: string;
  summary: string;
  highlights: string[];
  /** Condensed account for the About page. */
  overview?: string;
  /** Slug of the related project page. */
  project?: string;
};

export const experience: Experience[] = [
  {
    organization: "GTTC (Government Tool & Training Centre)",
    role: "Software Development Intern",
    period: "Aug 2026–Present",
    summary:
      "Building a unified security dashboard spanning 8 integrated modules.",
    highlights: [
      "React + FastAPI dashboard unifying 8 security modules",
      "Live stream latency reduced from ~45s to ~3s via an FFmpeg + HLS pipeline",
      "Hardware/software integration across NVRs, access controllers, and sensors",
    ],
    overview:
      "Frontend and backend for a unified enterprise security platform: React and TypeScript, FastAPI, and eight integrated modules. Includes live camera streaming with FFmpeg and HLS, RTSP handling, and integration with NVRs, access controllers and sensors.",
    project: "gttc",
  },
];

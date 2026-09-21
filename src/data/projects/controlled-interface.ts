import type { DetailedProject } from "./types";

export const controlledInterface: DetailedProject = {
  slug: "controlled-interface",
  title: "Controlled Interface",
  year: "2025",
  period: "2025",
  category: "Computer Vision",
  description: "Real-time hand-gesture recognition that controls on-screen UI from a webcam.",
  stack: ["MediaPipe", "TensorFlow"],
  featured: true,
  detail: {
    visual: "gesture",
    status: { label: "Completed" },
    overview: [
      "A real-time hand-gesture recognition system. A webcam watches the hand, a neural network classifies the gesture, and the result drives on-screen UI elements.",
      "Interaction latency stayed under 100 ms.",
    ],
    role: {
      summary: "Built the recognition pipeline and the control layer that acts on it.",
      contributions: [
        "Hand tracking with MediaPipe landmarks",
        "A TensorFlow neural-network gesture classifier",
        "Mapping recognised gestures to on-screen and OS-level UI controls",
        "Keeping interaction latency under 100 ms",
      ],
    },
    system: {
      title: "Body, signal, interface",
      caption: "Illustrative landmark model. The hand is drawn, not captured.",
      tone: "dark",
      data: {
        kind: "gesture",
        latency: "< 100 ms",
        stages: [
          { name: "Webcam", detail: "Live video frames." },
          { name: "Landmarks", detail: "MediaPipe extracts hand landmarks from each frame." },
          { name: "Classifier", detail: "A TensorFlow neural network classifies the gesture." },
          { name: "Control", detail: "The gesture drives on-screen and OS-level UI." },
        ],
      },
    },
    outcomes: {
      title: "Measured",
      items: [{ value: "< 100 ms", label: "Interaction latency", note: "Sub-100 ms" }],
    },
    technology: [
      { group: "Tracking", items: ["MediaPipe hand landmarks"] },
      { group: "Model", items: ["TensorFlow"] },
      { group: "Input", items: ["Webcam"] },
      { group: "Output", items: ["On-screen UI", "OS-level control"] },
    ],
  },
};

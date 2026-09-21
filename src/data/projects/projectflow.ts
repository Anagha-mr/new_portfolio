import type { DetailedProject } from "./types";

export const projectflow: DetailedProject = {
  slug: "projectflow",
  title: "ProjectFlow",
  year: "2026",
  period: "2026–Present",
  category: "Software / SaaS",
  description: "Multi-tenant SaaS platform for interior design studios.",
  stack: ["Next.js", "React", "Supabase"],
  featured: true,
  detail: {
    visual: "workflow",
    status: { label: "Ongoing" },
    overview: [
      "A multi-tenant project management platform for interior design studios and small teams. Every studio works inside its own isolated tenant, with projects, schedules, drawing reviews, client communication and payments in one product.",
      "Workflow automation and WhatsApp and email notifications handle day-to-day team coordination.",
    ],
    role: {
      summary:
        "Built the platform: the Next.js application, the Supabase data layer and the third-party integrations.",
      contributions: [
        "Authentication with Google OAuth",
        "Tenant isolation using Supabase row-level security",
        "Project, team and scheduling modules, including a DHTMLX Gantt view",
        "Annotated RFI review with PDF.js and Fabric.js",
        "Razorpay payment integration",
        "Workflow automation with WhatsApp and email notifications",
        "A Groq Llama 3.3 assistant for weekly summaries and client updates",
      ],
    },
    system: {
      title: "System map",
      caption: "Modules grouped by function. All of them sit inside the tenant boundary.",
      tone: "dark",
      data: {
        kind: "workflow",
        boundary: { label: "Tenant boundary", detail: "Row-level security" },
        groups: [
          {
            name: "Access",
            modules: [
              { label: "Authentication", detail: "Google OAuth" },
              { label: "Tenant isolation", detail: "Row-level security" },
            ],
          },
          {
            name: "Delivery",
            modules: [
              { label: "Projects" },
              { label: "Team coordination" },
              { label: "Scheduling", detail: "DHTMLX Gantt" },
            ],
          },
          {
            name: "Review & clients",
            modules: [
              { label: "RFI review", detail: "PDF.js · Fabric.js" },
              { label: "Client collaboration" },
              { label: "AI assistant", detail: "Groq Llama 3.3" },
            ],
          },
          {
            name: "Operations",
            modules: [
              { label: "Workflow automation" },
              { label: "Notifications", detail: "WhatsApp · Email" },
              { label: "Payments", detail: "Razorpay" },
            ],
          },
        ],
      },
    },
    features: {
      title: "In detail",
      items: [
        {
          label: "Annotated RFI review",
          detail:
            "RFIs are reviewed in the browser as annotated PDFs. PDF.js renders the document and Fabric.js handles the markup layer.",
        },
        {
          label: "Scheduling",
          detail: "Project schedules are built on DHTMLX Gantt.",
        },
        {
          label: "Tenant isolation",
          detail:
            "Each studio's data is separated at the database level with Supabase row-level security.",
        },
        {
          label: "Payments",
          detail: "Payment automation through Razorpay.",
        },
        {
          label: "Notifications",
          detail:
            "Workflow automation is paired with WhatsApp and email notifications for team coordination.",
        },
        {
          label: "AI assistant",
          detail: "A Groq Llama 3.3 assistant produces weekly summaries and client updates.",
        },
      ],
    },
    technology: [
      { group: "Application", items: ["Next.js", "React"] },
      { group: "Data & auth", items: ["Supabase", "Row-level security", "Google OAuth"] },
      { group: "Documents & scheduling", items: ["PDF.js", "Fabric.js", "DHTMLX Gantt"] },
      { group: "Integrations", items: ["Razorpay", "WhatsApp", "Email"] },
      { group: "AI", items: ["Groq Llama 3.3"] },
    ],
  },
};

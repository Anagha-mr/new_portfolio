import type { DetailedProject } from "./types";

export const temporalRag: DetailedProject = {
  slug: "temporal-rag",
  title: "Temporal RAG",
  year: "2026",
  period: "2026",
  category: "AI / RAG",
  description: "News story tracker built on a temporal retrieval-augmented generation pipeline.",
  stack: ["RAG", "ChromaDB", "sentence-transformers", "Groq Llama 3.3", "Streamlit"],
  featured: true,
  detail: {
    visual: "timeline",
    status: { label: "Deployed", note: "Streamlit" },
    overview: [
      "A news story tracker that follows how coverage of a story changes over time. Articles are scraped and ingested automatically, then stored with their dates so retrieval can be date-aware.",
      "Analyses are written by Groq Llama 3.3 from the retrieved passages and cite the articles they draw on.",
    ],
    role: {
      summary: "Built the full pipeline, from article ingestion to the deployed app.",
      contributions: [
        "Web scraping and automated article ingestion",
        "Chunking and sentence-transformer embeddings stored in ChromaDB",
        "Date-aware retrieval across early, middle and late coverage",
        "Grounded, citation-backed synthesis with Groq Llama 3.3",
        "Streamlit deployment",
      ],
    },
    system: {
      title: "Retrieval over time",
      caption: "Coverage is split into early, middle and late periods before anything is retrieved.",
      tone: "ivory",
      data: {
        kind: "timeline",
        periods: ["Early", "Middle", "Late"],
        steps: [
          { name: "Ingest", detail: "Articles are scraped from news outlets and ingested automatically." },
          {
            name: "Embed",
            detail: "Text is chunked, embedded with sentence-transformers and stored in ChromaDB with its date.",
          },
          {
            name: "Retrieve",
            detail: "Date-aware retrieval draws chunks from early, middle and late coverage.",
          },
          {
            name: "Synthesize",
            detail: "Groq Llama 3.3 writes the analysis from the retrieved chunks, with citations.",
          },
          { name: "Serve", detail: "The app is deployed with Streamlit." },
        ],
      },
    },
    outcomes: {
      title: "One ingestion run",
      items: [
        { value: "14", label: "Articles" },
        { value: "147", label: "Chunks" },
        { value: "5+", label: "Outlets" },
      ],
    },
    technology: [
      { group: "Retrieval", items: ["ChromaDB", "sentence-transformers"] },
      { group: "Generation", items: ["Groq Llama 3.3"] },
      { group: "Ingestion", items: ["Web scraping"] },
      { group: "Deployment", items: ["Streamlit"] },
    ],
  },
};

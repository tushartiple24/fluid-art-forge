import { createFileRoute } from "@tanstack/react-router";
import { LiquidPortfolio } from "../components/LiquidPortfolio";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Tushar Tiple — Computer Engineering" },
      { name: "description", content: "Explore Tushar Tiple's work across cryptography, CTF, machine learning, and experimental systems." },
      { property: "og:title", content: "Tushar Tiple — Computer Engineering" },
      { property: "og:description", content: "Cryptography, CTF, machine learning, and experimental systems." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LiquidPortfolio,
});

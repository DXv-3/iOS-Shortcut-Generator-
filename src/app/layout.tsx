import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "iOS Shortcut Generator — AI-powered · GPT-4o · Claude · Gemini",
  description: "Generate, build, and export real .shortcut files using AI. Supports OpenAI, Anthropic Claude, and Google Gemini. 20+ templates from the community.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

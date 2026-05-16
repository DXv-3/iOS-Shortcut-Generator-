"use client";
import { useState } from "react";
import { AIPanel } from "./AIPanel";
import { ActionBuilder } from "./ActionBuilder";
import { ShortcutPreview } from "./ShortcutPreview";
import { TemplateGallery } from "./TemplateGallery";
import type { ShortcutAction } from "@/lib/shortcut-builder";
import { ICON_COLORS, ICON_GLYPHS } from "@/lib/shortcut-builder";
import type { ShortcutTemplate } from "@/lib/templates";
import { Wand2, Wrench, Eye, BookOpen } from "lucide-react";

export interface ShortcutState {
  name: string;
  description: string;
  actions: ShortcutAction[];
  iconColor: number;
  iconGlyph: number;
  suggestedTrigger?: string;
  tips?: string[];
}

const INITIAL_STATE: ShortcutState = {
  name: "My Shortcut",
  description: "",
  actions: [],
  iconColor: ICON_COLORS[5].value, // Blue
  iconGlyph: ICON_GLYPHS[0].value, // Bolt
};

type Tab = "ai" | "builder" | "templates" | "preview";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "ai",        label: "AI Generate",    icon: <Wand2 size={14} /> },
  { id: "builder",  label: "Action Builder",  icon: <Wrench size={14} /> },
  { id: "templates",label: "Templates",       icon: <BookOpen size={14} /> },
  { id: "preview",  label: "Preview & Export", icon: <Eye size={14} /> },
];

export function ShortcutGenerator() {
  const [tab, setTab] = useState<Tab>("ai");
  const [state, setState] = useState<ShortcutState>(INITIAL_STATE);
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: state.name,
          actions: state.actions,
          iconColor: state.iconColor,
          iconGlyph: state.iconGlyph,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${state.name || "shortcut"}.shortcut`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert(`Export failed: ${e}`);
    } finally {
      setExporting(false);
    }
  };

  const handleUseTemplate = (template: ShortcutTemplate) => {
    setState({
      name: template.name,
      description: template.description,
      actions: template.actions,
      iconColor: template.iconColor,
      iconGlyph: ICON_GLYPHS[0].value,
      tips: [],
    });
    setTab("preview");
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <header className="border-b sticky top-0 z-40 backdrop-blur-xl" style={{ borderColor: "var(--border)", background: "rgba(0,0,0,0.7)" }}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base" style={{ background: "linear-gradient(135deg, #007AFF, #AF52DE)" }}>
              ⚡
            </div>
            <div>
              <h1 className="text-sm font-bold" style={{ color: "var(--text)" }}>iOS Shortcut Generator</h1>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Powered by GPT-4o · Claude · Gemini</p>
            </div>
          </div>
          {state.actions.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-1 rounded-full" style={{ background: "var(--surface2)", color: "var(--text-muted)" }}>
                {state.actions.length} actions
              </span>
              <button
                onClick={handleExport}
                disabled={exporting}
                className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all disabled:opacity-50"
                style={{ background: "var(--accent)", color: "white" }}>
                {exporting ? "Exporting…" : "Export"}
              </button>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="max-w-6xl mx-auto px-4 pb-0 flex gap-1 overflow-x-auto">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium whitespace-nowrap transition-all border-b-2"
              style={{
                borderColor: tab === t.id ? "var(--accent)" : "transparent",
                color: tab === t.id ? "var(--accent)" : "var(--text-muted)",
              }}>
              {t.icon}
              {t.label}
              {t.id === "templates" && (
                <span className="px-1 py-0.5 rounded text-xs" style={{ background: "var(--surface2)", color: "var(--text-muted)", fontSize: "10px" }}>20</span>
              )}
            </button>
          ))}
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {tab === "ai" && (
          <AIPanel
            state={state}
            onStateChange={setState}
            onGoToPreview={() => setTab("preview")}
          />
        )}
        {tab === "builder" && (
          <ActionBuilder
            state={state}
            onStateChange={setState}
          />
        )}
        {tab === "templates" && (
          <TemplateGallery onUseTemplate={handleUseTemplate} />
        )}
        {tab === "preview" && (
          <ShortcutPreview
            state={state}
            onUpdate={setState}
            onExport={handleExport}
            exporting={exporting}
          />
        )}
      </main>
    </div>
  );
}

"use client";
import { useState, useCallback } from "react";
import { ActionBuilder } from "./ActionBuilder";
import { AIPanel } from "./AIPanel";
import { ShortcutPreview } from "./ShortcutPreview";
import { cn } from "@/lib/cn";
import type { ShortcutAction } from "@/lib/shortcut-builder";
import { ICON_COLORS } from "@/lib/shortcut-builder";
import { Wand2, List, Eye, Download, Zap, Github } from "lucide-react";

export type Tab = "ai" | "builder" | "preview";

export interface ShortcutState {
  name: string;
  description: string;
  actions: ShortcutAction[];
  iconColor: number;
  iconGlyph: number;
}

const DEFAULT_STATE: ShortcutState = {
  name: "My Shortcut",
  description: "",
  actions: [],
  iconColor: 4278255615,
  iconGlyph: 61440,
};

export function ShortcutGenerator() {
  const [tab, setTab] = useState<Tab>("ai");
  const [state, setState] = useState<ShortcutState>(DEFAULT_STATE);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState("");

  const handleExport = useCallback(async () => {
    if (!state.actions.length) { setExportError("Add at least one action first."); return; }
    setExporting(true);
    setExportError("");
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
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error || "Export failed");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${state.name}.shortcut`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: unknown) {
      setExportError(e instanceof Error ? e.message : "Export failed");
    } finally {
      setExporting(false);
    }
  }, [state]);

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "ai", label: "AI Generate", icon: <Wand2 size={15} /> },
    { id: "builder", label: "Action Builder", icon: <List size={15} /> },
    { id: "preview", label: "Preview & Export", icon: <Eye size={15} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <header className="border-b flex items-center justify-between px-6 py-3 shrink-0"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-lg"
            style={{ background: "linear-gradient(135deg, var(--accent), var(--accent2))" }}>
            ⚡
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight" style={{ color: "var(--text)" }}>
              iOS Shortcut Generator
            </h1>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>AI-powered • Real .shortcut files</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a href="https://github.com/DXv-3/iOS-Shortcut-Generator-" target="_blank"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors"
            style={{ color: "var(--text-muted)", border: "1px solid var(--border)" }}>
            <Github size={13} />
            Source
          </a>
          <button
            onClick={handleExport}
            disabled={exporting || state.actions.length === 0}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: state.actions.length > 0 ? "linear-gradient(135deg, var(--accent), var(--accent2))" : "var(--surface2)",
              color: "white",
            }}>
            {exporting ? <span className="animate-spin">⟳</span> : <Download size={13} />}
            {exporting ? "Exporting…" : "Download .shortcut"}
          </button>
        </div>
      </header>

      {exportError && (
        <div className="mx-6 mt-3 px-4 py-2 rounded-lg text-sm flex items-center gap-2"
          style={{ background: "#ef444420", color: "var(--red)", border: "1px solid #ef444440" }}>
          ⚠️ {exportError}
          <button onClick={() => setExportError("")} className="ml-auto text-xs opacity-60 hover:opacity-100">✕</button>
        </div>
      )}

      {/* Action count badge */}
      <div className="px-6 pt-4 flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
          style={{ background: "var(--surface2)", border: "1px solid var(--border)" }}>
          <Zap size={11} style={{ color: "var(--accent)" }} />
          <span style={{ color: "var(--text-muted)" }}>
            {state.actions.length === 0
              ? "No actions yet"
              : `${state.actions.length} action${state.actions.length !== 1 ? "s" : ""}`}
          </span>
        </div>
        {state.actions.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
            <span className="w-2 h-2 rounded-full" style={{ background: "var(--green)" }} />
            Ready to export
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-6 pt-4">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              tab === t.id
                ? "text-white"
                : "hover:opacity-80"
            )}
            style={{
              background: tab === t.id ? "linear-gradient(135deg, var(--accent), var(--accent2))" : "var(--surface2)",
              color: tab === t.id ? "white" : "var(--text-muted)",
              border: `1px solid ${tab === t.id ? "transparent" : "var(--border)"}`,
            }}>
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Main content */}
      <main className="flex-1 px-6 py-5 overflow-auto">
        {tab === "ai" && (
          <AIPanel state={state} onUpdate={setState} onSwitchTab={setTab} />
        )}
        {tab === "builder" && (
          <ActionBuilder state={state} onUpdate={setState} />
        )}
        {tab === "preview" && (
          <ShortcutPreview state={state} onUpdate={setState} onExport={handleExport} exporting={exporting} />
        )}
      </main>
    </div>
  );
}

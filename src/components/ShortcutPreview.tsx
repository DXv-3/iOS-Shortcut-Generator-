"use client";
import { useState } from "react";
import { Download, Code, Palette, Smartphone, Copy, Check } from "lucide-react";
import type { ShortcutState } from "./ShortcutGenerator";
import { ACTIONS } from "@/lib/actions-catalog";
import { buildXMLPlist, ICON_COLORS } from "@/lib/shortcut-builder";
import { cn } from "@/lib/cn";

interface ShortcutPreviewProps {
  state: ShortcutState;
  onUpdate: (s: ShortcutState) => void;
  onExport: () => void;
  exporting: boolean;
}

export function ShortcutPreview({ state, onUpdate, onExport, exporting }: ShortcutPreviewProps) {
  const [previewTab, setPreviewTab] = useState<"visual" | "xml">("visual");
  const [copied, setCopied] = useState(false);

  const xml = state.actions.length > 0
    ? buildXMLPlist({ name: state.name, actions: state.actions, iconColor: state.iconColor, iconGlyph: state.iconGlyph })
    : "";

  const copyXML = async () => {
    await navigator.clipboard.writeText(xml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getActionName = (id: string) =>
    ACTIONS.find(a => a.id === id)?.name ||
    id.split(".").slice(-1)[0];

  const getActionEmoji = (id: string) =>
    ACTIONS.find(a => a.id === id)?.emoji || "⚙️";

  const iconColor = ICON_COLORS.find(c => c.value === state.iconColor) || ICON_COLORS[5];

  return (
    <div className="max-w-4xl mx-auto space-y-6 slide-up">
      {/* Shortcut card mockup */}
      <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shrink-0"
            style={{ background: `linear-gradient(135deg, ${iconColor.hex}, ${iconColor.hex}99)`, boxShadow: `0 4px 20px ${iconColor.hex}40` }}>
            ⚡
          </div>
          <div>
            <h2 className="text-xl font-bold" style={{ color: "var(--text)" }}>{state.name}</h2>
            {state.description && (
              <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>{state.description}</p>
            )}
            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--surface2)", color: "var(--text-muted)" }}>
                {state.actions.length} actions
              </span>
              <span className="text-xs" style={{ color: iconColor.hex }}>{iconColor.name}</span>
            </div>
          </div>
        </div>

        {/* Icon color picker */}
        <div className="mb-6">
          <p className="text-xs font-medium mb-2 flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
            <Palette size={12} /> Icon Color
          </p>
          <div className="flex gap-2 flex-wrap">
            {ICON_COLORS.map(c => (
              <button key={c.value}
                onClick={() => onUpdate({ ...state, iconColor: c.value })}
                className={cn("w-7 h-7 rounded-full transition-all",
                  state.iconColor === c.value ? "ring-2 ring-white ring-offset-2" : "")}
                style={{
                  background: c.hex,
                  ringOffsetColor: "var(--bg)",
                  transform: state.iconColor === c.value ? "scale(1.15)" : "scale(1)",
                }}
                title={c.name}
              />
            ))}
          </div>
        </div>

        {/* Export button */}
        <button
          onClick={onExport}
          disabled={exporting || state.actions.length === 0}
          className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-40"
          style={{ background: "linear-gradient(135deg, var(--accent), var(--accent2))", color: "white" }}>
          {exporting ? <><span className="animate-spin">⟳</span> Downloading…</> : <><Download size={15} /> Download .shortcut File</>}
        </button>
        {state.actions.length === 0 && (
          <p className="text-xs text-center mt-2" style={{ color: "var(--text-muted)" }}>Add actions to enable export</p>
        )}
      </div>

      {/* Installation instructions */}
      <div className="rounded-2xl border p-5" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
        <h3 className="text-sm font-semibold flex items-center gap-2 mb-4" style={{ color: "var(--text)" }}>
          <Smartphone size={14} style={{ color: "var(--accent)" }} />
          How to Install
        </h3>
        <ol className="space-y-2">
          {[
            "Tap \"Download .shortcut\" above",
            "Open the downloaded file on your iPhone or iPad",
            "The Shortcuts app will open automatically with an import prompt",
            "Tap \"Add Shortcut\" to confirm the installation",
            "Find your shortcut in the Shortcuts app — ready to run!",
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5"
                style={{ background: "var(--accent)", color: "white" }}>{i + 1}</span>
              <span style={{ color: "var(--text-muted)" }}>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Preview pane */}
      <div className="rounded-2xl border overflow-hidden" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
        <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="flex gap-1">
            {(["visual", "xml"] as const).map(t => (
              <button key={t} onClick={() => setPreviewTab(t)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: previewTab === t ? "var(--accent)" : "var(--surface2)",
                  color: previewTab === t ? "white" : "var(--text-muted)",
                }}>
                {t === "visual" ? "Visual Flow" : "XML Plist"}
              </button>
            ))}
          </div>
          {previewTab === "xml" && xml && (
            <button onClick={copyXML}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
              style={{ background: "var(--surface2)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>
              {copied ? <Check size={11} style={{ color: "var(--green)" }} /> : <Copy size={11} />}
              {copied ? "Copied!" : "Copy XML"}
            </button>
          )}
        </div>

        <div className="p-4 max-h-96 overflow-y-auto scrollbar-thin">
          {previewTab === "visual" ? (
            state.actions.length === 0 ? (
              <p className="text-sm text-center py-8" style={{ color: "var(--text-muted)" }}>No actions to preview</p>
            ) : (
              <div className="space-y-2">
                {state.actions.map((action, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
                        style={{ background: "var(--surface2)", border: "1px solid var(--border)" }}>
                        {getActionEmoji(action.WFWorkflowActionIdentifier)}
                      </div>
                      {i < state.actions.length - 1 && (
                        <div className="w-px h-4 mt-1" style={{ background: "var(--border)" }} />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium" style={{ color: "var(--text)" }}>
                        {getActionName(action.WFWorkflowActionIdentifier)}
                      </p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                        {action.WFWorkflowActionIdentifier}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            xml ? (
              <pre className="text-xs overflow-x-auto" style={{ color: "#a5f3fc", fontFamily: "var(--font-geist-mono)" }}>
                {xml}
              </pre>
            ) : (
              <p className="text-sm text-center py-8" style={{ color: "var(--text-muted)" }}>Add actions to generate XML</p>
            )
          )}
        </div>
      </div>
    </div>
  );
}

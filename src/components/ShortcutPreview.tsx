"use client";
import { useState } from "react";
import { Download, Code, Palette, Smartphone, Copy, Check, Zap, Info } from "lucide-react";
import type { ShortcutState } from "./ShortcutGenerator";
import { ACTIONS } from "@/lib/actions-catalog";
import { buildXMLPlist, ICON_COLORS, ICON_GLYPHS } from "@/lib/shortcut-builder";
import { cn } from "@/lib/cn";

interface ShortcutPreviewProps {
  state: ShortcutState;
  onUpdate: (s: ShortcutState) => void;
  onExport: () => void;
  exporting: boolean;
}

export function ShortcutPreview({ state, onUpdate, onExport, exporting }: ShortcutPreviewProps) {
  const [previewTab, setPreviewTab] = useState<"visual" | "xml" | "info">("visual");
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
    ACTIONS.find(a => a.id === id)?.name || id.split(".").slice(-1)[0];

  const getActionEmoji = (id: string) =>
    ACTIONS.find(a => a.id === id)?.emoji || "⚙️";

  const getActionCategory = (id: string) =>
    ACTIONS.find(a => a.id === id)?.category || "";

  const iconColor = ICON_COLORS.find(c => c.value === state.iconColor) || ICON_COLORS[5];
  const iconGlyph = ICON_GLYPHS.find(g => g.value === state.iconGlyph) || ICON_GLYPHS[0];

  // Unique categories used in this shortcut
  const usedCategories = [...new Set(state.actions.map(a => getActionCategory(a.WFWorkflowActionIdentifier)).filter(Boolean))];

  return (
    <div className="max-w-4xl mx-auto space-y-6 slide-up">
      {/* iOS-style shortcut card — inspired by xAlien95/shortcut-preview */}
      <div className="rounded-2xl border overflow-hidden" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
        {/* Card header — mimics iOS Shortcuts app card */}
        <div className="p-5" style={{ background: `linear-gradient(160deg, ${iconColor.hex}22 0%, transparent 60%)` }}>
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shrink-0 relative"
              style={{
                background: `linear-gradient(145deg, ${iconColor.hex}, ${iconColor.hex}cc)`,
                boxShadow: `0 6px 24px ${iconColor.hex}55`,
              }}>
              {iconGlyph.emoji}
              {/* Shine overlay like real iOS icons */}
              <div className="absolute inset-0 rounded-2xl" style={{ background: "linear-gradient(145deg, rgba(255,255,255,0.25) 0%, transparent 60%)" }} />
            </div>
            <div className="flex-1">
              <input
                value={state.name}
                onChange={e => onUpdate({ ...state, name: e.target.value })}
                className="text-xl font-bold bg-transparent border-none outline-none w-full"
                style={{ color: "var(--text)" }}
                placeholder="Shortcut name"
              />
              {state.description && (
                <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>{state.description}</p>
              )}
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--surface2)", color: "var(--text-muted)" }}>
                  {state.actions.length} action{state.actions.length !== 1 ? "s" : ""}
                </span>
                {usedCategories.slice(0, 3).map(cat => (
                  <span key={cat} className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${iconColor.hex}22`, color: iconColor.hex }}>
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Icon customisation */}
        <div className="px-5 pb-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Color picker */}
            <div>
              <p className="text-xs font-medium mb-2 flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
                <Palette size={11} /> Color
              </p>
              <div className="flex gap-1.5 flex-wrap">
                {ICON_COLORS.map(c => (
                  <button key={c.value}
                    onClick={() => onUpdate({ ...state, iconColor: c.value })}
                    title={c.name}
                    className="w-6 h-6 rounded-full transition-all"
                    style={{
                      background: c.hex,
                      outline: state.iconColor === c.value ? `2px solid white` : "none",
                      outlineOffset: "2px",
                      transform: state.iconColor === c.value ? "scale(1.2)" : "scale(1)",
                    }}
                  />
                ))}
              </div>
            </div>
            {/* Glyph picker */}
            <div>
              <p className="text-xs font-medium mb-2 flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
                <Zap size={11} /> Icon
              </p>
              <div className="flex gap-1.5 flex-wrap">
                {ICON_GLYPHS.map(g => (
                  <button key={g.value}
                    onClick={() => onUpdate({ ...state, iconGlyph: g.value })}
                    title={g.name}
                    className="w-7 h-7 rounded-lg text-sm transition-all"
                    style={{
                      background: state.iconGlyph === g.value ? iconColor.hex : "var(--surface2)",
                      outline: state.iconGlyph === g.value ? `none` : "none",
                      border: `1px solid var(--border)`,
                    }}>
                    {g.emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Export button */}
          <button
            onClick={onExport}
            disabled={exporting || state.actions.length === 0}
            className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-40"
            style={{ background: `linear-gradient(135deg, ${iconColor.hex}, ${iconColor.hex}bb)`, color: "white", boxShadow: `0 4px 20px ${iconColor.hex}44` }}>
            {exporting
              ? <><span className="animate-spin inline-block">⟳</span> Building .shortcut…</>
              : <><Download size={15} /> Download .shortcut File</>}
          </button>
          {state.actions.length === 0 && (
            <p className="text-xs text-center" style={{ color: "var(--text-muted)" }}>Add at least one action to export</p>
          )}
        </div>
      </div>

      {/* Preview pane */}
      <div className="rounded-2xl border overflow-hidden" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
        <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="flex gap-1">
            {(["visual", "xml", "info"] as const).map(t => (
              <button key={t} onClick={() => setPreviewTab(t)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize"
                style={{
                  background: previewTab === t ? "var(--accent)" : "var(--surface2)",
                  color: previewTab === t ? "white" : "var(--text-muted)",
                }}>
                {t === "visual" ? "Visual Flow" : t === "xml" ? "XML Plist" : "Info"}
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

        <div className="p-4 max-h-96 overflow-y-auto">
          {previewTab === "visual" && (
            state.actions.length === 0
              ? <p className="text-sm text-center py-8" style={{ color: "var(--text-muted)" }}>No actions yet — generate or build one above</p>
              : <div className="space-y-1.5">
                  {state.actions.map((action, i) => {
                    const isControl = action.WFWorkflowActionIdentifier.includes("conditional") ||
                      action.WFWorkflowActionIdentifier.includes("repeat");
                    const mode = (action.WFWorkflowActionParameters?.WFConditionalActionMode as string) ?? "";
                    const isEnd = mode === "End";
                    const isElse = mode === "Otherwise";
                    const indent = isControl && !isEnd ? 0 : isElse || isEnd ? 0 : 20;
                    return (
                      <div key={i} className="flex items-center gap-3" style={{ paddingLeft: indent }}>
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                            style={{
                              background: isControl ? `${iconColor.hex}33` : "var(--surface2)",
                              border: `1px solid ${isControl ? iconColor.hex : "var(--border)"}`,
                            }}>
                            {getActionEmoji(action.WFWorkflowActionIdentifier)}
                          </div>
                          {i < state.actions.length - 1 && (
                            <div className="w-px h-3" style={{ background: "var(--border)" }} />
                          )}
                        </div>
                        <div className="flex-1 py-1">
                          <p className="text-xs font-medium" style={{ color: "var(--text)" }}>
                            {getActionName(action.WFWorkflowActionIdentifier)}
                          </p>
                          <p className="text-xs opacity-50" style={{ color: "var(--text-muted)" }}>
                            {action.WFWorkflowActionIdentifier}
                          </p>
                        </div>
                        <span className="text-xs px-1.5 py-0.5 rounded shrink-0" style={{ background: "var(--surface2)", color: "var(--text-muted)" }}>
                          {i + 1}
                        </span>
                      </div>
                    );
                  })}
                </div>
          )}

          {previewTab === "xml" && (
            xml
              ? <pre className="text-xs overflow-x-auto whitespace-pre-wrap break-all" style={{ color: "#a5f3fc", fontFamily: "monospace" }}>{xml}</pre>
              : <p className="text-sm text-center py-8" style={{ color: "var(--text-muted)" }}>Add actions to generate XML</p>
          )}

          {previewTab === "info" && (
            <div className="space-y-4">
              <div className="rounded-xl p-4" style={{ background: "var(--surface2)" }}>
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--text)" }}>
                  <Info size={14} style={{ color: "var(--accent)" }} /> Shortcut Details
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs" style={{ color: "var(--text-muted)" }}>
                  <div><span className="font-medium" style={{ color: "var(--text)" }}>Name</span><br />{state.name || "—"}</div>
                  <div><span className="font-medium" style={{ color: "var(--text)" }}>Actions</span><br />{state.actions.length}</div>
                  <div><span className="font-medium" style={{ color: "var(--text)" }}>Categories</span><br />{usedCategories.join(", ") || "—"}</div>
                  <div><span className="font-medium" style={{ color: "var(--text)" }}>Est. file size</span><br />{xml ? `~${(xml.length / 1024).toFixed(1)} KB` : "—"}</div>
                </div>
              </div>
              <div className="rounded-xl p-4" style={{ background: "var(--surface2)" }}>
                <h4 className="text-sm font-semibold mb-3" style={{ color: "var(--text)" }}>📲 How to Install</h4>
                <ol className="space-y-2">
                  {[
                    "Tap \"Download .shortcut\" above",
                    "Open the file on your iPhone or iPad",
                    "Shortcuts app opens — tap \"Add Shortcut\"",
                    "Find it in your Shortcuts library",
                    "Add to Home Screen for one-tap access",
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-3 text-xs">
                      <span className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-white text-xs"
                        style={{ background: iconColor.hex }}>{i + 1}</span>
                      <span style={{ color: "var(--text-muted)" }}>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

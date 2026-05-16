"use client";
import { useState, useRef } from "react";
import { Wand2, Sparkles, AlertCircle, Key, ChevronDown, ChevronUp } from "lucide-react";
import type { ShortcutState, Tab } from "./ShortcutGenerator";
import { ACTION_MAP } from "@/lib/actions-catalog";
import { cn } from "@/lib/cn";

const EXAMPLES = [
  "Every morning at 8am: get weather, read top news headlines, and send me a summary notification",
  "When I tap, ask me what to log, then save the time and note to a text file in iCloud Drive",
  "Focus mode shortcut: turn off Wi-Fi, set brightness to 50%, mute, open Notion, start a 25-min timer",
  "Scan a QR code and if it's a URL open it in Safari, otherwise copy it to clipboard and show me",
  "Ask for a number, repeat that many times: take a photo and save it with a timestamp filename",
  "Get clipboard, translate to Spanish using a web request, show result and copy back",
  "Daily wind-down: turn on Do Not Disturb, dim brightness, start rain sounds, add tomorrow reminder",
  "Generate a random strong password, copy to clipboard, and show it briefly",
];

const MODELS = [
  { id: "gpt-4o", label: "GPT-4o", desc: "Best quality" },
  { id: "gpt-4o-mini", label: "GPT-4o Mini", desc: "Faster, cheaper" },
  { id: "gpt-4-turbo", label: "GPT-4 Turbo", desc: "High quality" },
];

interface AIPanelProps {
  state: ShortcutState;
  onUpdate: (s: ShortcutState) => void;
  onSwitchTab: (t: Tab) => void;
}

export function AIPanel({ state, onUpdate, onSwitchTab }: AIPanelProps) {
  const [prompt, setPrompt] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [model, setModel] = useState("gpt-4o");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastGenerated, setLastGenerated] = useState<ShortcutState | null>(null);
  const [showKeyPanel, setShowKeyPanel] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  async function generate() {
    if (!prompt.trim()) return;
    setLoading(true);
    setError("");
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (apiKey.trim()) headers["x-openai-key"] = apiKey.trim();

      const res = await fetch("/api/generate", {
        method: "POST",
        headers,
        body: JSON.stringify({ prompt: prompt.trim(), model }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");

      const { shortcut } = data;
      const colorHex = shortcut.iconColorHex || "#007AFF";
      // Map hex to nearest preset color value
      const { ICON_COLORS } = await import("@/lib/shortcut-builder");
      const colorMatch = ICON_COLORS.find(c => c.hex === colorHex) || ICON_COLORS[5];

      const newState: ShortcutState = {
        name: shortcut.name,
        description: shortcut.description,
        actions: shortcut.actions,
        iconColor: colorMatch.value,
        iconGlyph: state.iconGlyph,
      };

      setLastGenerated(newState);
      onUpdate(newState);
      onSwitchTab("builder");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 slide-up">
      {/* API Key Panel */}
      <div className="rounded-xl border" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
        <button
          onClick={() => setShowKeyPanel(!showKeyPanel)}
          className="w-full flex items-center justify-between px-5 py-3.5 text-sm"
          style={{ color: "var(--text-muted)" }}>
          <div className="flex items-center gap-2">
            <Key size={14} />
            <span>OpenAI API Key</span>
            {apiKey && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#22c55e20", color: "var(--green)" }}>Set ✓</span>}
          </div>
          {showKeyPanel ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {showKeyPanel && (
          <div className="px-5 pb-4 space-y-3 border-t" style={{ borderColor: "var(--border)" }}>
            <p className="text-xs pt-3" style={{ color: "var(--text-muted)" }}>
              Your key is sent directly to OpenAI and never stored. You can also set <code className="px-1 rounded" style={{ background: "var(--surface2)" }}>OPENAI_API_KEY</code> in your <code>.env.local</code> file.
            </p>
            <div className="flex gap-2">
              <input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder="sk-proj-..."
                className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
                style={{ background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text)" }}
              />
              <button onClick={() => setShowKey(!showKey)}
                className="px-3 py-2 rounded-lg text-xs"
                style={{ background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
                {showKey ? "Hide" : "Show"}
              </button>
            </div>
            <div className="flex gap-2">
              {MODELS.map(m => (
                <button key={m.id} onClick={() => setModel(m.id)}
                  className={cn("flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all")}
                  style={{
                    background: model === m.id ? "linear-gradient(135deg, var(--accent), var(--accent2))" : "var(--surface2)",
                    color: model === m.id ? "white" : "var(--text-muted)",
                    border: `1px solid ${model === m.id ? "transparent" : "var(--border)"}`,
                  }}>
                  <div>{m.label}</div>
                  <div className="text-xs opacity-70">{m.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main prompt */}
      <div className="rounded-xl border" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Wand2 size={16} style={{ color: "var(--accent)" }} />
            <h2 className="font-semibold" style={{ color: "var(--text)" }}>Describe Your Shortcut</h2>
          </div>
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) generate(); }}
            placeholder="Describe what you want your shortcut to do… be as specific as possible."
            rows={4}
            className="w-full px-4 py-3 rounded-xl text-sm resize-none outline-none scrollbar-thin"
            style={{
              background: "var(--surface2)",
              border: "1px solid var(--border)",
              color: "var(--text)",
              lineHeight: 1.6,
            }}
          />
          {error && (
            <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg text-sm"
              style={{ background: "#ef444420", color: "var(--red)", border: "1px solid #ef444440" }}>
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              {error}
            </div>
          )}
          <button
            onClick={generate}
            disabled={loading || !prompt.trim()}
            className="w-full py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg, var(--accent), var(--accent2))", color: "white" }}>
            {loading ? (
              <><span className="animate-spin text-lg">⟳</span> Generating your shortcut…</>
            ) : (
              <><Sparkles size={15} /> Generate Shortcut <span className="opacity-60 text-xs">(⌘↵)</span></>
            )}
          </button>
        </div>
      </div>

      {/* Examples */}
      <div>
        <p className="text-xs font-medium mb-3" style={{ color: "var(--text-muted)" }}>💡 Try these examples:</p>
        <div className="grid grid-cols-1 gap-2">
          {EXAMPLES.map((ex, i) => (
            <button key={i} onClick={() => { setPrompt(ex); textareaRef.current?.focus(); }}
              className="text-left px-4 py-3 rounded-xl text-xs transition-all hover:border-opacity-80"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                color: "var(--text-muted)",
                lineHeight: 1.5,
              }}>
              {ex}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

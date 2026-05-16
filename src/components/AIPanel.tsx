"use client";
import { useState } from "react";
import { Wand2, ChevronDown, ChevronUp, Key, ArrowRight, Sparkles, Zap } from "lucide-react";
import type { ShortcutState } from "./ShortcutGenerator";
import { ICON_COLORS, ICON_GLYPHS } from "@/lib/shortcut-builder";
import { MODEL_OPTIONS, PROVIDER_LABELS, PROVIDER_COLORS } from "@/lib/multi-model";
import type { ModelProvider } from "@/lib/multi-model";
import { cn } from "@/lib/cn";

interface AIPanelProps {
  state: ShortcutState;
  onStateChange: (s: ShortcutState) => void;
  onGoToPreview: () => void;
}

const EXAMPLES = [
  { emoji: "☀️", label: "Morning briefing with weather + calendar" },
  { emoji: "🔋", label: "Alert me when battery drops below 20%" },
  { emoji: "📸", label: "Screenshot, annotate, and save to iCloud" },
  { emoji: "🚗", label: "Text my ETA using current location" },
  { emoji: "💧", label: "Log water intake to Apple Health" },
  { emoji: "🧹", label: "Strip tracking params from clipboard URL" },
  { emoji: "🌙", label: "Night mode: DND + low brightness + silent" },
  { emoji: "📶", label: "Generate Wi-Fi QR code from SSID + password" },
];

export function AIPanel({ state, onStateChange, onGoToPreview }: AIPanelProps) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showKeys, setShowKeys] = useState(false);
  const [selectedModel, setSelectedModel] = useState("gpt-4o");

  // API keys
  const [openaiKey, setOpenaiKey] = useState("");
  const [anthropicKey, setAnthropicKey] = useState("");
  const [googleKey, setGoogleKey] = useState("");

  const selectedModelDef = MODEL_OPTIONS.find(m => m.id === selectedModel) ?? MODEL_OPTIONS[0];

  const generate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          modelId: selectedModel,
          apiKey: openaiKey,
          anthropicKey,
          googleKey,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      const s = data.shortcut;
      onStateChange({
        ...state,
        name: s.name || state.name,
        description: s.description || "",
        actions: s.actions || [],
        iconColor: s.iconColor || ICON_COLORS[5].value,
        iconGlyph: s.iconGlyph || ICON_GLYPHS[0].value,
        suggestedTrigger: s.suggestedTrigger,
        tips: s.tips,
      });
      onGoToPreview();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  const providers: ModelProvider[] = ["openai", "anthropic", "google"];

  return (
    <div className="max-w-3xl mx-auto space-y-6 slide-up">
      {/* Main prompt card */}
      <div className="rounded-2xl border p-6 space-y-5" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: "var(--text)" }}>
            <Wand2 size={18} style={{ color: "var(--accent)" }} />
            Describe your shortcut
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Tell the AI what you want to automate — it generates a ready-to-install shortcut.</p>
        </div>

        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) generate(); }}
          placeholder="e.g. Every morning at 7am, read me the weather and my first 3 calendar events"
          rows={4}
          className="w-full rounded-xl p-4 text-sm resize-none border outline-none transition-all"
          style={{ background: "var(--surface2)", borderColor: "var(--border)", color: "var(--text)" }}
        />

        {/* Model selector */}
        <div className="space-y-2">
          <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>AI Model</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {providers.map(provider => (
              <div key={provider}>
                <p className="text-xs mb-1.5 font-medium" style={{ color: PROVIDER_COLORS[provider] }}>{PROVIDER_LABELS[provider]}</p>
                <div className="space-y-1">
                  {MODEL_OPTIONS.filter(m => m.provider === provider).map(m => (
                    <button key={m.id}
                      onClick={() => setSelectedModel(m.id)}
                      className={cn("w-full text-left px-3 py-2 rounded-lg text-xs transition-all border")}
                      style={{
                        background: selectedModel === m.id ? `${PROVIDER_COLORS[provider]}22` : "var(--surface2)",
                        borderColor: selectedModel === m.id ? PROVIDER_COLORS[provider] : "var(--border)",
                        color: selectedModel === m.id ? PROVIDER_COLORS[provider] : "var(--text-muted)",
                      }}>
                      <span className="font-medium block">{m.name}</span>
                      <span className="opacity-70 text-xs">{m.description}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* API Keys */}
        <div>
          <button
            onClick={() => setShowKeys(!showKeys)}
            className="flex items-center gap-2 text-xs"
            style={{ color: "var(--text-muted)" }}>
            <Key size={12} />
            API Keys {showKeys ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
          {showKeys && (
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs mb-1 block" style={{ color: PROVIDER_COLORS.openai }}>OpenAI Key</label>
                <input value={openaiKey} onChange={e => setOpenaiKey(e.target.value)} type="password"
                  placeholder="sk-…" className="w-full px-3 py-2 rounded-lg text-xs border outline-none"
                  style={{ background: "var(--surface2)", borderColor: "var(--border)", color: "var(--text)" }} />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: PROVIDER_COLORS.anthropic }}>Anthropic Key</label>
                <input value={anthropicKey} onChange={e => setAnthropicKey(e.target.value)} type="password"
                  placeholder="sk-ant-…" className="w-full px-3 py-2 rounded-lg text-xs border outline-none"
                  style={{ background: "var(--surface2)", borderColor: "var(--border)", color: "var(--text)" }} />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: PROVIDER_COLORS.google }}>Google Key</label>
                <input value={googleKey} onChange={e => setGoogleKey(e.target.value)} type="password"
                  placeholder="AIza…" className="w-full px-3 py-2 rounded-lg text-xs border outline-none"
                  style={{ background: "var(--surface2)", borderColor: "var(--border)", color: "var(--text)" }} />
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="rounded-xl px-4 py-3 text-sm" style={{ background: "#ff3b3022", color: "#ff3b30", border: "1px solid #ff3b3044" }}>
            ⚠️ {error}
          </div>
        )}

        <button
          onClick={generate}
          disabled={loading || !prompt.trim()}
          className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-40"
          style={{ background: "linear-gradient(135deg, var(--accent), var(--accent2))", color: "white" }}>
          {loading
            ? <><Sparkles size={15} className="animate-spin" /> Generating…</>
            : <><Wand2 size={15} /> Generate Shortcut <span className="opacity-60 text-xs">(⌘+Enter)</span></>}
        </button>
      </div>

      {/* Example prompts */}
      <div>
        <p className="text-xs font-medium mb-3 flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
          <Zap size={11} /> Example prompts
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {EXAMPLES.map(ex => (
            <button key={ex.label}
              onClick={() => setPrompt(ex.label)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-left transition-all border"
              style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--text-muted)" }}>
              <span className="text-base shrink-0">{ex.emoji}</span>
              <span className="flex-1 text-xs">{ex.label}</span>
              <ArrowRight size={12} className="shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

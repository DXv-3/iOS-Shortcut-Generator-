"use client";
import { useState, useMemo } from "react";
import { Search, Zap, BookOpen, Filter } from "lucide-react";
import { TEMPLATES, TEMPLATE_CATEGORIES, searchTemplates } from "@/lib/templates";
import type { ShortcutTemplate } from "@/lib/templates";
import { cn } from "@/lib/cn";

interface TemplateGalleryProps {
  onUseTemplate: (template: ShortcutTemplate) => void;
}

const DIFFICULTY_COLORS = {
  beginner: "#34C759",
  intermediate: "#FF9500",
  advanced: "#FF3B30",
};

const SOURCE_BADGE: Record<string, string> = {
  "huaminghuangtw/Shortcutomation": "Shortcutomation",
  "extratone/shortcuts": "extratone",
  "realdennis/shortcuts-mono": "shortcuts-mono",
};

export function TemplateGallery({ onUseTemplate }: TemplateGalleryProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeDifficulty, setActiveDifficulty] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = query ? searchTemplates(query) : TEMPLATES;
    if (activeCategory) list = list.filter(t => t.category === activeCategory);
    if (activeDifficulty) list = list.filter(t => t.difficulty === activeDifficulty);
    return list;
  }, [query, activeCategory, activeDifficulty]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ color: "var(--text)" }}>Template Gallery</h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
            {TEMPLATES.length} real shortcuts from <span style={{ color: "var(--accent)" }}>Shortcutomation</span>, <span style={{ color: "var(--accent)" }}>extratone</span>, and <span style={{ color: "var(--accent)" }}>shortcuts-mono</span>
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg" style={{ background: "var(--surface2)", color: "var(--text-muted)" }}>
          <BookOpen size={12} />
          {filtered.length} templates
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search templates…"
          className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border outline-none"
          style={{ background: "var(--surface2)", borderColor: "var(--border)", color: "var(--text)" }}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
          <Filter size={11} /> Category:
        </div>
        {TEMPLATE_CATEGORIES.map(cat => (
          <button key={cat}
            onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
            className="px-2.5 py-1 rounded-full text-xs transition-all"
            style={{
              background: activeCategory === cat ? "var(--accent)" : "var(--surface2)",
              color: activeCategory === cat ? "white" : "var(--text-muted)",
              border: `1px solid ${activeCategory === cat ? "var(--accent)" : "var(--border)"}`,
            }}>
            {cat}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
          <Filter size={11} /> Level:
        </div>
        {(["beginner", "intermediate", "advanced"] as const).map(d => (
          <button key={d}
            onClick={() => setActiveDifficulty(activeDifficulty === d ? null : d)}
            className="px-2.5 py-1 rounded-full text-xs transition-all capitalize"
            style={{
              background: activeDifficulty === d ? DIFFICULTY_COLORS[d] : "var(--surface2)",
              color: activeDifficulty === d ? "white" : "var(--text-muted)",
              border: `1px solid ${activeDifficulty === d ? DIFFICULTY_COLORS[d] : "var(--border)"}`,
            }}>
            {d}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-12" style={{ color: "var(--text-muted)" }}>
          <Search size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No templates match your search</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(template => (
            <TemplateCard key={template.id} template={template} onUse={onUseTemplate} />
          ))}
        </div>
      )}
    </div>
  );
}

function TemplateCard({ template, onUse }: { template: ShortcutTemplate; onUse: (t: ShortcutTemplate) => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="rounded-2xl border p-4 flex flex-col gap-3 transition-all cursor-default"
      style={{
        background: "var(--surface)",
        borderColor: hovered ? "var(--accent)" : "var(--border)",
        transform: hovered ? "translateY(-2px)" : "none",
        boxShadow: hovered ? "0 8px 32px rgba(0,0,0,0.3)" : "none",
      }}>
      {/* Icon + Title */}
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
          style={{
            background: `linear-gradient(135deg, #${template.iconColor.toString(16).slice(-6).padStart(6, "0")}22, #${template.iconColor.toString(16).slice(-6).padStart(6, "0")}44)`,
            border: `1px solid #${template.iconColor.toString(16).slice(-6).padStart(6, "0")}44`,
          }}>
          {template.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate" style={{ color: "var(--text)" }}>{template.name}</p>
          <p className="text-xs mt-0.5 line-clamp-2" style={{ color: "var(--text-muted)" }}>{template.description}</p>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1">
        {template.tags.slice(0, 4).map(tag => (
          <span key={tag} className="text-xs px-1.5 py-0.5 rounded-md" style={{ background: "var(--surface2)", color: "var(--text-muted)" }}>
            #{tag}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-2">
          <span className="text-xs px-1.5 py-0.5 rounded-md capitalize"
            style={{ background: `${DIFFICULTY_COLORS[template.difficulty]}22`, color: DIFFICULTY_COLORS[template.difficulty] }}>
            {template.difficulty}
          </span>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            {template.actions.length} actions
          </span>
        </div>
        <button
          onClick={() => onUse(template)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          )}
          style={{
            background: hovered ? "var(--accent)" : "var(--surface2)",
            color: hovered ? "white" : "var(--text-muted)",
          }}>
          <Zap size={11} /> Use Template
        </button>
      </div>
    </div>
  );
}

"use client";
import { useState, useCallback } from "react";
import { ACTIONS, getActionsByCategory, searchActions, type ActionDef } from "@/lib/actions-catalog";
import type { ShortcutState } from "./ShortcutGenerator";
import type { ShortcutAction } from "@/lib/shortcut-builder";
import { Search, Plus, X, GripVertical, ChevronDown, ChevronUp, Settings, Edit3, Check } from "lucide-react";
import { cn } from "@/lib/cn";

interface ActionBuilderProps {
  state: ShortcutState;
  onUpdate: (s: ShortcutState) => void;
}

export function ActionBuilder({ state, onUpdate }: ActionBuilderProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedAction, setExpandedAction] = useState<number | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [editingName, setEditingName] = useState(false);
  const [nameVal, setNameVal] = useState(state.name);

  const grouped = getActionsByCategory();
  const categories = Object.keys(grouped).sort();
  const filtered = searchActions(search);
  const displayActions = activeCategory
    ? filtered.filter(a => a.category === activeCategory)
    : filtered;

  const addAction = useCallback((def: ActionDef) => {
    const newAction: ShortcutAction = {
      WFWorkflowActionIdentifier: def.id,
      WFWorkflowActionParameters: { ...(def.params || {}) },
    };
    onUpdate({ ...state, actions: [...state.actions, newAction] });
  }, [state, onUpdate]);

  const removeAction = useCallback((i: number) => {
    const next = [...state.actions];
    next.splice(i, 1);
    onUpdate({ ...state, actions: next });
  }, [state, onUpdate]);

  const moveAction = useCallback((from: number, to: number) => {
    if (from === to) return;
    const next = [...state.actions];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onUpdate({ ...state, actions: next });
  }, [state, onUpdate]);

  const updateParam = useCallback((actionIdx: number, key: string, value: string) => {
    const next = [...state.actions];
    next[actionIdx] = {
      ...next[actionIdx],
      WFWorkflowActionParameters: {
        ...next[actionIdx].WFWorkflowActionParameters,
        [key]: value,
      },
    };
    onUpdate({ ...state, actions: next });
  }, [state, onUpdate]);

  const getActionDef = (id: string) =>
    ACTIONS.find(a => a.id === id);

  // Drag handlers
  const onDragStart = (i: number) => setDragIndex(i);
  const onDragOver = (e: React.DragEvent, i: number) => { e.preventDefault(); setDragOverIndex(i); };
  const onDrop = (i: number) => {
    if (dragIndex !== null) moveAction(dragIndex, i);
    setDragIndex(null);
    setDragOverIndex(null);
  };
  const onDragEnd = () => { setDragIndex(null); setDragOverIndex(null); };

  const saveName = () => {
    if (nameVal.trim()) onUpdate({ ...state, name: nameVal.trim() });
    setEditingName(false);
  };

  return (
    <div className="flex gap-5" style={{ height: "calc(100vh - 220px)" }}>
      {/* Left: Action catalog */}
      <div className="w-72 shrink-0 flex flex-col rounded-xl border overflow-hidden"
        style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
        <div className="p-3 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{ background: "var(--surface2)", border: "1px solid var(--border)" }}>
            <Search size={13} style={{ color: "var(--text-muted)" }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search actions…"
              className="flex-1 bg-transparent text-sm outline-none"
              style={{ color: "var(--text)" }}
            />
            {search && <button onClick={() => setSearch("")} style={{ color: "var(--text-muted)" }}><X size={12} /></button>}
          </div>
        </div>
        {/* Category pills */}
        {!search && (
          <div className="flex gap-1.5 p-3 flex-wrap border-b" style={{ borderColor: "var(--border)" }}>
            <button
              onClick={() => setActiveCategory(null)}
              className="px-2.5 py-1 rounded-full text-xs"
              style={{
                background: !activeCategory ? "var(--accent)" : "var(--surface2)",
                color: !activeCategory ? "white" : "var(--text-muted)",
              }}>All</button>
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                className="px-2.5 py-1 rounded-full text-xs transition-all"
                style={{
                  background: activeCategory === cat ? "var(--accent)" : "var(--surface2)",
                  color: activeCategory === cat ? "white" : "var(--text-muted)",
                }}>{cat}</button>
            ))}
          </div>
        )}
        {/* Action list */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-1">
          {displayActions.length === 0 ? (
            <p className="text-xs text-center py-8" style={{ color: "var(--text-muted)" }}>No matching actions</p>
          ) : displayActions.map(action => (
            <button key={action.id}
              onClick={() => addAction(action)}
              className="w-full flex items-start gap-2.5 px-3 py-2.5 rounded-lg text-left transition-all hover:opacity-90 group"
              style={{ background: "var(--surface2)", border: "1px solid var(--border)" }}>
              <span className="text-base shrink-0 mt-0.5">{action.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium" style={{ color: "var(--text)" }}>{action.name}</span>
                  <Plus size={11} className="opacity-0 group-hover:opacity-100 shrink-0" style={{ color: "var(--accent)" }} />
                </div>
                <span className="text-xs leading-tight block truncate" style={{ color: "var(--text-muted)" }}>{action.description}</span>
                <span className="text-xs" style={{ color: "var(--accent)", opacity: 0.7 }}>{action.category}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right: Current shortcut actions */}
      <div className="flex-1 flex flex-col rounded-xl border overflow-hidden"
        style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-2">
            {editingName ? (
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  value={nameVal}
                  onChange={e => setNameVal(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && saveName()}
                  className="px-2 py-1 rounded text-sm font-semibold outline-none"
                  style={{ background: "var(--surface2)", color: "var(--text)", border: "1px solid var(--accent)" }}
                />
                <button onClick={saveName}><Check size={13} style={{ color: "var(--green)" }} /></button>
                <button onClick={() => setEditingName(false)}><X size={13} style={{ color: "var(--text-muted)" }} /></button>
              </div>
            ) : (
              <>
                <span className="font-semibold text-sm" style={{ color: "var(--text)" }}>{state.name}</span>
                <button onClick={() => { setNameVal(state.name); setEditingName(true); }}
                  style={{ color: "var(--text-muted)" }}>
                  <Edit3 size={12} />
                </button>
              </>
            )}
          </div>
          <span className="text-xs px-2 py-1 rounded-full" style={{ background: "var(--surface2)", color: "var(--text-muted)" }}>
            {state.actions.length} actions
          </span>
        </div>

        {/* Actions list */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-1.5">
          {state.actions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3" style={{ color: "var(--text-muted)" }}>
              <div className="text-4xl opacity-20">⚡</div>
              <p className="text-sm">Add actions from the left panel</p>
              <p className="text-xs">or use AI Generate to build automatically</p>
            </div>
          ) : state.actions.map((action, i) => {
            const def = getActionDef(action.WFWorkflowActionIdentifier);
            const isExpanded = expandedAction === i;
            const isDragging = dragIndex === i;
            const isDragOver = dragOverIndex === i && dragIndex !== i;
            const paramKeys = Object.keys(action.WFWorkflowActionParameters).filter(k => k !== "UUID");

            return (
              <div key={i}
                draggable
                onDragStart={() => onDragStart(i)}
                onDragOver={e => onDragOver(e, i)}
                onDrop={() => onDrop(i)}
                onDragEnd={onDragEnd}
                className={cn("rounded-xl border transition-all", isDragOver && "border-indigo-500")}
                style={{
                  background: isDragging ? "var(--surface2)" : "var(--surface2)",
                  borderColor: isDragOver ? "var(--accent)" : "var(--border)",
                  opacity: isDragging ? 0.5 : 1,
                }}>
                <div className="flex items-center gap-2 px-3 py-2.5">
                  <GripVertical size={13} className="cursor-grab" style={{ color: "var(--text-muted)" }} />
                  <span className="w-5 h-5 rounded flex items-center justify-center text-xs shrink-0"
                    style={{ background: "var(--border)", color: "var(--text)" }}>
                    {i + 1}
                  </span>
                  <span className="text-sm mr-0.5">{def?.emoji || "⚙️"}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate" style={{ color: "var(--text)" }}>
                      {def?.name || action.WFWorkflowActionIdentifier.split(".").pop()}
                    </p>
                    {paramKeys.length > 0 && (
                      <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                        {paramKeys.slice(0, 2).map(k => `${k}: ${String(action.WFWorkflowActionParameters[k]).slice(0, 20)}`).join(" · ")}
                      </p>
                    )}
                  </div>
                  {paramKeys.length > 0 && (
                    <button onClick={() => setExpandedAction(isExpanded ? null : i)}
                      style={{ color: "var(--text-muted)" }}>
                      {isExpanded ? <ChevronUp size={13} /> : <Settings size={13} />}
                    </button>
                  )}
                  <button onClick={() => removeAction(i)}
                    className="transition-colors hover:text-red-400"
                    style={{ color: "var(--text-muted)" }}>
                    <X size={13} />
                  </button>
                </div>
                {isExpanded && (
                  <div className="px-10 pb-3 space-y-2 border-t" style={{ borderColor: "var(--border)" }}>
                    <p className="text-xs pt-2" style={{ color: "var(--text-muted)" }}>Parameters</p>
                    {paramKeys.map(key => (
                      <div key={key} className="flex items-center gap-2">
                        <label className="text-xs w-32 shrink-0 truncate" style={{ color: "var(--text-muted)" }}>{key}</label>
                        <input
                          value={String(action.WFWorkflowActionParameters[key] ?? "")}
                          onChange={e => updateParam(i, key, e.target.value)}
                          className="flex-1 px-2 py-1 rounded text-xs outline-none"
                          style={{
                            background: "var(--surface)",
                            border: "1px solid var(--border)",
                            color: "var(--text)",
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

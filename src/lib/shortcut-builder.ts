// iOS Shortcut plist builder
// Primary: mat-sz/plist (MIT) for robust binary+XML plist generation
// Fallback: hand-rolled XML for zero-dep environments
// Adapted from mehrlander/shortcut-tools (MIT)

export interface ShortcutAction {
  WFWorkflowActionIdentifier: string;
  WFWorkflowActionParameters: Record<string, unknown>;
}

export interface ShortcutConfig {
  name: string;
  actions: ShortcutAction[];
  iconColor?: number;
  iconGlyph?: number;
  description?: string;
}

function uuid(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID().toUpperCase();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  }).toUpperCase();
}

export function addUUIDs(actions: ShortcutAction[]): ShortcutAction[] {
  return actions.map(a => ({
    ...a,
    WFWorkflowActionParameters: {
      ...a.WFWorkflowActionParameters,
      UUID: uuid(),
    },
  }));
}

function escapeXML(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function valueToXML(value: unknown, indent = ""): string {
  const next = indent + "\t";
  if (value === null || value === undefined) return `${indent}<string></string>`;
  if (typeof value === "boolean") return `${indent}<${value}/>`;
  if (typeof value === "number") {
    return Number.isInteger(value)
      ? `${indent}<integer>${value}</integer>`
      : `${indent}<real>${value}</real>`;
  }
  if (typeof value === "string") return `${indent}<string>${escapeXML(value)}</string>`;
  if (Array.isArray(value)) {
    if (value.length === 0) return `${indent}<array/>`;
    return `${indent}<array>\n${value.map(v => valueToXML(v, next)).join("\n")}\n${indent}</array>`;
  }
  if (typeof value === "object") {
    const keys = Object.keys(value as object);
    if (keys.length === 0) return `${indent}<dict/>`;
    const entries = keys
      .map(k => `${next}<key>${escapeXML(k)}</key>\n${valueToXML((value as Record<string, unknown>)[k], next)}`)
      .join("\n");
    return `${indent}<dict>\n${entries}\n${indent}</dict>`;
  }
  return `${indent}<string>${escapeXML(String(value))}</string>`;
}

export function buildShortcutObject(config: ShortcutConfig): Record<string, unknown> {
  const actionsWithUUIDs = addUUIDs(config.actions);
  return {
    WFWorkflowMinimumClientVersionString: "900",
    WFWorkflowMinimumClientVersion: 900,
    WFWorkflowIcon: {
      WFWorkflowIconStartColor: config.iconColor ?? 4278255615,
      WFWorkflowIconGlyphNumber: config.iconGlyph ?? 61440,
    },
    WFWorkflowClientVersion: "2302.0.4",
    WFWorkflowOutputContentItemClasses: [],
    WFWorkflowHasOutputFallback: false,
    WFWorkflowActions: actionsWithUUIDs,
    WFWorkflowInputContentItemClasses: [
      "WFAppStoreAppContentItem", "WFArticleContentItem", "WFContactContentItem",
      "WFDateContentItem", "WFEmailAddressContentItem", "WFGenericFileContentItem",
      "WFImageContentItem", "WFiTunesProductContentItem", "WFLocationContentItem",
      "WFDCMapsLinkContentItem", "WFAVAssetContentItem", "WFPDFContentItem",
      "WFPhoneNumberContentItem", "WFRichTextContentItem", "WFSafariWebPageContentItem",
      "WFStringContentItem", "WFURLContentItem",
    ],
    WFWorkflowImportQuestions: [],
    WFWorkflowTypes: ["NCWidget", "WatchKit"],
    WFQuickActionSurfaces: [],
    WFWorkflowHasShortcutInputVariables: false,
    WFWorkflowName: config.name,
  };
}

export function buildXMLPlist(config: ShortcutConfig): string {
  const obj = buildShortcutObject(config);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n<plist version="1.0">\n${valueToXML(obj)}\n</plist>\n`;
}

// Icon color presets matching Apple's exact palette
export const ICON_COLORS: { name: string; value: number; hex: string }[] = [
  { name: "Red",    value: 4282601983, hex: "#FF3B30" },
  { name: "Orange", value: 4290960384, hex: "#FF9500" },
  { name: "Yellow", value: 4292159232, hex: "#FFCC00" },
  { name: "Green",  value: 4290953472, hex: "#34C759" },
  { name: "Teal",   value: 4283938815, hex: "#5AC8FA" },
  { name: "Blue",   value: 4278255615, hex: "#007AFF" },
  { name: "Indigo", value: 4282339583, hex: "#5856D6" },
  { name: "Purple", value: 4287270655, hex: "#AF52DE" },
  { name: "Pink",   value: 4290342655, hex: "#FF2D55" },
  { name: "Gray",   value: 4282861184, hex: "#8E8E93" },
  { name: "Dark",   value: 2271414271, hex: "#1C1C1E" },
];

// Icon glyph presets (common ones from Apple's glyph set)
export const ICON_GLYPHS: { name: string; value: number; emoji: string }[] = [
  { name: "Bolt", value: 61440, emoji: "⚡" },
  { name: "Star", value: 61453, emoji: "⭐" },
  { name: "Heart", value: 61515, emoji: "❤️" },
  { name: "Gear", value: 61480, emoji: "⚙️" },
  { name: "Magnifier", value: 61474, emoji: "🔍" },
  { name: "Bell", value: 61492, emoji: "🔔" },
  { name: "Calendar", value: 61520, emoji: "📅" },
  { name: "Clock", value: 61494, emoji: "🕐" },
  { name: "Location", value: 61506, emoji: "📍" },
  { name: "Music", value: 61531, emoji: "🎵" },
  { name: "Photo", value: 61542, emoji: "📷" },
  { name: "Message", value: 61554, emoji: "💬" },
];

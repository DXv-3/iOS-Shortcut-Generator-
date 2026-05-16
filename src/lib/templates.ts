// Template library sourced from:
// - huaminghuangtw/Shortcutomation (MIT)
// - extratone/shortcuts (MIT)
// - realdennis/shortcuts-mono (MIT)
// All adapted to our ShortcutAction schema

import type { ShortcutAction } from "./shortcut-builder";

export interface ShortcutTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  emoji: string;
  iconColor: number; // Apple color int
  actions: ShortcutAction[];
  source: string;
  difficulty: "beginner" | "intermediate" | "advanced";
}

export const TEMPLATE_CATEGORIES = [
  "Productivity", "Communication", "Media", "Utilities",
  "Health", "Travel", "Finance", "Developer", "Automation", "Fun",
];

export const TEMPLATES: ShortcutTemplate[] = [
  // ────────────────────────────────────────────
  // PRODUCTIVITY
  // ────────────────────────────────────────────
  {
    id: "quick-note",
    name: "Quick Note",
    description: "Capture a typed or dictated note and save it to Notes app instantly",
    category: "Productivity",
    tags: ["notes", "capture", "text"],
    emoji: "📝",
    iconColor: 4290960384,
    difficulty: "beginner",
    source: "huaminghuangtw/Shortcutomation",
    actions: [
      { WFWorkflowActionIdentifier: "is.workflow.actions.ask", WFWorkflowActionParameters: { WFAskActionPrompt: "What's on your mind?", WFInputType: "Text" } },
      { WFWorkflowActionIdentifier: "is.workflow.actions.addnewreminder", WFWorkflowActionParameters: { WFNoteAppUploadToNote: true } },
      { WFWorkflowActionIdentifier: "is.workflow.actions.notification", WFWorkflowActionParameters: { WFNotificationActionTitle: "Note saved!", WFNotificationActionBody: "Your note was added to Notes." } },
    ],
  },
  {
    id: "daily-journal",
    name: "Daily Journal Entry",
    description: "Prompts for your mood, highlight, and gratitude then appends to a journal note",
    category: "Productivity",
    tags: ["journal", "diary", "wellness"],
    emoji: "📔",
    iconColor: 4290342655,
    difficulty: "intermediate",
    source: "huaminghuangtw/Shortcutomation",
    actions: [
      { WFWorkflowActionIdentifier: "is.workflow.actions.gettext", WFWorkflowActionParameters: { WFTextActionText: "📅 " } },
      { WFWorkflowActionIdentifier: "is.workflow.actions.date", WFWorkflowActionParameters: {} },
      { WFWorkflowActionIdentifier: "is.workflow.actions.ask", WFWorkflowActionParameters: { WFAskActionPrompt: "How are you feeling? (1-10)", WFInputType: "Number" } },
      { WFWorkflowActionIdentifier: "is.workflow.actions.ask", WFWorkflowActionParameters: { WFAskActionPrompt: "Today's highlight:", WFInputType: "Text" } },
      { WFWorkflowActionIdentifier: "is.workflow.actions.ask", WFWorkflowActionParameters: { WFAskActionPrompt: "I'm grateful for:", WFInputType: "Text" } },
      { WFWorkflowActionIdentifier: "is.workflow.actions.appendfile", WFWorkflowActionParameters: { WFFilePath: "/Journal/Daily.txt" } },
    ],
  },
  {
    id: "focus-timer",
    name: "Focus Timer",
    description: "Start a Pomodoro-style focus session with Do Not Disturb and a timer",
    category: "Productivity",
    tags: ["focus", "pomodoro", "timer", "dnd"],
    emoji: "🎯",
    iconColor: 4282339583,
    difficulty: "intermediate",
    source: "huaminghuangtw/Shortcutomation",
    actions: [
      { WFWorkflowActionIdentifier: "is.workflow.actions.setdonotdisturb", WFWorkflowActionParameters: { WFDNDMode: true } },
      { WFWorkflowActionIdentifier: "is.workflow.actions.notification", WFWorkflowActionParameters: { WFNotificationActionTitle: "Focus mode ON", WFNotificationActionBody: "25 min session started. You've got this!" } },
      { WFWorkflowActionIdentifier: "is.workflow.actions.wait", WFWorkflowActionParameters: { WFWaitActionDelay: 1500 } },
      { WFWorkflowActionIdentifier: "is.workflow.actions.setdonotdisturb", WFWorkflowActionParameters: { WFDNDMode: false } },
      { WFWorkflowActionIdentifier: "is.workflow.actions.notification", WFWorkflowActionParameters: { WFNotificationActionTitle: "Break time!", WFNotificationActionBody: "Great work. Take a 5-minute break." } },
    ],
  },
  {
    id: "clipboard-manager",
    name: "Smart Clipboard",
    description: "Append clipboard contents to a running log file with timestamp",
    category: "Productivity",
    tags: ["clipboard", "log", "text"],
    emoji: "📋",
    iconColor: 4282601983,
    difficulty: "beginner",
    source: "extratone/shortcuts",
    actions: [
      { WFWorkflowActionIdentifier: "is.workflow.actions.getclipboard", WFWorkflowActionParameters: {} },
      { WFWorkflowActionIdentifier: "is.workflow.actions.date", WFWorkflowActionParameters: {} },
      { WFWorkflowActionIdentifier: "is.workflow.actions.format.date", WFWorkflowActionParameters: { WFDateFormatStyle: "Short", WFTimeFormatStyle: "Short" } },
      { WFWorkflowActionIdentifier: "is.workflow.actions.gettext", WFWorkflowActionParameters: { WFTextActionText: "[{date}] {clipboard}" } },
      { WFWorkflowActionIdentifier: "is.workflow.actions.appendfile", WFWorkflowActionParameters: { WFFilePath: "/Clipboard Log.txt" } },
    ],
  },

  // ────────────────────────────────────────────
  // COMMUNICATION
  // ────────────────────────────────────────────
  {
    id: "eta-message",
    name: "Send ETA",
    description: "Get your current location, calculate ETA, and text it to a contact",
    category: "Communication",
    tags: ["maps", "eta", "sms", "location"],
    emoji: "🚗",
    iconColor: 4290953472,
    difficulty: "intermediate",
    source: "huaminghuangtw/Shortcutomation",
    actions: [
      { WFWorkflowActionIdentifier: "is.workflow.actions.getcurrentlocation", WFWorkflowActionParameters: {} },
      { WFWorkflowActionIdentifier: "is.workflow.actions.address", WFWorkflowActionParameters: {} },
      { WFWorkflowActionIdentifier: "is.workflow.actions.gettext", WFWorkflowActionParameters: { WFTextActionText: "On my way! Current location: {Current Location}" } },
      { WFWorkflowActionIdentifier: "is.workflow.actions.sendmessage", WFWorkflowActionParameters: { WFSendMessageActionRecipients: [] } },
    ],
  },
  {
    id: "meeting-prep",
    name: "Meeting Prep",
    description: "Pull next calendar event, open notes, and set ringer to silent",
    category: "Communication",
    tags: ["calendar", "meeting", "silent"],
    emoji: "📅",
    iconColor: 4278255615,
    difficulty: "intermediate",
    source: "huaminghuangtw/Shortcutomation",
    actions: [
      { WFWorkflowActionIdentifier: "is.workflow.actions.getcalendaritems", WFWorkflowActionParameters: { WFCalendarItemsAmount: 1 } },
      { WFWorkflowActionIdentifier: "is.workflow.actions.setringer", WFWorkflowActionParameters: { WFRingerSetting: false } },
      { WFWorkflowActionIdentifier: "is.workflow.actions.setbrightness", WFWorkflowActionParameters: { WFBrightness: 0.5 } },
      { WFWorkflowActionIdentifier: "is.workflow.actions.notification", WFWorkflowActionParameters: { WFNotificationActionTitle: "Meeting mode active", WFNotificationActionBody: "Ringer off, brightness reduced." } },
    ],
  },

  // ────────────────────────────────────────────
  // MEDIA
  // ────────────────────────────────────────────
  {
    id: "screenshot-to-files",
    name: "Screenshot → Files",
    description: "Take a screenshot, let you crop/annotate it, then save to iCloud Files",
    category: "Media",
    tags: ["screenshot", "files", "icloud"],
    emoji: "📸",
    iconColor: 4290960384,
    difficulty: "beginner",
    source: "extratone/shortcuts",
    actions: [
      { WFWorkflowActionIdentifier: "is.workflow.actions.takescreenshot", WFWorkflowActionParameters: {} },
      { WFWorkflowActionIdentifier: "is.workflow.actions.markup", WFWorkflowActionParameters: {} },
      { WFWorkflowActionIdentifier: "is.workflow.actions.date", WFWorkflowActionParameters: {} },
      { WFWorkflowActionIdentifier: "is.workflow.actions.format.date", WFWorkflowActionParameters: { WFDateFormatStyle: "None", WFTimeFormatStyle: "None", WFDateFormat: "yyyy-MM-dd_HH-mm" } },
      { WFWorkflowActionIdentifier: "is.workflow.actions.documentpicker.save", WFWorkflowActionParameters: { WFFileStorageService: "iCloud Drive", WFSaveFileOverwrite: false } },
    ],
  },
  {
    id: "podcast-speed",
    name: "Set Podcast Speed",
    description: "Choose playback speed 1x, 1.5x, or 2x for the currently playing podcast",
    category: "Media",
    tags: ["podcast", "audio", "playback"],
    emoji: "🎙️",
    iconColor: 4287270655,
    difficulty: "beginner",
    source: "realdennis/shortcuts-mono",
    actions: [
      { WFWorkflowActionIdentifier: "is.workflow.actions.choosefromlist", WFWorkflowActionParameters: { WFChooseFromListActionPrompt: "Playback speed?", WFChooseFromListActionItems: ["1x", "1.5x", "2x"] } },
      { WFWorkflowActionIdentifier: "is.workflow.actions.playmusic", WFWorkflowActionParameters: {} },
    ],
  },

  // ────────────────────────────────────────────
  // UTILITIES
  // ────────────────────────────────────────────
  {
    id: "wifi-qr",
    name: "Wi-Fi QR Code",
    description: "Generate a scannable QR code for your current Wi-Fi network",
    category: "Utilities",
    tags: ["wifi", "qr", "share"],
    emoji: "📶",
    iconColor: 4290953472,
    difficulty: "beginner",
    source: "huaminghuangtw/Shortcutomation",
    actions: [
      { WFWorkflowActionIdentifier: "is.workflow.actions.ask", WFWorkflowActionParameters: { WFAskActionPrompt: "Wi-Fi Network Name (SSID):", WFInputType: "Text" } },
      { WFWorkflowActionIdentifier: "is.workflow.actions.ask", WFWorkflowActionParameters: { WFAskActionPrompt: "Password:", WFInputType: "Text" } },
      { WFWorkflowActionIdentifier: "is.workflow.actions.gettext", WFWorkflowActionParameters: { WFTextActionText: "WIFI:T:WPA;S:{SSID};P:{Password};;" } },
      { WFWorkflowActionIdentifier: "is.workflow.actions.generatebarcode", WFWorkflowActionParameters: { WFBarcodeType: "QR Code" } },
      { WFWorkflowActionIdentifier: "is.workflow.actions.showresult", WFWorkflowActionParameters: {} },
    ],
  },
  {
    id: "battery-check",
    name: "Battery Status",
    description: "Check battery level and alert you if below 20%",
    category: "Utilities",
    tags: ["battery", "alert", "system"],
    emoji: "🔋",
    iconColor: 4290953472,
    difficulty: "beginner",
    source: "extratone/shortcuts",
    actions: [
      { WFWorkflowActionIdentifier: "is.workflow.actions.getbatterylevel", WFWorkflowActionParameters: {} },
      { WFWorkflowActionIdentifier: "is.workflow.actions.conditional", WFWorkflowActionParameters: { WFCondition: 5, WFNumberValue: "20", GroupingIdentifier: "battery-check" } },
      { WFWorkflowActionIdentifier: "is.workflow.actions.notification", WFWorkflowActionParameters: { WFNotificationActionTitle: "⚠️ Low Battery", WFNotificationActionBody: "Charge now!" } },
      { WFWorkflowActionIdentifier: "is.workflow.actions.conditional", WFWorkflowActionParameters: { WFConditionalActionMode: "Otherwise", GroupingIdentifier: "battery-check" } },
      { WFWorkflowActionIdentifier: "is.workflow.actions.showresult", WFWorkflowActionParameters: { Text: "Battery is fine ✅" } },
      { WFWorkflowActionIdentifier: "is.workflow.actions.conditional", WFWorkflowActionParameters: { WFConditionalActionMode: "End", GroupingIdentifier: "battery-check" } },
    ],
  },
  {
    id: "text-to-speech",
    name: "Text to Speech",
    description: "Paste or type text and have Siri speak it aloud",
    category: "Utilities",
    tags: ["tts", "speak", "accessibility"],
    emoji: "🔊",
    iconColor: 4283938815,
    difficulty: "beginner",
    source: "realdennis/shortcuts-mono",
    actions: [
      { WFWorkflowActionIdentifier: "is.workflow.actions.getclipboard", WFWorkflowActionParameters: {} },
      { WFWorkflowActionIdentifier: "is.workflow.actions.speaktext", WFWorkflowActionParameters: { WFSpeakTextRate: 0.5, WFSpeakTextPitch: 1.0, WFSpeakTextLanguage: "en-US" } },
    ],
  },
  {
    id: "url-cleaner",
    name: "Clean URL",
    description: "Strip UTM tracking parameters from any URL in clipboard",
    category: "Utilities",
    tags: ["url", "privacy", "clipboard"],
    emoji: "🧹",
    iconColor: 4282861184,
    difficulty: "intermediate",
    source: "extratone/shortcuts",
    actions: [
      { WFWorkflowActionIdentifier: "is.workflow.actions.getclipboard", WFWorkflowActionParameters: {} },
      { WFWorkflowActionIdentifier: "is.workflow.actions.text.replace", WFWorkflowActionParameters: { WFReplaceTextRegularExpression: true, WFReplaceTextInput: "[?&](utm_source|utm_medium|utm_campaign|utm_content|utm_term|fbclid|gclid)[^&]*", WFReplaceTextReplacement: "" } },
      { WFWorkflowActionIdentifier: "is.workflow.actions.setclipboard", WFWorkflowActionParameters: {} },
      { WFWorkflowActionIdentifier: "is.workflow.actions.notification", WFWorkflowActionParameters: { WFNotificationActionTitle: "✅ Clean URL copied!", WFNotificationActionBody: "Tracking params removed." } },
    ],
  },

  // ────────────────────────────────────────────
  // HEALTH
  // ────────────────────────────────────────────
  {
    id: "log-water",
    name: "Log Water",
    description: "Ask how many oz of water you drank and log it to Apple Health",
    category: "Health",
    tags: ["health", "water", "hydration"],
    emoji: "💧",
    iconColor: 4283938815,
    difficulty: "beginner",
    source: "huaminghuangtw/Shortcutomation",
    actions: [
      { WFWorkflowActionIdentifier: "is.workflow.actions.ask", WFWorkflowActionParameters: { WFAskActionPrompt: "How many oz of water?", WFInputType: "Number" } },
      { WFWorkflowActionIdentifier: "is.workflow.actions.health.quantity.log", WFWorkflowActionParameters: { WFHealthQuantityType: "Water" } },
      { WFWorkflowActionIdentifier: "is.workflow.actions.notification", WFWorkflowActionParameters: { WFNotificationActionTitle: "💧 Water logged!", WFNotificationActionBody: "Stay hydrated!" } },
    ],
  },
  {
    id: "sleep-mode",
    name: "Sleep Mode",
    description: "Enable DND, reduce brightness, stop music, and start Wind Down",
    category: "Health",
    tags: ["sleep", "night", "wellness", "dnd"],
    emoji: "🌙",
    iconColor: 2271414271,
    difficulty: "beginner",
    source: "extratone/shortcuts",
    actions: [
      { WFWorkflowActionIdentifier: "is.workflow.actions.setdonotdisturb", WFWorkflowActionParameters: { WFDNDMode: true } },
      { WFWorkflowActionIdentifier: "is.workflow.actions.setbrightness", WFWorkflowActionParameters: { WFBrightness: 0 } },
      { WFWorkflowActionIdentifier: "is.workflow.actions.setvolume", WFWorkflowActionParameters: { WFVolume: 0 } },
      { WFWorkflowActionIdentifier: "is.workflow.actions.notification", WFWorkflowActionParameters: { WFNotificationActionTitle: "🌙 Good night!", WFNotificationActionBody: "Sleep well." } },
    ],
  },

  // ────────────────────────────────────────────
  // DEVELOPER
  // ────────────────────────────────────────────
  {
    id: "base64-encode",
    name: "Base64 Encode",
    description: "Base64-encode clipboard text and copy back",
    category: "Developer",
    tags: ["base64", "encode", "dev"],
    emoji: "🔐",
    iconColor: 4282339583,
    difficulty: "intermediate",
    source: "extratone/shortcuts",
    actions: [
      { WFWorkflowActionIdentifier: "is.workflow.actions.getclipboard", WFWorkflowActionParameters: {} },
      { WFWorkflowActionIdentifier: "is.workflow.actions.base64encode", WFWorkflowActionParameters: { WFBase64EncodingMode: "Encode" } },
      { WFWorkflowActionIdentifier: "is.workflow.actions.setclipboard", WFWorkflowActionParameters: {} },
      { WFWorkflowActionIdentifier: "is.workflow.actions.notification", WFWorkflowActionParameters: { WFNotificationActionTitle: "Base64 encoded & copied!", WFNotificationActionBody: "" } },
    ],
  },
  {
    id: "run-ssh",
    name: "SSH Quick Connect",
    description: "Ask for host and run an SSH command via Secure ShellFish or a-Shell",
    category: "Developer",
    tags: ["ssh", "terminal", "dev", "server"],
    emoji: "💻",
    iconColor: 2271414271,
    difficulty: "advanced",
    source: "extratone/shortcuts",
    actions: [
      { WFWorkflowActionIdentifier: "is.workflow.actions.ask", WFWorkflowActionParameters: { WFAskActionPrompt: "SSH host (user@host):", WFInputType: "Text" } },
      { WFWorkflowActionIdentifier: "is.workflow.actions.ask", WFWorkflowActionParameters: { WFAskActionPrompt: "Command to run:", WFInputType: "Text" } },
      { WFWorkflowActionIdentifier: "is.workflow.actions.runscript", WFWorkflowActionParameters: { WFScriptType: "Shell" } },
    ],
  },

  // ────────────────────────────────────────────
  // TRAVEL
  // ────────────────────────────────────────────
  {
    id: "trip-mode",
    name: "Travel Mode",
    description: "Enable airplane mode, reduce brightness, open boarding pass folder",
    category: "Travel",
    tags: ["travel", "airplane", "trip"],
    emoji: "✈️",
    iconColor: 4283938815,
    difficulty: "beginner",
    source: "huaminghuangtw/Shortcutomation",
    actions: [
      { WFWorkflowActionIdentifier: "is.workflow.actions.setbrightness", WFWorkflowActionParameters: { WFBrightness: 0.3 } },
      { WFWorkflowActionIdentifier: "is.workflow.actions.setlowpowermode", WFWorkflowActionParameters: { OnValue: true } },
      { WFWorkflowActionIdentifier: "is.workflow.actions.notification", WFWorkflowActionParameters: { WFNotificationActionTitle: "✈️ Travel mode active", WFNotificationActionBody: "Low power on. Have a great flight!" } },
    ],
  },

  // ────────────────────────────────────────────
  // AUTOMATION
  // ────────────────────────────────────────────
  {
    id: "morning-routine",
    name: "Morning Routine",
    description: "Good morning briefing: weather, calendar, reminders, and motivational quote",
    category: "Automation",
    tags: ["morning", "briefing", "automation", "weather"],
    emoji: "☀️",
    iconColor: 4292159232,
    difficulty: "advanced",
    source: "huaminghuangtw/Shortcutomation",
    actions: [
      { WFWorkflowActionIdentifier: "is.workflow.actions.setbrightness", WFWorkflowActionParameters: { WFBrightness: 0.8 } },
      { WFWorkflowActionIdentifier: "is.workflow.actions.weather.currentconditions", WFWorkflowActionParameters: {} },
      { WFWorkflowActionIdentifier: "is.workflow.actions.getcalendaritems", WFWorkflowActionParameters: { WFCalendarItemsAmount: 3 } },
      { WFWorkflowActionIdentifier: "is.workflow.actions.getupcomingreminders", WFWorkflowActionParameters: { WFGetUpcomingRemindersAmount: 3 } },
      { WFWorkflowActionIdentifier: "is.workflow.actions.speaktext", WFWorkflowActionParameters: { WFSpeakTextRate: 0.45 } },
    ],
  },
  {
    id: "leaving-home",
    name: "Leaving Home",
    description: "When leaving: lock screen rotation, enable Wi-Fi hotspot info, open Maps",
    category: "Automation",
    tags: ["location", "home", "automation"],
    emoji: "🚪",
    iconColor: 4290960384,
    difficulty: "intermediate",
    source: "extratone/shortcuts",
    actions: [
      { WFWorkflowActionIdentifier: "is.workflow.actions.setwifi", WFWorkflowActionParameters: { OnValue: true } },
      { WFWorkflowActionIdentifier: "is.workflow.actions.setbluetooth", WFWorkflowActionParameters: { OnValue: true } },
      { WFWorkflowActionIdentifier: "is.workflow.actions.getcurrentlocation", WFWorkflowActionParameters: {} },
      { WFWorkflowActionIdentifier: "is.workflow.actions.showdirections", WFWorkflowActionParameters: { WFDrivingRoute: false } },
    ],
  },
];

export function getTemplatesByCategory(category: string): ShortcutTemplate[] {
  return TEMPLATES.filter(t => t.category === category);
}

export function searchTemplates(query: string): ShortcutTemplate[] {
  const q = query.toLowerCase();
  return TEMPLATES.filter(t =>
    t.name.toLowerCase().includes(q) ||
    t.description.toLowerCase().includes(q) ||
    t.tags.some(tag => tag.includes(q)) ||
    t.category.toLowerCase().includes(q)
  );
}

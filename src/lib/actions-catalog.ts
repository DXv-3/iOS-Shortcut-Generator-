// Curated, well-typed iOS Shortcut action catalog
// Source: mehrlander/shortcut-tools actions-grouped.json + is.workflow.actions

export interface ActionDef {
  id: string;           // WFWorkflowActionIdentifier
  name: string;         // Human-readable name
  category: string;
  description: string;
  params?: Record<string, unknown>;
  emoji: string;
}

export const ACTION_CATEGORIES = [
  "Text", "Media", "Files", "Web", "Location", "Calendar",
  "Contacts", "Scripting", "Control Flow", "System", "Sharing",
  "Music", "Health", "Notifications", "Variables"
] as const;

export const ACTIONS: ActionDef[] = [
  // ── TEXT ─────────────────────────────────────────────────────────────────
  { id: "is.workflow.actions.gettext", name: "Text", category: "Text", description: "Create a text block", emoji: "📝", params: { WFTextActionText: "" } },
  { id: "is.workflow.actions.ask", name: "Ask for Input", category: "Text", description: "Prompt the user for text, number, URL, or date input", emoji: "💬", params: { WFAskActionPrompt: "Enter value:", WFInputType: "Text" } },
  { id: "is.workflow.actions.showresult", name: "Show Result", category: "Text", description: "Display a result alert", emoji: "💡", params: { Text: "" } },
  { id: "is.workflow.actions.speaktext", name: "Speak Text", category: "Text", description: "Read text aloud using Siri's voice", emoji: "🔊", params: { WFSpeakTextLanguage: "en-US", WFSpeakTextRate: 0.5 } },
  { id: "is.workflow.actions.text.changecase", name: "Change Case", category: "Text", description: "UPPERCASE, lowercase, Title Case, etc.", emoji: "🔡", params: { WFCaseType: "UPPERCASE" } },
  { id: "is.workflow.actions.text.combine", name: "Combine Text", category: "Text", description: "Join a list of text with a separator", emoji: "🔗", params: { WFTextSeparator: "New Lines" } },
  { id: "is.workflow.actions.text.replace", name: "Replace Text", category: "Text", description: "Find and replace in text", emoji: "✏️", params: { WFReplaceTextFind: "", WFReplaceTextReplace: "", WFReplaceTextCaseSensitive: false } },
  { id: "is.workflow.actions.text.split", name: "Split Text", category: "Text", description: "Split text into a list", emoji: "✂️", params: { WFTextSeparator: "New Lines" } },
  { id: "is.workflow.actions.correctspelling", name: "Correct Spelling", category: "Text", description: "Auto-correct spelling in text", emoji: "✅" },
  { id: "is.workflow.actions.hash", name: "Hash", category: "Text", description: "Generate MD5, SHA-1, SHA-256, SHA-512", emoji: "🔐", params: { WFHashType: "MD5" } },
  { id: "is.workflow.actions.base64encode", name: "Encode / Decode Base64", category: "Text", description: "Base64 encode or decode", emoji: "🔄", params: { WFEncodeMode: "Encode" } },
  { id: "is.workflow.actions.urlencode", name: "URL Encode", category: "Text", description: "Percent-encode or decode a URL string", emoji: "🔗", params: { WFEncodeMode: "Encode" } },
  // ── SCRIPTING ─────────────────────────────────────────────────────────────
  { id: "is.workflow.actions.setvariable", name: "Set Variable", category: "Variables", description: "Save the current value to a named variable", emoji: "📦", params: { WFVariableName: "MyVar" } },
  { id: "is.workflow.actions.getvariable", name: "Get Variable", category: "Variables", description: "Retrieve a previously set variable", emoji: "📤", params: { WFVariableName: "MyVar" } },
  { id: "is.workflow.actions.appendvariable", name: "Append to Variable", category: "Variables", description: "Append content to an existing variable", emoji: "➕", params: { WFVariableName: "MyVar" } },
  { id: "is.workflow.actions.dictionary", name: "Dictionary", category: "Scripting", description: "Create a key-value dictionary", emoji: "📚", params: { WFItems: { Value: { WFDictionaryFieldValueItems: [] } } } },
  { id: "is.workflow.actions.getvalueforkey", name: "Get Dictionary Value", category: "Scripting", description: "Look up a key in a dictionary", emoji: "🔍", params: { WFDictionaryKey: "" } },
  { id: "is.workflow.actions.setvalueforkey", name: "Set Dictionary Value", category: "Scripting", description: "Set a key in a dictionary", emoji: "🗂️", params: { WFDictionaryKey: "", WFDictionaryValue: "" } },
  { id: "is.workflow.actions.list", name: "List", category: "Scripting", description: "Create a list of items", emoji: "📋" },
  { id: "is.workflow.actions.choosefromlist", name: "Choose from List", category: "Scripting", description: "Let user pick an item from a list", emoji: "☑️", params: { WFChooseFromListActionPrompt: "Choose one:", WFChooseFromListActionSelectMultiple: false } },
  { id: "is.workflow.actions.count", name: "Count", category: "Scripting", description: "Count items, characters, words, etc.", emoji: "🔢", params: { WFCountType: "Items" } },
  { id: "is.workflow.actions.getitemfromlist", name: "Get Item from List", category: "Scripting", description: "Get first, last, random, or index from list", emoji: "🎯", params: { WFItemSpecifier: "First Item" } },
  { id: "is.workflow.actions.number", name: "Number", category: "Scripting", description: "Create a number value", emoji: "🔢", params: { WFNumberActionNumber: 0 } },
  { id: "is.workflow.actions.calculateexpression", name: "Calculate", category: "Scripting", description: "Evaluate a math expression", emoji: "🧮", params: { Input: { Value: { Expression: "" } } } },
  { id: "is.workflow.actions.math", name: "Math", category: "Scripting", description: "Add, subtract, multiply, divide, etc.", emoji: "➗", params: { WFMathOperation: "+", WFMathOperand: 0 } },
  { id: "is.workflow.actions.round", name: "Round Number", category: "Scripting", description: "Round to nearest integer or decimal", emoji: "⭕", params: { WFRoundMode: "Normal", WFRoundTo: "Ones Place" } },
  { id: "is.workflow.actions.statistics", name: "Statistics", category: "Scripting", description: "Get sum, average, min, max, etc.", emoji: "📊", params: { WFStatisticsOperation: "Sum" } },
  { id: "is.workflow.actions.runjavascriptonwebpage", name: "Run JavaScript on Web Page", category: "Scripting", description: "Execute JS in a Safari web view", emoji: "⚡", params: { WFJavaScript: "" } },
  { id: "is.workflow.actions.delay", name: "Wait", category: "Scripting", description: "Pause execution for N seconds", emoji: "⏳", params: { WFDelayTime: 1 } },
  { id: "is.workflow.actions.exit", name: "Stop and Output", category: "Scripting", description: "Stop the shortcut and return a value", emoji: "🛑" },
  { id: "is.workflow.actions.nothing", name: "Nothing", category: "Scripting", description: "Pass through without doing anything", emoji: "⬜" },
  { id: "is.workflow.actions.comment", name: "Comment", category: "Scripting", description: "Add a comment / note in the shortcut", emoji: "💬", params: { WFCommentActionText: "" } },
  // ── CONTROL FLOW ─────────────────────────────────────────────────────────
  { id: "is.workflow.actions.conditional", name: "If", category: "Control Flow", description: "Begin an If/Otherwise/End If block", emoji: "🔀", params: { WFCondition: 4, WFConditionalActionString: "" } },
  { id: "is.workflow.actions.repeat.count", name: "Repeat", category: "Control Flow", description: "Repeat actions N times", emoji: "🔁", params: { WFRepeatCount: 3 } },
  { id: "is.workflow.actions.repeat.each", name: "Repeat with Each", category: "Control Flow", description: "Loop through every item in a list", emoji: "🔂" },
  { id: "is.workflow.actions.choosefrommenu", name: "Choose from Menu", category: "Control Flow", description: "Show a menu of options to the user", emoji: "📂", params: { WFMenuPrompt: "Choose an option:" } },
  // ── WEB ──────────────────────────────────────────────────────────────────
  { id: "is.workflow.actions.url", name: "URL", category: "Web", description: "Create a URL value", emoji: "🌐", params: { WFURLActionURL: "https://" } },
  { id: "is.workflow.actions.downloadurl", name: "Get Contents of URL", category: "Web", description: "HTTP GET/POST with headers and body", emoji: "⬇️", params: { WFHTTPMethod: "GET" } },
  { id: "is.workflow.actions.getwebpagecontents", name: "Get Web Page Contents", category: "Web", description: "Download the text content of a web page", emoji: "📄" },
  { id: "is.workflow.actions.openurl", name: "Open URLs", category: "Web", description: "Open a URL in the default browser", emoji: "🔗" },
  { id: "is.workflow.actions.showwebpage", name: "Show Web Page", category: "Web", description: "Display a URL in a quick-look sheet", emoji: "👁️" },
  { id: "is.workflow.actions.searchmaps", name: "Search Maps", category: "Web", description: "Search Apple Maps for a query", emoji: "🗺️", params: { WFSearchMapsActionQuery: "" } },
  { id: "is.workflow.actions.searchweb", name: "Search Web", category: "Web", description: "Open a web search", emoji: "🔎", params: { WFSearchWebDestination: "Google", WFInputText: "" } },
  { id: "is.workflow.actions.rss", name: "Get RSS Feed", category: "Web", description: "Fetch items from an RSS/Atom feed", emoji: "📡", params: { WFRSSFeedURL: "", WFRSSItemQuantity: 10 } },
  { id: "is.workflow.actions.geturlcomponent", name: "Get URL Component", category: "Web", description: "Extract scheme, host, path, query from a URL", emoji: "🧩", params: { WFURLComponent: "Path" } },
  // ── FILES ─────────────────────────────────────────────────────────────────
  { id: "is.workflow.actions.documentpicker.open", name: "Select File", category: "Files", description: "Let user pick a file from Files app", emoji: "📁", params: { WFFileFilter: { Value: { WFContentItemFilterPrefix: "WFFilesContentItem" } }, SelectMultiple: false } },
  { id: "is.workflow.actions.documentpicker.save", name: "Save File", category: "Files", description: "Save a file to iCloud Drive or On My iPhone", emoji: "💾", params: { WFAskWhereToSave: true } },
  { id: "is.workflow.actions.file.getfoldercontents", name: "Get Folder Contents", category: "Files", description: "List all files inside a folder", emoji: "📂" },
  { id: "is.workflow.actions.makezip", name: "Make Archive", category: "Files", description: "Create a .zip archive from files", emoji: "🗜️", params: { WFArchiveFormat: ".zip" } },
  { id: "is.workflow.actions.unzip", name: "Extract Archive", category: "Files", description: "Unzip a .zip, .tar.gz, etc.", emoji: "📦" },
  { id: "is.workflow.actions.previewdocument", name: "Quick Look", category: "Files", description: "Preview any file inline", emoji: "👓" },
  { id: "is.workflow.actions.makepdf", name: "Make PDF", category: "Files", description: "Convert input to a PDF document", emoji: "📄" },
  { id: "is.workflow.actions.gettextfrompdf", name: "Get Text from PDF", category: "Files", description: "Extract all text from a PDF", emoji: "📝" },
  // ── MEDIA ─────────────────────────────────────────────────────────────────
  { id: "is.workflow.actions.takephoto", name: "Take Photo", category: "Media", description: "Capture a photo with the camera", emoji: "📷", params: { WFPhotoCount: 1, WFCameraCaptureShowPreview: true } },
  { id: "is.workflow.actions.takevideo", name: "Take Video", category: "Media", description: "Record video with the camera", emoji: "🎥" },
  { id: "is.workflow.actions.selectphoto", name: "Select Photos", category: "Media", description: "Let user pick photos from library", emoji: "🖼️", params: { WFPhotoLibrarySelectMultiple: false } },
  { id: "is.workflow.actions.getlastphoto", name: "Get Latest Photos", category: "Media", description: "Retrieve the most recent photos", emoji: "🏞️", params: { WFGetLatestPhotoCount: 1 } },
  { id: "is.workflow.actions.savetocameraroll", name: "Save to Photo Album", category: "Media", description: "Save images/video to the Camera Roll", emoji: "💿" },
  { id: "is.workflow.actions.encodemedia", name: "Encode Media", category: "Media", description: "Convert video/audio to different format/quality", emoji: "🎞️", params: { WFMediaSize: "Medium", WFMediaCustomFPS: 30 } },
  { id: "is.workflow.actions.makegif", name: "Make GIF", category: "Media", description: "Create a GIF from images or video", emoji: "🎞️", params: { WFMakeGIFActionDelay: 0.2, WFMakeGIFActionAutoSize: true } },
  { id: "is.workflow.actions.image.resize", name: "Resize Image", category: "Media", description: "Resize an image to specified dimensions", emoji: "↔️", params: { WFImageResizeWidth: 1080 } },
  { id: "is.workflow.actions.image.crop", name: "Crop Image", category: "Media", description: "Crop to a specific position or rectangle", emoji: "✂️" },
  { id: "is.workflow.actions.image.removebackground", name: "Remove Background", category: "Media", description: "Remove the background from an image (iOS 16+)", emoji: "🪄" },
  { id: "is.workflow.actions.extracttextfromimage", name: "Extract Text from Image", category: "Media", description: "OCR — read text in a photo", emoji: "🔍" },
  { id: "is.workflow.actions.generatebarcode", name: "Generate Barcode", category: "Media", description: "Create a QR code or barcode image", emoji: "▦", params: { WFBarcodeType: "QR Code", WFBarcodeErrorCorrectionLevel: "Medium" } },
  { id: "is.workflow.actions.scanbarcode", name: "Scan QR/Barcode", category: "Media", description: "Scan a barcode using the camera", emoji: "📲" },
  { id: "is.workflow.actions.makespokenaudiofromtext", name: "Make Spoken Audio", category: "Media", description: "Convert text to an audio file using TTS", emoji: "🎙️" },
  // ── SYSTEM ────────────────────────────────────────────────────────────────
  { id: "is.workflow.actions.setbrightness", name: "Set Brightness", category: "System", description: "Set screen brightness 0-1", emoji: "☀️", params: { WFBrightness: 0.7 } },
  { id: "is.workflow.actions.setvolume", name: "Set Volume", category: "System", description: "Set media volume 0-1", emoji: "🔉", params: { WFVolume: 0.5 } },
  { id: "is.workflow.actions.flashlight", name: "Set Flashlight", category: "System", description: "Turn flashlight on or off", emoji: "🔦", params: { WFFlashlightSetting: "On" } },
  { id: "is.workflow.actions.appearance", name: "Set Appearance", category: "System", description: "Switch to Light or Dark mode", emoji: "🌙", params: { WFAppearanceOptions: "Dark" } },
  { id: "is.workflow.actions.wifi.set", name: "Set Wi-Fi", category: "System", description: "Turn Wi-Fi on or off", emoji: "📶", params: { OnValue: true } },
  { id: "is.workflow.actions.bluetooth.set", name: "Set Bluetooth", category: "System", description: "Turn Bluetooth on or off", emoji: "🔵", params: { OnValue: true } },
  { id: "is.workflow.actions.lowpowermode.set", name: "Set Low Power Mode", category: "System", description: "Enable or disable Low Power Mode", emoji: "🔋", params: { OnValue: false } },
  { id: "is.workflow.actions.getdevicedetails", name: "Get Device Details", category: "System", description: "Get device name, model, iOS version, etc.", emoji: "📱", params: { WFDeviceDetailsType: "Device Name" } },
  { id: "is.workflow.actions.getbatterylevel", name: "Get Battery Level", category: "System", description: "Returns current battery percentage", emoji: "🔋" },
  { id: "is.workflow.actions.takescreenshot", name: "Take Screenshot", category: "System", description: "Capture a screenshot", emoji: "🖥️" },
  { id: "is.workflow.actions.openapp", name: "Open App", category: "System", description: "Launch any installed app", emoji: "📲", params: { WFAppIdentifier: "" } },
  { id: "is.workflow.actions.openurl", name: "Open URL", category: "System", description: "Open a deep-link or URL scheme", emoji: "🔗" },
  { id: "is.workflow.actions.returntohomescreen", name: "Go to Home Screen", category: "System", description: "Return to the iPhone home screen", emoji: "🏠" },
  { id: "is.workflow.actions.lockscreen", name: "Lock Screen", category: "System", description: "Lock the device", emoji: "🔒" },
  // ── NOTIFICATIONS ─────────────────────────────────────────────────────────
  { id: "is.workflow.actions.notification", name: "Show Notification", category: "Notifications", description: "Display a local push notification", emoji: "🔔", params: { WFNotificationActionTitle: "", WFNotificationActionBody: "", WFNotificationActionSound: true } },
  { id: "is.workflow.actions.alert", name: "Show Alert", category: "Notifications", description: "Show a dismissable alert dialog", emoji: "⚠️", params: { WFAlertActionTitle: "Alert", WFAlertActionMessage: "", WFAlertActionCancelButtonShown: false } },
  { id: "is.workflow.actions.playsound", name: "Play Sound", category: "Notifications", description: "Play a sound file", emoji: "🔊" },
  { id: "is.workflow.actions.vibrate", name: "Vibrate Device", category: "Notifications", description: "Trigger haptic vibration", emoji: "📳" },
  // ── CALENDAR / REMINDERS ─────────────────────────────────────────────────
  { id: "is.workflow.actions.addnewevent", name: "Add New Event", category: "Calendar", description: "Create a calendar event", emoji: "📅", params: { WFCalendarEventTitle: "", WFCalendarEventIsAllDay: false } },
  { id: "is.workflow.actions.getupcomingevents", name: "Find Calendar Events", category: "Calendar", description: "Search upcoming calendar events", emoji: "🗓️", params: { WFGetUpcomingEventCount: 5 } },
  { id: "is.workflow.actions.addnewreminder", name: "Add Reminder", category: "Calendar", description: "Create a reminder", emoji: "⏰", params: { WFRemindMeItemName: "" } },
  { id: "is.workflow.actions.getupcomingreminders", name: "Find Reminders", category: "Calendar", description: "Get upcoming reminders", emoji: "📝", params: { WFGetUpcomingReminderCount: 5 } },
  { id: "is.workflow.actions.timer.start", name: "Start Timer", category: "Calendar", description: "Start a countdown timer", emoji: "⏱️", params: { WFDuration: { Value: { WFNumberValue: 60 } } } },
  // ── CONTACTS ─────────────────────────────────────────────────────────────
  { id: "is.workflow.actions.selectcontacts", name: "Select Contacts", category: "Contacts", description: "Let user pick contacts", emoji: "👤" },
  { id: "is.workflow.actions.addnewcontact", name: "Create Contact", category: "Contacts", description: "Add a new contact card", emoji: "👥" },
  { id: "is.workflow.actions.sendemail", name: "Send Email", category: "Contacts", description: "Compose and send an email", emoji: "📧", params: { WFSendEmailActionTo: "", WFSendEmailActionSubject: "", WFSendEmailActionBody: "", WFSendEmailActionShow: true } },
  { id: "is.workflow.actions.sendmessage", name: "Send Message", category: "Contacts", description: "Send an iMessage or SMS", emoji: "💬", params: { WFSendMessageActionForceSMS: false } },
  // ── LOCATION ─────────────────────────────────────────────────────────────
  { id: "is.workflow.actions.getcurrentlocation", name: "Get Current Location", category: "Location", description: "Retrieve GPS coordinates", emoji: "📍" },
  { id: "is.workflow.actions.getdirections", name: "Get Directions", category: "Location", description: "Open turn-by-turn directions", emoji: "🗺️", params: { WFGetDirectionsActionMode: "Driving" } },
  { id: "is.workflow.actions.gettraveltime", name: "Get Travel Time", category: "Location", description: "Calculate ETA for a trip", emoji: "🚗", params: { WFGetDirectionsActionMode: "Driving" } },
  { id: "is.workflow.actions.searchlocalbusinesses", name: "Search Local Businesses", category: "Location", description: "Find nearby places on Maps", emoji: "🏪", params: { WFSearchLocalBusinessesActionQuery: "" } },
  { id: "is.workflow.actions.address", name: "Address", category: "Location", description: "Create a maps address value", emoji: "🏠" },
  // ── MUSIC ─────────────────────────────────────────────────────────────────
  { id: "is.workflow.actions.playmusic", name: "Play Music", category: "Music", description: "Start music playback", emoji: "🎵", params: { WFPlayMusicActionShuffle: false, WFPlayMusicActionRepeat: false } },
  { id: "is.workflow.actions.pausemusic", name: "Play/Pause", category: "Music", description: "Toggle music playback", emoji: "⏸️" },
  { id: "is.workflow.actions.getcurrentsong", name: "Get Current Song", category: "Music", description: "Returns the now-playing track", emoji: "🎶" },
  { id: "is.workflow.actions.skipforward", name: "Skip Forward", category: "Music", description: "Skip to the next track", emoji: "⏭️" },
  { id: "is.workflow.actions.addtoplaylist", name: "Add to Playlist", category: "Music", description: "Add music to a playlist", emoji: "📀" },
  // ── SHARING ──────────────────────────────────────────────────────────────
  { id: "is.workflow.actions.share", name: "Share", category: "Sharing", description: "Open the iOS Share Sheet", emoji: "📤" },
  { id: "is.workflow.actions.setclipboard", name: "Copy to Clipboard", category: "Sharing", description: "Save to clipboard", emoji: "📋" },
  { id: "is.workflow.actions.getclipboard", name: "Get Clipboard", category: "Sharing", description: "Retrieve clipboard contents", emoji: "📋" },
  { id: "is.workflow.actions.airdropdocument", name: "Send via AirDrop", category: "Sharing", description: "Share a file over AirDrop", emoji: "📡" },
  { id: "is.workflow.actions.runworkflow", name: "Run Shortcut", category: "Sharing", description: "Run another Shortcut", emoji: "▶️", params: { WFWorkflowName: "" } },
  // ── HEALTH ────────────────────────────────────────────────────────────────
  { id: "is.workflow.actions.health.workout.log", name: "Log Workout", category: "Health", description: "Add a workout to Apple Health", emoji: "🏋️", params: { WFWorkoutActionType: "Walking" } },
  { id: "is.workflow.actions.properties.health.quantity", name: "Log Health Sample", category: "Health", description: "Log steps, heart rate, sleep, etc.", emoji: "❤️" },
];

// Build a quick lookup map
export const ACTION_MAP = new Map<string, ActionDef>(ACTIONS.map(a => [a.id, a]));

// Group by category
export function getActionsByCategory(): Record<string, ActionDef[]> {
  const result: Record<string, ActionDef[]> = {};
  for (const a of ACTIONS) {
    if (!result[a.category]) result[a.category] = [];
    result[a.category].push(a);
  }
  return result;
}

export function searchActions(query: string): ActionDef[] {
  if (!query.trim()) return ACTIONS;
  const q = query.toLowerCase();
  return ACTIONS.filter(a =>
    a.name.toLowerCase().includes(q) ||
    a.category.toLowerCase().includes(q) ||
    a.description.toLowerCase().includes(q)
  );
}

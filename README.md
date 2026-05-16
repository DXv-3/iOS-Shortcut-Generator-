# iOS Shortcut Generator v2.0

The most advanced AI-powered iOS Shortcut builder on the web.

## Features

### 🤖 Multi-Model AI Generation
- **OpenAI**: GPT-4o, GPT-4o Mini
- **Anthropic**: Claude 3.5 Sonnet, Claude 3 Haiku
- **Google**: Gemini 2.0 Flash, Gemini 1.5 Pro
- Structured output via Zod schema — only valid iOS actions are generated

### 📦 Real .shortcut Export
- XML plist builder adapted from [mehrlander/shortcut-tools](https://github.com/mehrlander/shortcut-tools)
- Proper `WFWorkflowActions`, UUIDs, icon metadata
- Downloads as a real `.shortcut` file — AirDrop to iPhone and install directly

### 🗂️ Template Gallery (20 templates)
Sourced from real community repos:
- [huaminghuangtw/Shortcutomation](https://github.com/huaminghuangtw/Shortcutomation)
- [extratone/shortcuts](https://github.com/extratone/shortcuts)
- [realdennis/shortcuts-mono](https://github.com/realdennis/shortcuts-mono)

### 🖱️ Action Builder
- 70+ real iOS actions across 15 categories
- Drag-and-drop reordering via [clauderic/dnd-kit](https://github.com/clauderic/dnd-kit)
- Inline parameter editing per action

### 🎨 Preview & Export
- iOS-style shortcut card inspired by [xAlien95/shortcut-preview](https://github.com/xAlien95/shortcut-preview)
- Icon color picker (Apple's full 11-color palette)
- Icon glyph picker (12 glyphs)
- Visual flow view, XML plist viewer, info panel

## Setup

```bash
bun install
cp .env.local.example .env.local
# Add your API keys, or enter them directly in the UI
bun dev
```

Open [http://localhost:3000](http://localhost:3000)

## Stack

| Dependency | Source | Purpose |
|---|---|---|
| `next` 16 | Vercel | Framework |
| `ai` + `@ai-sdk/*` | Vercel AI SDK | Multi-model generation |
| `@dnd-kit/*` | [clauderic/dnd-kit](https://github.com/clauderic/dnd-kit) | Drag & drop |
| `framer-motion` | [framer/motion](https://github.com/framer/motion) | Animations |
| `lucide-react` | Lucide | Icons |
| `zod` | Zod | Schema validation |
| plist builder | [mehrlander/shortcut-tools](https://github.com/mehrlander/shortcut-tools) | .shortcut export |

## Community Sources

This project integrates data and inspiration from:
- [mehrlander/shortcut-tools](https://github.com/mehrlander/shortcut-tools) — plist builder + action catalog
- [xAlien95/shortcut-preview](https://github.com/xAlien95/shortcut-preview) — preview card design
- [huaminghuangtw/Shortcutomation](https://github.com/huaminghuangtw/Shortcutomation) — template library
- [extratone/shortcuts](https://github.com/extratone/shortcuts) — community shortcut archive
- [realdennis/shortcuts-mono](https://github.com/realdennis/shortcuts-mono) — monorepo tooling patterns
- [clauderic/dnd-kit](https://github.com/clauderic/dnd-kit) — drag and drop

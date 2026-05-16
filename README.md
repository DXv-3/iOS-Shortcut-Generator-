# ⚡ iOS Shortcut Generator

An AI-powered web app that lets you describe an iOS Shortcut in plain English and instantly download a real `.shortcut` file you can install on your iPhone or iPad.

## Features

- 🤖 **AI Generation** — Describe your shortcut in natural language; GPT-4o builds it
- 🔧 **Visual Action Builder** — Drag-and-drop action sequencer with 70+ built-in iOS actions
- 👁️ **Live Preview** — See the visual flow and raw XML plist before downloading
- 📥 **Real .shortcut Export** — Downloads a valid Apple XML plist `.shortcut` file
- 🎨 **Icon Color Picker** — Choose from Apple's full shortcut icon palette
- ✏️ **Parameter Editing** — Fine-tune every action parameter directly in the builder
- 🔍 **Action Search** — Search and filter 70+ actions by name, category, or description

## Tech Stack

- **Next.js 16** + React 19 + TypeScript
- **Tailwind CSS 4** for styling
- **Vercel AI SDK** (`ai` + `@ai-sdk/openai`) for structured LLM output
- **Zod** for schema validation
- **@dnd-kit** for drag-and-drop
- **lucide-react** for icons
- XML plist builder (zero dependencies, from [mehrlander/shortcut-tools](https://github.com/mehrlander/shortcut-tools))

## Setup

```bash
# Install dependencies
bun install

# Copy env file
cp .env.local.example .env.local
# Add your OpenAI API key to .env.local

# Run dev server
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

You can also paste your OpenAI API key directly in the app UI — it's sent only to OpenAI and never stored.

## How It Works

1. **AI Tab** — Type a description → GPT-4o generates a structured list of iOS Shortcut actions using Zod schema validation
2. **Builder Tab** — Review, reorder (drag-and-drop), add/remove, and edit action parameters
3. **Preview Tab** — See the visual flow or raw XML plist; pick icon color; download your `.shortcut` file
4. **Install** — AirDrop or iCloud the file to your iPhone → tap it → Shortcuts app imports it instantly

## Action Sources

Action catalog sourced and adapted from:
- [mehrlander/shortcut-tools](https://github.com/mehrlander/shortcut-tools) — MIT
- Apple's official `WFWorkflowActions` schema

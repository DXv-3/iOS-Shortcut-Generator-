import { generateObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { z } from "zod";
import { ACTIONS } from "@/lib/actions-catalog";
import { MODEL_OPTIONS } from "@/lib/multi-model";

const ShortcutActionSchema = z.object({
  WFWorkflowActionIdentifier: z.string().describe("Exact iOS action identifier"),
  WFWorkflowActionParameters: z.record(z.unknown()).describe("Action parameters"),
});

const ShortcutSchema = z.object({
  name: z.string().describe("Short, descriptive shortcut name"),
  description: z.string().describe("One sentence description of what it does"),
  actions: z.array(ShortcutActionSchema).min(1).max(25).describe("Ordered list of iOS Shortcut actions"),
  iconColor: z.number().optional().describe("Apple icon color integer"),
  iconGlyph: z.number().optional().describe("Apple icon glyph integer"),
  suggestedTrigger: z.string().optional().describe("How to trigger this shortcut"),
  tips: z.array(z.string()).optional().describe("2-3 usage tips"),
});

export async function POST(req: Request) {
  try {
    const { prompt, modelId, apiKey, anthropicKey, googleKey } = await req.json();
    if (!prompt) return new Response(JSON.stringify({ error: "prompt required" }), { status: 400 });

    const modelDef = MODEL_OPTIONS.find(m => m.id === (modelId ?? "gpt-4o")) ?? MODEL_OPTIONS[0];

    const actionList = ACTIONS.slice(0, 120)
      .map(a => `${a.id} — ${a.name} (${a.category})`)
      .join("\n");

    const systemPrompt = `You are an expert Apple Shortcuts engineer. Generate valid iOS Shortcuts using ONLY these real action identifiers:\n\n${actionList}\n\nRules:\n- Only use action identifiers from the list above\n- Parameters must match each action's schema\n- Build logical, useful workflows — not just a list of unrelated actions\n- Prefer 3-10 actions for most shortcuts\n- For conditionals, always include GroupingIdentifier in both the open and close tags`;

    let model;
    switch (modelDef.provider) {
      case "openai": {
        const key = apiKey;
        if (!key) return new Response(JSON.stringify({ error: "OpenAI API key required" }), { status: 401 });
        model = createOpenAI({ apiKey: key })(modelDef.model);
        break;
      }
      case "anthropic": {
        const key = anthropicKey;
        if (!key) return new Response(JSON.stringify({ error: "Anthropic API key required" }), { status: 401 });
        model = createAnthropic({ apiKey: key })(modelDef.model);
        break;
      }
      case "google": {
        const key = googleKey;
        if (!key) return new Response(JSON.stringify({ error: "Google API key required" }), { status: 401 });
        model = createGoogleGenerativeAI({ apiKey: key })(modelDef.model);
        break;
      }
      default:
        return new Response(JSON.stringify({ error: "Unknown provider" }), { status: 400 });
    }

    const result = await generateObject({
      model,
      schema: ShortcutSchema,
      system: systemPrompt,
      prompt,
    });

    return Response.json({ shortcut: result.object });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}

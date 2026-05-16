import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { ACTIONS } from "@/lib/actions-catalog";

const ActionSchema = z.object({
  WFWorkflowActionIdentifier: z.string().describe("The exact iOS Shortcut action identifier"),
  WFWorkflowActionParameters: z.record(z.unknown()).describe("Action parameters as key-value pairs"),
});

const ShortcutSchema = z.object({
  name: z.string().describe("Short, descriptive shortcut name (max 40 chars)"),
  description: z.string().describe("One sentence describing what this shortcut does"),
  iconColorHex: z.string().describe("Best hex color for the icon, e.g. #007AFF"),
  actions: z.array(ActionSchema).min(1).max(40).describe("Ordered list of iOS Shortcut actions"),
});

export async function POST(req: NextRequest) {
  try {
    const { prompt, model = "gpt-4o" } = await req.json();
    if (!prompt?.trim()) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const apiKey = req.headers.get("x-openai-key") || process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "OpenAI API key required" }, { status: 401 });
    }

    const actionList = ACTIONS.map(a =>
      `• ${a.id} — ${a.name} (${a.category}): ${a.description}`
    ).join("\n");

    const systemPrompt = `You are an expert iOS Shortcuts developer. Your job is to generate valid, working iOS Shortcut action sequences based on user descriptions.

Available actions (use ONLY these identifiers):
${actionList}

Rules:
1. Only use WFWorkflowActionIdentifier values from the list above
2. For control flow (if/repeat/menu), always include matching begin AND end actions with matching GroupingIdentifier UUID-like strings
3. If/else blocks: mode 0 = begin, 1 = else, 2 = end; use identifier "is.workflow.actions.conditional"
4. Repeat blocks: mode 0 = begin, 2 = end; repeat.count or repeat.each
5. Variable names should be descriptive strings
6. Parameters should match what Apple's Shortcuts app expects
7. Generate practical, actually useful shortcuts
8. Prefer built-in actions over third-party when possible`;

    const { object } = await generateObject({
      model: openai(model, { apiKey }),
      schema: ShortcutSchema,
      system: systemPrompt,
      prompt: `Create an iOS Shortcut for: ${prompt}`,
    });

    return NextResponse.json({ shortcut: object });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

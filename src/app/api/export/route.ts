import { buildXMLPlist } from "@/lib/shortcut-builder";
import type { ShortcutConfig } from "@/lib/shortcut-builder";

export async function POST(req: Request) {
  try {
    const config: ShortcutConfig = await req.json();
    if (!config.name || !config.actions?.length) {
      return new Response(JSON.stringify({ error: "name and actions required" }), { status: 400 });
    }
    const xml = buildXMLPlist(config);
    const filename = `${config.name.replace(/[^a-zA-Z0-9 _-]/g, "").trim() || "shortcut"}.shortcut`;
    return new Response(xml, {
      headers: {
        "Content-Type": "application/x-plist",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}

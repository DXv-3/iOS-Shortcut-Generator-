import { NextRequest, NextResponse } from "next/server";
import { buildXMLPlist } from "@/lib/shortcut-builder";
import type { ShortcutAction } from "@/lib/shortcut-builder";

export async function POST(req: NextRequest) {
  try {
    const { name, actions, iconColor, iconGlyph } = await req.json();
    if (!name || !actions?.length) {
      return NextResponse.json({ error: "name and actions are required" }, { status: 400 });
    }

    const plist = buildXMLPlist({ name, actions: actions as ShortcutAction[], iconColor, iconGlyph });

    return new NextResponse(plist, {
      status: 200,
      headers: {
        "Content-Type": "application/x-plist",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(name)}.shortcut"`,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Export failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

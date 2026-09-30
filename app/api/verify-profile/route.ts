import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const platform = searchParams.get("platform");
  const username = searchParams.get("username");

  if (!platform || !username) {
    return NextResponse.json({ valid: false, message: "Missing parameters" }, { status: 400 });
  }

  if (platform === "github") {
    try {
      const res = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
        headers: { "User-Agent": "NerdsRoom-Platform" },
      });
      if (res.ok) {
        return NextResponse.json({ valid: true, message: "GitHub profile found." });
      }
      return NextResponse.json({ valid: false, message: "GitHub profile not found." });
    } catch {
      return NextResponse.json({ valid: false, message: "Error checking GitHub profile." });
    }
  }

  if (platform === "linkedin") {
    try {
      const res = await fetch(`https://www.linkedin.com/in/${encodeURIComponent(username)}/`, {
        method: "HEAD",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
        redirect: "follow",
      });
      // LinkedIn returns 200 for valid profiles, 404 or 999 for invalid
      if (res.ok) {
        return NextResponse.json({ valid: true, message: "LinkedIn profile found." });
      }
      return NextResponse.json({ valid: false, message: "LinkedIn profile not found." });
    } catch {
      // LinkedIn may block server requests too; fall back to format validation
      if (/^[a-zA-Z0-9-]{3,100}$/.test(username)) {
        return NextResponse.json({ valid: true, message: "LinkedIn username format is valid." });
      }
      return NextResponse.json({ valid: false, message: "Invalid LinkedIn username format." });
    }
  }

  return NextResponse.json({ valid: false, message: "Unknown platform" }, { status: 400 });
}

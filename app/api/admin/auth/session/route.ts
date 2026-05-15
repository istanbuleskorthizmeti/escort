import { NextResponse } from "next/server";
import { clearAdminSessionCookie, requireAdminSession } from "@/lib/admin-auth";

export async function GET() {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;
  return NextResponse.json({ success: true });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  clearAdminSessionCookie(response);
  return response;
}

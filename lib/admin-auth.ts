import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const ADMIN_SESSION_COOKIE = "admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 8;

interface AdminSessionPayload {
  role: "admin";
  exp: number;
}

function getSigningSecret(): Uint8Array {
  const secret = process.env.CRM_ENCRYPTION_KEY || process.env.DRKCNAY_SYSTEM_KEY || process.env.ADMIN_HQ_KEY || "DRKCNAY-elite-secret-key-2026";
  return new TextEncoder().encode(secret);
}

export async function createAdminSessionToken(): Promise<string> {
  const secret = getSigningSecret();
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_MS / 1000}s`)
    .sign(secret);

  return token;
}

export async function isValidAdminSessionToken(token: string): Promise<boolean> {
  try {
    const secret = getSigningSecret();
    const { payload } = await jwtVerify(token, secret);
    return payload.role === "admin";
  } catch (error) {
    return false;
  }
}

export async function requireAdminSession(): Promise<NextResponse | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token || !(await isValidAdminSessionToken(token))) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function setAdminSessionCookie(response: NextResponse): Promise<void> {
  const token = await createAdminSessionToken();
  response.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  });
}

export function clearAdminSessionCookie(response: NextResponse): void {
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
}

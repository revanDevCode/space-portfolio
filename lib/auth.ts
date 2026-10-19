import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "sinetra-session";

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error(
      "AUTH_SECRET belum diatur atau minimal harus 32 karakter."
    );
  }

  return new TextEncoder().encode(secret);
}

/**
 * Membuat sesi setelah login atau registrasi berhasil.
 */
export async function createSession(userId: number): Promise<void> {
  const secret = getSecret();

  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);

  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

/**
 * Membaca dan memvalidasi sesi pengguna.
 * Mengembalikan null jika sesi tidak ada atau tidak valid.
 */
export async function getSession(): Promise<{
  userId: number;
} | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) {
      return null;
    }

    const { payload } = await jwtVerify(token, getSecret());

    if (
      typeof payload.userId !== "number" ||
      !Number.isInteger(payload.userId) ||
      payload.userId <= 0
    ) {
      return null;
    }

    return {
      userId: payload.userId,
    };
  } catch (error) {
    console.error("Gagal membaca sesi SINETRA:", error);
    return null;
  }
}

/**
 * Menghapus sesi saat pengguna logout.
 */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
}
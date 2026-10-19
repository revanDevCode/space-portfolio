import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const username =
      typeof body.username === "string"
        ? body.username.trim()
        : "";

    const password =
      typeof body.password === "string"
        ? body.password
        : "";

    // Validasi input
    if (!username || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "Username dan password wajib diisi.",
        },
        { status: 400 }
      );
    }

    // Cari akun di database
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Username atau password salah.",
        },
        { status: 401 }
      );
    }

    // Periksa password dengan hash yang tersimpan
    const passwordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordValid) {
      return NextResponse.json(
        {
          success: false,
          error: "Username atau password salah.",
        },
        { status: 401 }
      );
    }

    // Buat cookie sesi setelah login berhasil
    await createSession(user.id);

    return NextResponse.json({
      success: true,
      message: "Login berhasil.",
      user: {
        id: user.id,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Terjadi kesalahan pada server saat login.",
      },
      { status: 500 }
    );
  }
}
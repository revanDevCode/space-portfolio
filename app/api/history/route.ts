import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";

// Mengambil riwayat pengguna yang login
export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    const history = await prisma.chatHistory.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ history });
  } catch (error) {
    console.error("Gagal mengambil riwayat:", error);

    return NextResponse.json(
      { error: "Gagal mengambil riwayat obrolan." },
      { status: 500 }
    );
  }
}

// Menyimpan satu pasangan pertanyaan dan jawaban
export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const question =
      typeof body.question === "string"
        ? body.question.trim()
        : "";

    const answer =
      typeof body.answer === "string"
        ? body.answer
        : "";

    const image =
      typeof body.image === "string"
        ? body.image
        : null;

    if (!question || !answer) {
      return NextResponse.json(
        { error: "Pertanyaan dan jawaban wajib diisi." },
        { status: 400 }
      );
    }

    // Batasi ukuran gambar agar database tidak membengkak.
    if (image && image.length > 2_000_000) {
      return NextResponse.json(
        { error: "Gambar terlalu besar untuk disimpan." },
        { status: 413 }
      );
    }

    const saved = await prisma.chatHistory.create({
      data: {
        userId: session.userId,
        question,
        answer,
        image,
      },
    });

    return NextResponse.json(
      { success: true, history: saved },
      { status: 201 }
    );
  } catch (error) {
    console.error("Gagal menyimpan riwayat:", error);

    return NextResponse.json(
      { error: "Gagal menyimpan riwayat obrolan." },
      { status: 500 }
    );
  }
}

// Menghapus seluruh riwayat milik pengguna yang login
export async function DELETE() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    await prisma.chatHistory.deleteMany({
      where: { userId: session.userId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Gagal menghapus riwayat:", error);

    return NextResponse.json(
      { error: "Gagal menghapus riwayat obrolan." },
      { status: 500 }
    );
  }
}
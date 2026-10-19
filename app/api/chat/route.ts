import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message, image } = await req.json();

    if (!message && !image) {
      return NextResponse.json(
        { error: "Pesan atau foto tidak boleh kosong." },
        { status: 400 }
      );
    }

    const userContent = message || "Tolong jelaskan gambar ini.";

    const userMessage: {
      role: "user";
      content: string;
      images?: string[];
    } = {
      role: "user",
      content: userContent,
    };

    // Jika ada gambar, kirim gambar ke Gemma 3
    if (image) {
      // Hilangkan prefix data URL, contoh:
      // data:image/jpeg;base64,AAAA...
      const base64Image = image.split(",")[1] || image;

      userMessage.images = [base64Image];
    }

    const response = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gemma3",

        messages: [
          {
            role: "system",
            content: `
Kamu adalah SINETRA AI Assistant, yaitu asisten pembelajaran
untuk siswa SIJA (Sistem Informatika, Jaringan dan Aplikasi).

Tugas utama kamu adalah membantu siswa memahami materi SIJA
dengan bahasa Indonesia yang sederhana, jelas, dan mudah dipahami.

Fokus utama kamu meliputi:
- Jaringan komputer
- IP Address
- IPv4 dan IPv6
- Subnetting
- Routing
- VLAN
- Perangkat jaringan
- Server
- Keamanan jaringan
- Sistem Informatika
- Dasar-dasar teknologi jaringan

Jika pengguna mengirim gambar, analisis gambar tersebut
dan jelaskan hal yang terlihat di dalamnya jika berhubungan
dengan pembelajaran SIJA.

Contohnya:
- Topologi jaringan
- Diagram jaringan
- Konfigurasi perangkat jaringan
- Screenshot konfigurasi
- Soal atau materi SIJA
- Perangkat jaringan

Aturan dalam menjawab:
1. Gunakan bahasa Indonesia.
2. Jelaskan dengan bahasa yang mudah dipahami siswa.
3. Jika materi sulit, jelaskan secara bertahap.
4. Berikan contoh sederhana jika diperlukan.
5. Gunakan poin-poin jika membuat jawaban lebih mudah dipahami.
6. Jangan mengarang informasi.
7. Jika gambar kurang jelas, katakan bagian yang tidak dapat dilihat.
8. Jika tidak yakin dengan jawaban, katakan bahwa kamu tidak yakin.

Jika pengguna bertanya tentang sesuatu yang tidak berhubungan
dengan SIJA, arahkan kembali ke topik pembelajaran SIJA dengan sopan.

Tujuan kamu adalah membantu siswa belajar dan memahami materi,
bukan menggantikan guru di sekolah.
            `,
          },

          userMessage,
        ],

        stream: false,
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Gagal terhubung ke Ollama." },
        { status: 500 }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      answer:
        data.message?.content ||
        "Maaf, SINETRA belum mendapatkan jawaban.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}

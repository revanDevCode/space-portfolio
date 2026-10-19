import { redirect } from "next/navigation";

import { Hero } from "@/components/main/hero";
import { AIAssistant } from "@/components/main/ai-assistant";
import { getSession } from "@/lib/auth";

export default async function Home() {
  const session = await getSession();

  // Kalau belum login, arahkan ke halaman login
  if (!session) {
    redirect("/login");
  }

  return (
    <main className="relative min-h-screen w-full bg-[#030014]">
      <div className="stars" />

      <div className="relative z-10 flex flex-col">
        <Hero />

        <AIAssistant />

        <footer className="w-full border-t border-white/5 py-10 px-6 text-center">
          <h3 className="text-white font-semibold text-lg">
            SINETRA
          </h3>

          <p className="text-gray-500 text-sm mt-2">
            Media Pembelajaran Sistem Informatika,
            Jaringan dan Aplikasi
          </p>

          <p className="text-gray-600 text-xs mt-5">
            © 2026 SINETRA
          </p>
        </footer>
      </div>
    </main>
  );
}
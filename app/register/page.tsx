"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error || "Gagal membuat akun."
        );
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan koneksi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#030014] px-5">
      <div className="w-full max-w-md rounded-3xl border border-purple-500/20 bg-white/[0.03] p-8 backdrop-blur-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">
            Buat Akun
          </h1>

          <p className="mt-3 text-sm text-gray-400">
            Buat akun untuk menggunakan SINETRA
          </p>
        </div>

        <form
          onSubmit={handleRegister}
          className="space-y-5"
        >
          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Username
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              placeholder="Masukkan username"
              className="w-full rounded-xl border border-purple-500/20 bg-black/30 px-4 py-3 text-white outline-none focus:border-purple-500/60"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Minimal 6 karakter"
              className="w-full rounded-xl border border-purple-500/20 bg-black/30 px-4 py-3 text-white outline-none focus:border-purple-500/60"
              required
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="button-primary w-full rounded-xl px-5 py-3 text-white disabled:opacity-50"
          >
            {loading
              ? "Membuat akun..."
              : "Buat Akun"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Sudah memiliki akun?{" "}
          <a
            href="/login"
            className="text-purple-400 hover:text-purple-300"
          >
            Login
          </a>
        </p>
      </div>
    </main>
  );
}
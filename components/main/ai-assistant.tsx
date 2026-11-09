"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type ChatHistory = {
  id?: number;
  question: string;
  answer: string;
  image?: string | null;
  createdAt?: string;
};

const EXAMPLE_QUESTIONS = [
  "Apa itu IP Address?",
  "Jelaskan fungsi router",
  "Apa perbedaan IPv4 dan IPv6?",
  "Apa itu subnetting?",
];

export const AIAssistant = () => {
  const [message, setMessage] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const [history, setHistory] = useState<ChatHistory[]>([]);
  const [image, setImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  
  useEffect(() => {
    let cancelled = false;

    async function loadHistory() {
      try {
        const response = await fetch("/api/history", {
          cache: "no-store",
        });

        if (!response.ok) {
          if (response.status !== 401) {
            console.error("Gagal memuat riwayat obrolan.");
          }
          return;
        }

        const data = await response.json();

        if (!cancelled) {
          setHistory(Array.isArray(data.history) ? data.history : []);
        }
      } catch (error) {
        console.error("Gagal memuat riwayat:", error);
      }
    }

    loadHistory();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Silakan pilih file gambar.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  const handleAsk = async () => {
    if ((!message.trim() && !image) || loading) return;

    const currentQuestion =
      message.trim() || "Tolong jelaskan gambar ini.";

    setLoading(true);
    setAnswer("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentQuestion,
          image: image,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setAnswer(data.error || "Terjadi kesalahan.");
        return;
      }

      const newAnswer =
        data.answer ||
        "Maaf, SINETRA belum mendapatkan jawaban.";

      setAnswer(newAnswer);

      // Simpan pertanyaan dan jawaban ke database melalui API.
      const saveResponse = await fetch("/api/history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: currentQuestion,
          answer: newAnswer,
          image,
        }),
      });

      if (saveResponse.ok) {
        const savedData = await saveResponse.json();

        setHistory((previous) => [
          savedData.history,
          ...previous,
        ]);
      } else {
        const saveData = await saveResponse.json().catch(() => ({}));
        console.error(
          "Jawaban AI muncul, tetapi riwayat gagal disimpan:",
          saveData.error || saveResponse.statusText
        );
      }

      setMessage("");
      setImage(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error(error);

      setAnswer(
        "Gagal terhubung ke AI. Pastikan Ollama sedang berjalan."
      );
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    const confirmed = window.confirm(
      "Yakin ingin menghapus semua riwayat obrolan?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch("/api/history", {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Gagal menghapus riwayat.");
        return;
      }

      setHistory([]);
    } catch (error) {
      console.error("Gagal menghapus riwayat:", error);
      alert("Tidak dapat terhubung ke server.");
    }
  };

  const removeImage = () => {
    setImage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const useExampleQuestion = (question: string) => {
    setMessage(question);
  };

  return (
    <section
      id="ai"
      className="relative w-full px-4 sm:px-5 md:px-20 py-20 md:py-24 overflow-x-hidden"
    >
      <div className="max-w-4xl mx-auto w-full min-w-0">

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="w-full min-w-0 rounded-3xl border border-purple-500/20 bg-white/[0.03] backdrop-blur-sm p-4 sm:p-5 md:p-10"
        >

          {/* Header */}
          <div className="text-center">

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/20 bg-purple-500/5 mb-5">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />

              <span className="text-xs tracking-[0.2em] text-purple-400">
                SIJA ASSISTANT
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight">
              Punya pertanyaan tentang jaringan?
            </h2>

            <p className="text-gray-400 mt-4 max-w-2xl mx-auto leading-7">
              Tanyakan materi SIJA dan dapatkan penjelasan
              yang mudah dipahami.
            </p>

          </div>

          {/* Example Questions */}
          <div className="mt-8">

            <p className="text-xs text-gray-500 mb-3">
              Coba tanyakan:
            </p>

            <div className="flex flex-wrap gap-2">

              {EXAMPLE_QUESTIONS.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => useExampleQuestion(question)}
                  disabled={loading}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-gray-400 hover:text-white hover:border-purple-500/40 hover:bg-purple-500/5 transition-all disabled:opacity-50"
                >
                  {question}
                </button>
              ))}

            </div>

          </div>

          {/* Input Area */}
          <div className="mt-6">

            <div className="flex flex-col md:flex-row gap-3 w-full min-w-0">

              <div className="flex-1 relative min-w-0">

                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAsk();
                    }
                  }}
                  placeholder="Tulis pertanyaan kamu di sini..."
                  disabled={loading}
                  className="w-full min-w-0 rounded-xl border border-purple-500/20 bg-black/30 px-4 sm:px-5 py-4 text-white outline-none placeholder:text-gray-500 focus:border-purple-500/60 focus:bg-black/40 transition-all disabled:opacity-60"
                />

              </div>

              <div className="flex w-full md:w-auto gap-2 sm:gap-3">

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
                  className="flex-1 md:flex-none min-w-0 rounded-xl px-3 sm:px-5 py-4 border border-purple-500/20 bg-black/30 text-gray-300 hover:text-white hover:border-purple-500/50 hover:bg-purple-500/5 transition-all disabled:opacity-50"
                >
                  📷 <span className="hidden sm:inline">Foto</span>
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={handleAsk}
                  disabled={
                    loading ||
                    (!message.trim() && !image)
                  }
                  className="flex-1 md:flex-none min-w-0 rounded-xl px-4 sm:px-7 py-4 bg-purple-600 text-white hover:bg-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-900/20"
                >
                  {loading ? "Berpikir..." : "Tanya →"}
                </button>

              </div>

            </div>

          </div>

          {/* Preview Foto */}
          {image && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 rounded-2xl border border-purple-500/20 bg-black/20 p-3 sm:p-4"
            >

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">

                <div className="flex flex-wrap items-center gap-2">

                  <span className="text-sm text-gray-300">
                    📷 Foto terpilih
                  </span>

                  <span className="text-xs text-purple-400">
                    Siap dianalisis
                  </span>

                </div>

                <button
                  type="button"
                  onClick={removeImage}
                  disabled={loading}
                  className="self-start sm:self-auto text-sm text-gray-500 hover:text-red-400 transition-colors"
                >
                  Hapus
                </button>

              </div>

              <div className="w-full rounded-xl overflow-hidden border border-white/5 bg-black/20">

                <img
                  src={image}
                  alt="Preview gambar"
                  className="block max-h-64 max-w-full w-auto h-auto mx-auto rounded-xl object-contain"
                />

              </div>

            </motion.div>
          )}

          {/* AI Answer */}
          <motion.div
            layout
            className="mt-6 rounded-2xl border border-purple-500/10 bg-black/20 overflow-hidden"
          >

            {/* AI Header */}
            <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-4 border-b border-white/5">

              <div className="flex items-center gap-3 min-w-0">

                <div className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-xl bg-purple-600/15 border border-purple-500/10 text-purple-400 text-xs font-semibold">
                  AI
                </div>

                <div className="min-w-0">

                  <p className="text-sm font-medium text-white">
                    SINETRA AI
                  </p>

                  <p className="text-xs text-gray-500 mt-0.5">
                    Asisten pembelajaran SIJA
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">

                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />

                <span className="text-xs text-gray-600">
                  Online
                </span>

              </div>

            </div>

            {/* Answer Content */}
            <div className="min-h-[120px] p-4 sm:p-5 md:p-7 min-w-0">

              {loading ? (

                <div className="flex items-center gap-3 py-5">

                  <div className="flex gap-1.5">

                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.3s]" />

                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]" />

                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />

                  </div>

                  <span className="text-gray-400 text-sm">
                    SINETRA sedang berpikir...
                  </span>

                </div>

              ) : answer ? (

                <div className="max-w-3xl min-w-0">

                  <div className="flex items-center gap-2 mb-5">

                    <div className="w-1 h-5 rounded-full bg-purple-500" />

                    <span className="text-xs uppercase tracking-[0.18em] text-purple-400">
                      Jawaban
                    </span>

                  </div>

                  <div className="text-gray-300 text-sm sm:text-[15px] md:text-base leading-7 md:leading-8 whitespace-pre-wrap break-words overflow-wrap-anywhere">
                    {answer}
                  </div>

                </div>

              ) : (

                <div className="flex flex-col items-center justify-center min-h-[80px] text-center">

                  <div className="text-2xl mb-3 opacity-60">
                    ✦
                  </div>

                  <p className="text-gray-500 text-sm">
                    Jawaban AI akan muncul di sini.
                  </p>

                  <p className="text-gray-600 text-xs mt-1">
                    Mulai dengan pertanyaan tentang materi SIJA.
                  </p>

                </div>

              )}

            </div>

          </motion.div>

          {/* History */}
          {history.length > 0 && (
            <div className="mt-10">

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">

                <div>

                  <p className="text-sm tracking-[0.2em] text-purple-400">
                    RIWAYAT PERCAKAPAN
                  </p>

                  <p className="text-xs text-gray-600 mt-1">
                    {history.length} percakapan tersimpan
                  </p>

                </div>

                <button
                  type="button"
                  onClick={clearHistory}
                  className="self-start sm:self-auto text-sm text-gray-500 hover:text-red-400 transition-colors"
                >
                  Hapus Riwayat
                </button>

              </div>

              <div className="space-y-5">

                {history.map((chat, index) => (

                  <motion.div
                    key={chat.id ?? `${chat.question}-${index}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-2xl border border-white/5 bg-black/20 overflow-hidden"
                  >

                    {/* User Question */}
                    <div className="p-4 sm:p-5 min-w-0">

                      <div className="flex items-center gap-2 mb-3">

                        <div className="flex items-center justify-center w-8 h-8 flex-shrink-0 rounded-full bg-white/5 text-xs text-gray-400">
                          Kamu
                        </div>

                        <span className="text-sm font-medium text-gray-300">
                          Pertanyaan
                        </span>

                      </div>

                      {chat.image && (
                        <div className="mb-4 w-full rounded-xl overflow-hidden border border-white/5 bg-black/20">

                          <img
                            src={chat.image}
                            alt="Gambar yang dikirim"
                            className="block max-h-48 max-w-full w-auto h-auto rounded-xl object-contain mx-auto"
                          />

                        </div>
                      )}

                      <p className="text-gray-300 leading-7 whitespace-pre-wrap break-words overflow-wrap-anywhere text-sm md:text-[15px]">
                        {chat.question}
                      </p>

                    </div>

                    {/* AI Answer */}
                    <div className="border-t border-white/5 bg-purple-500/[0.015] p-4 sm:p-5 min-w-0">

                      <div className="flex items-center gap-2 mb-4">

                        <div className="flex items-center justify-center w-8 h-8 flex-shrink-0 rounded-xl bg-purple-600/15 text-xs text-purple-400">
                          AI
                        </div>

                        <span className="text-sm font-medium text-purple-400">
                          SINETRA AI
                        </span>

                      </div>

                      <div className="text-gray-400 leading-7 whitespace-pre-wrap break-words overflow-wrap-anywhere text-sm md:text-[15px]">
                        {chat.answer}
                      </div>

                    </div>

                  </motion.div>

                ))}

              </div>

            </div>
          )}

        </motion.div>

      </div>
    </section>
  );
};
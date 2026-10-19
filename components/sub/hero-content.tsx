"use client";

import { SparklesIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";

import {
  slideInFromLeft,
  slideInFromTop,
} from "@/lib/motion";

export const HeroContent = () => {
  return (
    <div className="relative z-[20] flex w-full flex-col items-center justify-center px-5 pt-32 sm:px-8 md:flex-row md:px-20 md:pt-40">

      {/* =========================
          KONTEN UTAMA
      ========================= */}

      <div className="m-auto flex w-full max-w-4xl flex-col justify-center gap-5 text-center md:max-w-none md:text-start">

        {/* LABEL */}

        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="Welcome-box mx-auto flex w-fit items-center border border-[#7042f88b] py-[8px] px-[12px] opacity-90 md:mx-0"
        >
          <SparklesIcon className="mr-[10px] h-5 w-5 text-[#b49bff]" />

          <h1 className="Welcome-text text-[12px] sm:text-[13px]">
            MEDIA PEMBELAJARAN SIJA
          </h1>
        </motion.div>

        {/* JUDUL */}

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4 flex max-w-[650px] flex-col gap-2 text-4xl font-bold leading-tight text-white sm:text-5xl md:mt-6 md:text-6xl"
        >
          <span>
            Belajar{" "}
            <span className="bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent">
              Jaringan
            </span>
          </span>

          <span>
            dengan cara yang{" "}
            <span className="bg-gradient-to-r from-purple-500 to-purple-300 bg-clip-text text-transparent">
              lebih mudah.
            </span>
          </span>
        </motion.div>

        {/* DESKRIPSI */}

        <motion.p
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="my-3 max-w-[560px] text-base leading-7 text-gray-400 sm:text-lg md:my-5"
        >
          Pelajari dasar jaringan komputer melalui materi
          IP Address, Subnetting, Routing, dan VLAN
          dengan penjelasan yang sederhana dan mudah dipahami.
        </motion.p>

        {/* TOMBOL */}

        <motion.a
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          href="#ai"
          className="button-primary mx-auto max-w-[200px] rounded-lg px-6 py-3 text-center text-white transition-all md:mx-0"
        >
          Mulai Belajar →
        </motion.a>

      </div>

    </div>
  );
};
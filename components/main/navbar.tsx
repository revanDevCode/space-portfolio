"use client";

import { useState } from "react";
import Image from "next/image";

import { NAV_LINKS } from "@/constants";

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (link: string) => {
    setIsMobileMenuOpen(false);

    // Beranda → kembali ke paling atas
    if (link === "#home") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return;
    }

    // Menu lainnya → scroll ke section
    const target = document.querySelector(link);

    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="w-full h-[65px] fixed top-0 left-0 shadow-lg shadow-[#2A0E61]/50 bg-[#03001427] backdrop-blur-md z-50">

      {/* Navbar Container */}
      <div className="relative w-full h-full flex items-center">

        {/* Logo + Nama SINETRA */}
        <button
          onClick={() => handleNavClick("#home")}
          className="absolute left-10 flex items-center"
        >
          <Image
            src="/logo.png"
            alt="SINETRA Logo"
            width={55}
            height={55}
            draggable={false}
            className="cursor-pointer"
          />

          <div className="hidden md:flex font-bold ml-[10px] text-gray-300 text-lg">
            SINETRA
          </div>
        </button>

        {/* Navbar Desktop */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2">

          <div className="flex items-center justify-center gap-10 px-8 py-3 rounded-full bg-[rgba(3,0,20,0.45)] border border-[rgba(112,66,248,0.25)] text-gray-200">

            {NAV_LINKS.map((link) => (
              <button
                key={link.title}
                onClick={() => handleNavClick(link.link)}
                className="cursor-pointer hover:text-[rgb(112,66,248)] transition duration-300 whitespace-nowrap"
              >
                {link.title}
              </button>
            ))}

          </div>

        </div>

        {/* Tombol Menu Mobile */}
        <button
          className="md:hidden absolute right-6 text-white focus:outline-none text-3xl"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          ☰
        </button>

      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-[65px] left-0 w-full bg-[#030014] p-6 flex flex-col items-center text-gray-300 md:hidden border-t border-purple-500/20">

          <div className="flex flex-col items-center gap-5">

            {NAV_LINKS.map((link) => (
              <button
                key={link.title}
                onClick={() => handleNavClick(link.link)}
                className="cursor-pointer hover:text-[rgb(112,66,248)] transition duration-300"
              >
                {link.title}
              </button>
            ))}

          </div>

        </div>
      )}

    </div>
  );
};

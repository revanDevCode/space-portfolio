"use client";

import { motion } from "framer-motion";

const materials = [
  {
    icon: "📍",
    title: "IP Address",
    description:
      "Pelajari pengertian IP Address dan bagaimana alamat digunakan untuk mengidentifikasi perangkat dalam jaringan.",
  },
  {
    icon: "🧮",
    title: "Subnetting",
    description:
      "Pelajari cara membagi sebuah jaringan menjadi beberapa jaringan yang lebih kecil dan teratur.",
  },
  {
    icon: "🔀",
    title: "Routing",
    description:
      "Pelajari bagaimana data menentukan jalur untuk mencapai perangkat atau jaringan tujuan.",
  },
  {
    icon: "🏢",
    title: "VLAN",
    description:
      "Pelajari bagaimana jaringan dapat dibagi secara logis untuk meningkatkan pengelolaan jaringan.",
  },
];

export const Materi = () => {
  return (
    <section
      id="materi"
      className="relative w-full px-6 md:px-20 py-24"
    >
      <div className="max-w-6xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-sm tracking-[0.3em] text-purple-400 mb-3">
            PEMBELAJARAN SIJA
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Materi Jaringan
          </h2>

          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Pelajari konsep dasar jaringan komputer melalui materi
            yang disusun secara sederhana dan mudah dipahami.
          </p>
        </motion.div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {materials.map((material, index) => (
            <motion.div
              key={material.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              viewport={{ once: true }}
              className="group rounded-2xl border border-purple-500/20 bg-white/[0.03] backdrop-blur-sm p-7 hover:border-purple-500/50 transition-all duration-300"
            >

              <div className="text-3xl mb-5">
                {material.icon}
              </div>

              <h3 className="text-xl font-semibold text-white mb-3">
                {material.title}
              </h3>

              <p className="text-gray-400 leading-7">
                {material.description}
              </p>

              <button
                className="mt-6 text-sm text-purple-300 hover:text-white transition-colors"
              >
                Pelajari →
              </button>

            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
};

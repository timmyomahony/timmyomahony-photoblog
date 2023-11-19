"use client";

import { Album } from "@/types/album";
import { motion } from "framer-motion";

const AlbumHeader = ({ album }: { album: Album }) => {
  const padding = album.description ? "pt-6 pb-12 lg:pt-32 lg:pb-48" : "py-24";
  return (
    <header
      className={`${padding} text-slate-900 flex flex-col lg:flex-row gap-6 lg:gap-4`}
    >
      <motion.h2
        className="w-full lg:w-1/2 text-2xl lg:text-3xl underline"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.75 }}
        variants={{
          visible: { opacity: 1, y: 0 },
          hidden: { opacity: 0, y: 20 },
        }}
      >
        {album.name}
      </motion.h2>
      {album.description && (
        <motion.p
          className="w-full lg:w-1/2 text-xl lg:text-3xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.75, delay: 0.5 }}
          variants={{
            visible: { opacity: 1, y: 0 },
            hidden: { opacity: 0, y: 20 },
          }}
        >
          {album.description}
        </motion.p>
      )}
    </header>
  );
};

export default AlbumHeader;

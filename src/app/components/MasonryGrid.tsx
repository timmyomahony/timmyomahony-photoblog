"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { motion, Variants } from "framer-motion";

import useBreakpoints from "@/app/hooks/breakpoints";
import type { Photo } from "@/types/album";

const photoVariants: Variants = {
  offscreen: {
    opacity: 0,
    y: 100,
  },
  onscreen: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.75,
      duration: 0.35,
    },
  },
};

const Photo = ({ photo }: { photo: Photo }) => {
  return (
    <figure className="cursor-pointer">
      <Image
        src={photo.url}
        width={0}
        height={0}
        sizes="100vw"
        placeholder="blur"
        blurDataURL={photo.placeholder}
        className="max-w-full w-full"
        alt=""
        quality={100}
      />
    </figure>
  );
};

const MasonryGrid = ({ photos, onClick }: { photos: Photo[] }) => {
  const breakpoint = useBreakpoints();

  const containerRef = useRef(null);
  const [numColumns, setNumColumns] = useState<number | undefined>();
  const [columns, setColumns] = useState([]);

  useEffect(() => {}, []);

  useEffect(() => {
    console.log(`Breakpoint changed to ${breakpoint}`);
    if (breakpoint) {
      setNumColumns(
        {
          sm: 1,
          md: 2,
          lg: 3,
          xl: 3,
          "2xl": 3,
        }[breakpoint]
      );
    }
  }, [breakpoint]);

  useEffect(() => {
    if (numColumns) {
      console.log(`Columns changed to ${numColumns}`);

      const columns: any = Array.from({ length: numColumns }, () => ({
        height: 0,
        photos: [],
      }));

      photos.forEach((photo, i) => {
        let shortestColumnIndex = 0;
        for (let i = 0; i < numColumns; i++) {
          if (columns[i]?.height < columns[shortestColumnIndex]?.height) {
            shortestColumnIndex = i;
          }
        }

        columns[shortestColumnIndex].photos.push({
          i,
          ...photo,
        });

        const columnWidth = containerRef?.current?.clientWidth / numColumns;
        const tileHeight = (photo.height / photo.width) * columnWidth;

        columns[shortestColumnIndex].height += tileHeight;
      });

      setColumns(columns);

      console.log(columns);
    }
  }, [numColumns]);

  return (
    <section ref={containerRef} className="w-full flex gap-8">
      {columns.map((column, i) => (
        <ul className="flex flex-col gap-8 flex-1" key={i}>
          {column.photos.map((photo, i) => (
            <motion.li
              className="w-full"
              key={i}
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true }}
            >
              <motion.div variants={photoVariants}>
                <Photo photo={photo} />
              </motion.div>
            </motion.li>
          ))}
        </ul>
      ))}
    </section>
  );
};

export default MasonryGrid;

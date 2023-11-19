"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { motion, Variants } from "framer-motion";

import useBreakpoints from "@/hooks/breakpoints";
import type { Photo } from "@/types/photo";

const Photo = ({ photo }: { photo: Photo }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <figure
      className={`relative group bg-gray-200 ${
        !loaded ? "cursor-wait animate-pulse" : "cursor-zoom-in"
      }`}
    >
      <Image
        src={photo.url}
        width={photo.width}
        height={photo.height}
        className={`max-w-full w-full transition-all duration-500 ease-in-out ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        title={photo?.exif?.title || ""}
        alt={photo?.exif?.description || ""}
        quality={95}
        onLoad={() => {
          setLoaded(true);
        }}
      />
    </figure>
  );
};

type Columns = Array<{
  height: number;
  photos: Array<Photo>;
}>;

const MasonryGrid = ({
  photos,
  onClick,
}: {
  photos: Photo[];
  onClick: (photo: Photo) => void;
}) => {
  const breakpoint = useBreakpoints();
  const containerRef = useRef<any>(null);
  const [numColumns, setNumColumns] = useState<number | undefined>(undefined);
  const [columns, setColumns] = useState<Columns>([]);

  useEffect(() => {
    if (breakpoint !== undefined) {
      console.log(`Breakpoint changed to ${breakpoint}`);
      setNumColumns(
        {
          null: 1,
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
    if (numColumns !== undefined) {
      console.log(`Columns changed to ${numColumns}`);
      const columns: Columns = Array.from({ length: numColumns }, () => ({
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
          ordering: i,
          ...photo,
        });

        if (photo.height && photo.width && containerRef.current) {
          const columnWidth = containerRef?.current?.clientWidth / numColumns;
          const tileHeight = (photo.height / photo.width) * columnWidth;
          columns[shortestColumnIndex].height += tileHeight;
        }
      });

      setColumns(columns);
    }
  }, [numColumns]);

  return (
    <div ref={containerRef} className="w-full flex gap-8">
      {columns.map((column, i) => (
        <ul className="flex flex-col gap-4 lg:gap-8 flex-1" key={i}>
          {column.photos.map((photo) => (
            <li
              className="w-full"
              key={photo.ordering}
              onClick={() => onClick(photo)}
            >
              <Photo photo={photo} />
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
};

export default MasonryGrid;

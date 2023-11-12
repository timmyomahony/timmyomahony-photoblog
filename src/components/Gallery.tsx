"use client";

import { useState } from "react";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import MasonryGrid from "@/components/MasonryGrid";
import type { Photo } from "@/types/album";

const Gallery = ({ photos }: { photos: Photo[] }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(0);

  return (
    <section>
      <MasonryGrid
        photos={photos}
        onClick={(photo: Photo) => {
            console.log("Click");
          if (typeof photo.ordering !== "undefined") {
            setIndex(photo.ordering);
            setOpen(true);
          }
        }}
      />
      <Lightbox
        index={index}
        open={open}
        close={() => setOpen(false)}
        slides={photos.map((photo) => {
          return {
            src: photo.url,
            height: photo.height,
            width: photo.width,
          };
        })}
      />
    </section>
  );
};

export default Gallery;

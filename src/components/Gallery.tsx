"use client";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import MasonryGrid from "@/components/MasonryGrid";
import CustomSliderImage from "@/components/CustomSliderImage";
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
        plugins={[Captions]}
        toolbar={{
          buttons: [
            <button key="my-button" type="button" className="yarl__button">
              Button
            </button>,
            "close",
          ],
        }}
        close={() => setOpen(false)}
        slides={photos.map((photo) => {
          return {
            src: photo.url,
            height: photo.height,
            width: photo.width,
            title: photo.exif.title,
            description: photo.exif.description,
          };
        })}
        render={{ slide: CustomSliderImage }}
      />
    </section>
  );
};

export default Gallery;

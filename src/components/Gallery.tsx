"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Lightbox,
  IconButton,
  useLightboxState,
} from "yet-another-react-lightbox";
import { useRouter } from "next/navigation";
import Captions from "yet-another-react-lightbox/plugins/captions";
import MasonryGrid from "@/components/MasonryGrid";
import CustomSliderImage from "@/components/CustomSliderImage";
import type { Photo } from "@/types/photos";
import LeftArrowIcon from "@/icons/LeftArrow.svg";
import CloseIcon from "@/icons/Close.svg";
import ExternalLinkIcon from "@/icons/ExternalLink.svg";

const ExternalLinkButton = () => {
  const router = useRouter();
  const { currentSlide } = useLightboxState();
  return (
    <IconButton
      onClick={() => {
        if (currentSlide) {
          router.push(`/photo/${currentSlide.uuid}/`);
        }
      }}
      label="View photo"
      icon={ExternalLinkIcon}
      disabled={!currentSlide}
    />
  );
};

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
          buttons: [<ExternalLinkButton key="external-link-button" />, "close"],
        }}
        close={() => setOpen(false)}
        slides={photos.map((photo) => {
          return {
            src: photo.url,
            uuid: photo.uuid,
            height: photo.height,
            width: photo.width,
            title: photo.exif.title,
            blurDataURL: photo.placeholder,
            description: photo.exif.description,
          };
        })}
        render={{
          slide: CustomSliderImage,
          iconPrev: () => (
            <LeftArrowIcon className="yarl__icon transition-all duration-200 ease-linear hover:-translate-y-1" />
          ),
          iconNext: () => (
            <LeftArrowIcon className="yarl__icon rotate-180 transition-all duration-200 ease-linear hover:-translate-y-1" />
          ),
          iconClose: () => (
            <CloseIcon className="yarl__icon w-5 transition-all duration-200 ease-linear hover:-translate-y-1" />
          ),
        }}
      />
    </section>
  );
};

export default Gallery;

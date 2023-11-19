"use client";
import { Album } from "@/types/album";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const AlbumPhoto = ({ album }: { album: Album }) => {
  const photo = album.photos[0];
  const [loaded, setLoaded] = useState(false);

  return (
    <figure
      className={`relative overflow-hidden group bg-gray-200 ${
        !loaded && "cursor-wait animate-pulse"
      }`}
    >
      <Link
        href={`/${album.slug}`}
        className={loaded ? "cursor-pointer" : "cursor-wait"}
      >
        <Image
          src={photo.url}
          width={photo.width}
          height={photo.height}
          className={`aspect-square object-cover w-full h-full transition-opacity duration-500 ease-in ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          alt={photo?.exif?.title || ""}
          quality={95}
          onLoad={() => {
            console.log(`Loaded ${photo.url}`)
            setLoaded(true)
          }}
        />
        {loaded && (
          <div className="absolute p-8 left-0 top-0 w-full h-full bg-white bg-opacity-80 flex justify-center items-center transition-opacity duration-300 ease-in-out opacity-0 group-hover:opacity-100">
            <div className="text-slate-900 text-center">
              <figcaption className="text-4xl xl:text-3xl underline">
                {album.name}
              </figcaption>
            </div>
          </div>
        )}
      </Link>
    </figure>
  );
};

export default AlbumPhoto;

import Image from "next/image";

import type { Album } from "@/types/photos";

import { getAlbums } from "@/utils/photos";
import Link from "next/link";

const Photo = ({ album }: { album: Album }) => {
  const photo = album.photos[0];
  return (
    <figure className="relative overflow-hidden group">
      <Link href={`/${album.slug}`} className="block">
        <Image
          src={photo.url}
          width={0}
          height={0}
          sizes="100vw"
          placeholder="blur"
          blurDataURL={photo.placeholder}
          className="aspect-square object-cover w-full h-full"
          alt="Picture of the author"
          quality={100}
        />
        <div className="absolute p-8 left-0 top-0 w-full h-full bg-white bg-opacity-80 flex justify-center items-center transition-opacity duration-50 ease-in-out opacity-0 group-hover:opacity-100">
          <div className="text-slate-900 text-center">
            <figcaption className="text-4xl underline">{album.name}</figcaption>
          </div>
        </div>
      </Link>
    </figure>
  );
};

const Home = async () => {
  const albums = await getAlbums();
  return (
    <div className="w-full grid grid-cols-2 gap-8">
      {albums.map((album, i) => {
        return (
          <div key={i}>
            <Photo album={album} />
          </div>
        );
      })}
    </div>
  );
};

export default Home;

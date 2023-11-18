import { fetchAlbums } from "@/data/albums";
import type { Album } from "@/types/album";
import Image from "next/image";
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
          alt=""
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
  const albums = await fetchAlbums();
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

const generateMetadata = () => {
  return {
    title: "Photography",
    description: "Photos by Timmy O'Mahony",
  };
};

export { generateMetadata };

export default Home;

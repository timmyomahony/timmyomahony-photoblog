import Image from "next/image";

import type { Album } from "@/types/album";

import { getAlbums } from "@/utils/do";
import Link from "next/link";

const Photo = ({ album }: { album: Album }) => {
  const photo = album.photos[0];
  return (
    <div className="h-screen w-full flex justify-center items-center">
      <figure className="flex flex-col justify-center gap-2 max-h-full max-w-full overflow-hidden">
        <Link href={`/${album.slug}`}>
          <Image
            src={photo.url}
            width={0}
            height={0}
            sizes="100vw"
            placeholder="blur"
            blurDataURL={photo.placeholder}
            className="max-h-[90vh] max-w-full object-contain w-auto h-auto"
            alt="Picture of the author"
            quality={100}
          />
        </Link>
      </figure>
    </div>
  );
};

const Home = async () => {
  const albums = await getAlbums();
  return (
    <ul>
      {albums.map((album, i) => {
        return (
          <li key={i}>
            <Photo album={album} />
          </li>
        );
      })}
    </ul>
  );
};

export default Home;

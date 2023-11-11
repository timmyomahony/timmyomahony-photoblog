import Image from "next/image";
import { getAlbums } from "@/utils/do";

import type { Photo } from "@/types/album";

const Photo = ({ photo }: { photo: Photo }) => {
  return (
    <figure className="flex flex-col justify-center gap-2 max-h-full max-w-full overflow-hidden">
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
    </figure>
  );
};

const AlbumPage = async ({ params }: { params: { slug: string } }) => {
  const album = (await getAlbums()).find((album) => album.slug === params.slug);

  if (!album) {
    return <></>;
  }

  return (
    <main className="container mx-auto">
      <h1 className="text-3xl font-bold">{album.name}</h1>
      <ul>
        {album.photos.map((photo, i) => {
          return (
            <li key={i}>
              <Photo photo={photo} />
            </li>
          );
        })}
      </ul>
    </main>
  );
};

const generateStaticParams = async () => {
  const albums = await getAlbums();
  return albums.map((album) => ({ slug: albums.slug }));
};

const generateMetadata = async ({ params }) => {
  return {};
};

export { generateMetadata, generateStaticParams };

export default AlbumPage;

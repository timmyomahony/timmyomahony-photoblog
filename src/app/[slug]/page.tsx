import Image from "next/image";
import { getAlbums } from "@/utils/do";
import MasonryGrid from "@/app/components/MasonryGrid";
import type { Photo } from "@/types/album";

// const Photo = ({ photo }: { photo: Photo }) => {
//   return (
//     <figure className="bg-slate-900 max-w-full max-h-[400px] overflow-hidden flex justify-center items-center">
//       <Image
//         src={photo.url}
//         width={0}
//         height={0}
//         sizes="100vw"
//         placeholder="blur"
//         blurDataURL={photo.placeholder}
//         className="h-full w-full max-h-full max-w-full"
//         alt="Picture of the author"
//         quality={100}
//       />
//     </figure>
//   );
// };

const AlbumPage = async ({ params }: { params: { slug: string } }) => {
  const album = (await getAlbums()).find((album) => album.slug === params.slug);

  if (!album) {
    return <></>;
  }

  return (
    <main className="container mx-auto">
      <MasonryGrid photos={album.photos} />
    </main>
  );
};

const generateStaticParams = async () => {
  const albums = await getAlbums();
  return albums.map((album) => ({ slug: album.slug }));
};

const generateMetadata = async ({ params }) => {
  return {};
};

export { generateMetadata, generateStaticParams };

export default AlbumPage;

import { getAlbums } from "@/utils/do";
import MasonryGrid from "@/components/MasonryGrid";

const AlbumPage = async ({ params }: { params: { slug: string } }) => {
  const album = (await getAlbums()).find((album) => album.slug === params.slug);

  if (!album) {
    return <></>;
  }

  return <MasonryGrid photos={album.photos} />;
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

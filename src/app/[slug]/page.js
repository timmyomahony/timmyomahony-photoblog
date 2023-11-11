import { getAlbums } from "@/utils/do";

const AlbumPage = ({ params }) => {
  return <main>{ params.slug }</main>;
};

const generateStaticParams = async () => {
    const albums = await getAlbums();
    return albums.map(album => ({ slug: albums.slug }))
};

const generateMetadata = async ({ params }) => {
  return {};
};

export { generateMetadata, generateStaticParams };

export default AlbumPage;

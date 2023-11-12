import { getAlbums } from "@/utils/photos";
import Gallery from "@/components/Gallery";

const AlbumPage = async ({ params }: { params: { slug: string } }) => {
  const album = (await getAlbums()).find((album) => album.slug === params.slug);

  if (!album) {
    return <></>;
  }

  return (
    <section>
      <header className="py-24  text-slate-900 flex">
        <h2 className="w-1/2 text-3xl underline">{album.name}</h2>
        <p className="w-1/2 text-3xl">
          Contrary to popular belief, Lorem Ipsum is not simply random text. It
          has roots in a piece of classical Latin literature from 45 BC
        </p>
      </header>
      <Gallery photos={album.photos} />
    </section>
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

import { fetchAlbums } from "@/data/albums";
import Gallery from "@/components/Gallery";
import { Album } from "@/types/album";

const AlbumPage = async ({ params }: { params: { slug: string } }) => {
  const albums = await fetchAlbums();
  const album = albums.find((album: Album) => album.slug === params.slug);

  if (!album) {
    return <></>;
  }

  return (
    <section>
      <header className="py-24  text-slate-900 flex">
        <h2 className="w-1/2 text-3xl underline">{album.name}</h2>
        {album.description && (
          <p className="w-1/2 text-3xl">{album.description}</p>
        )}
      </header>
      <Gallery photos={album.photos} />
    </section>
  );
};

const generateStaticParams = async () => {
  const albums = await fetchAlbums();
  return albums.map((album: Album) => ({ slug: album.slug }));
};

const generateMetadata = async ({ params }: { params: { slug: string } }) => {
  const albums = await fetchAlbums();
  const album = albums.find((album: Album) => album.slug === params.slug);
  return {
    title: album?.name || "Photo album",
    description: album?.description || "A photo album by Timmy O'Mahony",
    openGraph: {
      images: [
        {
          url: album?.photos[0]?.thumbnail,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
};

export { generateMetadata, generateStaticParams };

export default AlbumPage;

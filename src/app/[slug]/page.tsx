import AlbumHeader from "@/components/AlbumHeader";
import Gallery from "@/components/Gallery";
import { fetchAlbums } from "@/data/albums";
import { Album } from "@/types/album";

const AlbumPage = async ({ params }: { params: { slug: string } }) => {
  const albums = await fetchAlbums();
  const album = albums.find((album: Album) => album.slug === params.slug);

  if (!album) {
    return <></>;
  }

  return (
    <section className="min-h-screen">
      <AlbumHeader album={album} />
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

import { fetchAlbums } from "@/data/albums";
import AlbumPhoto from "@/components/AlbumPhoto";

const Home = async () => {
  const albums = await fetchAlbums();
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8">
      {albums.map((album, i) => {
        return (
          <AlbumPhoto key={i} album={album} />
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

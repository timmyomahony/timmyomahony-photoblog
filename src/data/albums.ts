import slugify from "slugify";
import type { Album, Albums } from "@/types/album";
import { getPhotos } from "@/data/photos";
import { readFromCache, writeToCache } from "@/data/cache";

const fetchAlbums = async (): Promise<Album[] | []> => {
  try {
    let cachedAlbums = await readFromCache("albums");
    if (cachedAlbums && cachedAlbums.length > 0) {
      return cachedAlbums;
    }
  } catch (err) {
    console.error(err);
  }

  const photos = await getPhotos();
  let albums: Album[] = [];
  const albumsMap: Albums = {};

  // Sort photos into albums
  for (let i = 0; i < photos.length; i++) {
    const photo = photos[i];
    const albumMatch = photo.path.match(
      /^(\d{4}-\d{2}-\d{2}) ([^\/]+)\/([^\/]+)$/
    );
    if (albumMatch) {
      const date = albumMatch[1];
      const name = albumMatch[2];
      const slug = slugify(name, { lower: true });
      const key = `${date}-${slug}`;
      if (typeof albumsMap[key] === "undefined") {
        let data = {
          id: i,
          date,
          name,
          slug,
          photos: [],
        };
        // Check if any additional data is saved in album folder
        const url = encodeURI(
          `${process.env.AWS_PUBLIC_URL}${date}/${name}/data.json`
        );
        try {
          const res = await fetch(url, { cache: "no-cache"});
          if (res.status === 200) {
            data = { ...data, ...(await res.json()) };
          }
        } catch (error) {}
        albumsMap[key] = data;
      }
      albumsMap[key]["photos"].push(photo);
    }
  }

  albums = Object.values(albumsMap).sort((a, b) =>
    new Date(a.date) < new Date(b.date) ? 1 : -1
  );

  await writeToCache(albums, "albums");

  return albums;
};

export { fetchAlbums };

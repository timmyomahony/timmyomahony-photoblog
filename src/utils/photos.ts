import slugify from "slugify";
import { basename } from "path";
import ExifReader from "exifreader";
import { getPlaiceholder } from "plaiceholder";
import sizeOf from "image-size";
import getUuid from "uuid-by-string";
import type { Photo, Album, Albums } from "@/types/photos";
import { getS3Keys } from "@/utils/aws";
import NodeCache from "node-cache";

const cache = new NodeCache();

const getSimplifiedExif = (exif: any) => {
  return {
    date: (exif["Digital Creation Date"] || {})["description"],
    time: (exif["Digital Creation Time"] || {})["description"],
    title: (exif["title"] || {})["description"],
    description: (exif["description"] || {})["description"],
    fileName: (exif["RawFileName"] || {})["description"],
    cameraMake: (exif["Make"] || {})["description"],
    cameraModel: (exif["Model"] || {})["description"],
    lens: (exif["LensModel"] || {})["value"],
    iso: (exif["ISOSpeedRatings"] || {})["description"],
    aperture: (exif["FNumber"] || {})["description"],
    focalLength: (exif["FocalLength"] || {})["description"],
    shutterSpeed: (exif["ShutterSpeedValue"] || {})["description"],
  };
};

const getPhotos = async (): Promise<Photo[] | []> => {

  let photos: Photo[] | undefined = cache.get("photos");
  if ( photos !== undefined ){
    return photos;
  } else {
    photos = []
  }

  const s3Keys = await getS3Keys();

  for (let i = 0; i < s3Keys.length; i++) {
    const path = s3Keys[i];
    if (
      (!path.endsWith("jpg") && !path.endsWith("jpeg")) ||
      path.includes("Thumbnails")
    ) {
      continue;
    }
    const uuid = getUuid(path);
    const url = encodeURI(`${process.env.AWS_PUBLIC_URL}${path}`);
    const photoFile = await fetch(url);
    const buffer = Buffer.from(await photoFile.arrayBuffer());
    const { base64: placeholder } = await getPlaiceholder(buffer);
    const { height = 1, width = 1, type } = await sizeOf(buffer);
    const ratio = width / height;
    const isPortrait = ratio < 1;
    const exif = ExifReader.load(buffer);
    const simplifiedExif = getSimplifiedExif(exif);
    const thumbnail = encodeURI(
      `${process.env.AWS_PUBLIC_URL}${path.replace(
        basename(path),
        `Thumbnails/${basename(path)}`
      )}`
    );

    photos.push({
      id: i,
      uuid,
      path,
      height,
      width,
      type,
      url,
      ratio,
      isPortrait,
      placeholder,
      thumbnail,
      exif: simplifiedExif,
    });
  }

  // console.log(JSON.stringify(photos));
  cache.set("photos", photos);

  return photos;
};

const getAlbums = async (): Promise<Album[] | []> => {

  let albums: Album[] | undefined = cache.get( "albums" );
  if ( albums !== undefined ){
    return albums;
  } else {
    albums = []
  }

  const photos = await getPhotos();
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
          const res = await fetch(url);
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

  console.log("Setting cache")
  cache.set("albums", albums);

  return albums;
};

export { getPhotos, getAlbums };

import slugify from "slugify";
import ExifReader from "exifreader";
import { getPlaiceholder } from "plaiceholder";
import sizeOf from "image-size";
import getUuid from "uuid-by-string";
import type { Photo, Album, Albums } from "@/types/photos";
import { getS3Keys } from "@/utils/aws";


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
  const s3Keys = await getS3Keys();
  const photos: Photo[] = [];

  for (let i = 0; i < s3Keys.length; i++) {
    const path = s3Keys[i];
    const uuid = getUuid(path);
    const url = encodeURI(`${process.env.AWS_PUBLIC_URL}${path}`);
    let photoFile = await fetch(url);
    let buffer = Buffer.from(await photoFile.arrayBuffer());
    let { base64: placeholder } = await getPlaiceholder(buffer);
    let { height, width, type } = await sizeOf(buffer);
    let ratio = width / height;
    let isPortrait = ratio < 1;
    let exif = ExifReader.load(buffer);
    let simplifiedExif = getSimplifiedExif(exif);

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
      exif: simplifiedExif,
    });
  }

  return photos;
};

const getAlbums = async (): Promise<Album[] | []> => {
  const photos = await getPhotos();
  const albums: Albums = {};

  for (let i = 0; i < photos.length; i++) {
    const photo = photos[i];
    const albumMatch = photo.path.match(
      /^(\d{4}-\d{2}-\d{2})\/([^\/]+)\/([^\/]+)$/
    );
    if (albumMatch) {
      const date = albumMatch[1];
      const name = albumMatch[2];
      const slug = slugify(name, { lower: true });
      const key = `${date}-${slug}`;
      if (typeof albums[key] === "undefined") {
        albums[key] = {
          id: i,
          date,
          name,
          slug,
          photos: [],
        };
      }
      albums[key]["photos"].push(photo);
    }
  }

  return Object.values(albums).sort((a, b) =>
    new Date(a.date) < new Date(b.date) ? -1 : 1
  );
};

export { getPhotos, getAlbums };
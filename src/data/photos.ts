import { basename } from "path";
import ExifReader from "exifreader";
import { getPlaiceholder } from "plaiceholder";
import sizeOf from "image-size";
import getUuid from "uuid-by-string";
import type { Photo } from "@/types/photo";
import { getS3Keys } from "@/data/aws";
import { readFromCache, writeToCache } from "@/data/cache";

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
  try {
    let cachedPhotos = await readFromCache("photos");
    if (cachedPhotos && cachedPhotos.length > 0) {
      return cachedPhotos;
    }
  } catch (err) {
    console.error(err);
  }

  let photos: Photo[] = [];
  const s3Keys = await getS3Keys();

  for (let i = 0; i < s3Keys.length; i++) {
    const path = s3Keys[i];
    if (
      (path && !path.endsWith("jpg") && !path.endsWith("jpeg")) ||
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
      placeholder,
      thumbnail,
      exif: simplifiedExif,
    });
  }

  await writeToCache(photos, "photos");

  return photos;
};

export { getPhotos };
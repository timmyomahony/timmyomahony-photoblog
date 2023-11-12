import { S3 } from "@aws-sdk/client-s3";
import { ListObjectsCommand } from "@aws-sdk/client-s3";
import slugify from "slugify";
import ExifReader from "exifreader";
import { getPlaiceholder } from "plaiceholder";
import sizeOf from "image-size";

import type { Photo, Album, Albums } from "@/types/album";

const s3Client = new S3({
  forcePathStyle: false, // Configures to use subdomain/virtual calling format.
  endpoint: process.env.DO_SPACES_ENDPOINT,
  region: process.env.DO_SPACES_REGION,
  credentials: {
    accessKeyId: process.env.DO_SPACES_ACCESS,
    secretAccessKey: process.env.DO_SPACES_SECRET,
  },
});

const getSimplifiedExif = (exif: any) => {
  return {
    cameraMake: exif["Make"]["description"],
    cameraModel: exif["Model"]["description"],
    lens: exif["Lens"]["value"],
    aperture: exif["FNumber"]["description"],
    focalLength: exif["FocalLength"]["description"],
    shutterSpeed: exif["ShutterSpeedValue"]["description"],
  };
};

const getAlbums = async (): Promise<Album[] | []> => {
  try {
    // A regex for separating the date from the album name and file name in a
    // key that looks like:
    //
    // "2023-11-11/Testing Album Ferrys/Image-9.jpg"
    const pathRegex = /^(\d{4}-\d{2}-\d{2})\/([^\/]+)\/([^\/]+)$/;
    const params = {
      Bucket: process.env.DO_SPACES_BUCKET,
    };
    const s3Data = await s3Client.send(new ListObjectsCommand(params));

    const data: Albums = {};

    if (s3Data.Contents) {
      for (const obj of s3Data.Contents) {
        if (obj.Key) {
          // We ignore the thumbnails as we're going to grab them manually
          if (obj.Key.includes("/Thumbnails")) {
            // console.info(`Skipping key ${obj.Key}`);
            continue;
          }

          // console.log(`Processing key ${obj.Key}`);

          const albumMatch = obj.Key.match(pathRegex);
          if (albumMatch) {
            const dateStr = albumMatch[1];
            const albumName = albumMatch[2];
            const photoName = albumMatch[3];
            const albumSlug = slugify(albumName, { lower: true });
            const albumKey = `${dateStr}-${albumSlug}`;

            const photoMatch = photoName.match(/(\d+)/);
            let photoOrdering;
            if (photoMatch) {
              photoOrdering = parseInt(photoMatch[1], 10);
            } else {
              throw new Error("Error parsing photo name from S3 key via regex");
            }

            if (typeof data[albumKey] === "undefined") {
              data[albumKey] = {
                date: dateStr,
                name: albumName,
                slug: albumSlug,
                photos: [],
              };
            }

            const photoUrl = encodeURI(
              `${process.env.DO_SPACES_PUBLIC_URL}${obj.Key}`
            );
            let photoFile = await fetch(photoUrl);
            let photoFileBuffer = Buffer.from(await photoFile.arrayBuffer());
            let { base64: photoPlaceholder } = await getPlaiceholder(
              photoFileBuffer
            );
            let dimensions = await sizeOf(photoFileBuffer);
            console.log(dimensions);
            let photoExif = ExifReader.load(photoFileBuffer);
            let simplifiedImageExif = getSimplifiedExif(photoExif);

            data[albumKey]["photos"].push({
              name: photoName,
              height: dimensions.height,
              width: dimensions.width,
              type: dimensions.type,
              ordering: photoOrdering,
              url: photoUrl,
              placeholder: photoPlaceholder,
              exif: simplifiedImageExif,
            });
          } else {
            throw new Error(
              "Error parsing date/album name/path from S3 key via regex"
            );
          }
        } else {
          throw new Error("Error parsing key from S3 data");
        }
      }
    } else {
      throw new Error("Error getting contents from S3 ListObjectsCommand");
    }
    return Object.values(data);
  } catch (err) {
    console.log("Error", err);
  }
  return [];
};

export { getAlbums };

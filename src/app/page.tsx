import Image from "next/image";
import { ListObjectsCommand } from "@aws-sdk/client-s3";
import slugify from "slugify";
import ExifReader from "exifreader";

import { s3Client } from "@/utils/do";

type Image = {
  name: string;
  ordering: number;
  url: string;
  thumbnailUrl: string;
  exif: any;
};

type Album = {
  name: string;
  slug: string;
  date: string;
  images: Image[];
};

type Albums = { [key: string]: Album };

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
            console.info(`Skipping key ${obj.Key}`);
            continue;
          }

          console.log(`Processing key ${obj.Key}`);

          const albumMatch = obj.Key.match(pathRegex);
          if (albumMatch) {
            const dateStr = albumMatch[1];
            const albumName = albumMatch[2];
            const imageName = albumMatch[3];
            const albumSlug = slugify(albumName, { lower: true });
            const albumKey = `${dateStr}-${albumSlug}`;

            const imageMatch = imageName.match(/(\d+)/);
            let imageOrdering;
            if (imageMatch) {
              imageOrdering = parseInt(imageMatch[1], 10);
            } else {
              throw new Error("Error parsing image name from S3 key via regex");
            }

            if (typeof data[albumKey] === "undefined") {
              data[albumKey] = {
                date: dateStr,
                name: albumName,
                slug: albumSlug,
                images: [],
              };
            }

            const thumbnailUrl = encodeURI(
              `${process.env.DO_SPACES_PUBLIC_URL}${dateStr}/${albumName}/Thumbnails/${imageName}`
            );
            const imageUrl = encodeURI(
              `${process.env.DO_SPACES_PUBLIC_URL}${obj.Key}`
            );
            let thumbnailFile = await fetch(thumbnailUrl);
            let thumbnailFileBuffer = Buffer.from(
              await thumbnailFile.arrayBuffer()
            );
            let thumbnailExif = ExifReader.load(thumbnailFileBuffer, {
              expanded: true,
            });

            data[albumKey]["images"].push({
              name: imageName,
              ordering: imageOrdering,
              url: imageUrl,
              thumbnailUrl: thumbnailUrl,
              exif: thumbnailExif,
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

const Home = async () => {
  const albums = await getAlbums();
  console.log(albums);
  return (
    <main className="">
      <ul>
        {albums.map((album) => {
          return <li>{album.name}</li>;
        })}
      </ul>
    </main>
  );
};

export default Home;

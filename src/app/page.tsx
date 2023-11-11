import Image from "next/image";
import { ListObjectsCommand } from "@aws-sdk/client-s3";
import slugify from "slugify";

import { s3Client } from "@/utils/do";

type Image = {
  name: string;
  ordering: number;
  url: string;
}

type Album = {
  name: string;
  slug: string;
  date: string;
  images: Image[];
};

type Albums = { [key: string]: Album; }

const getData = async () => {
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
      s3Data.Contents.forEach((obj) => {
        if (obj.Key) {
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

            const imageUrl = `${process.env.DO_SPACES_PUBLIC_URL}${albumKey}`;

            if (typeof data[albumKey] === "undefined") {
              data[albumKey] = {
                date: dateStr,
                name: albumName,
                slug: albumSlug,
                images: [],
              };
            }

            data[albumKey]['images'].push({
              name: imageName,
              ordering: imageOrdering,
              url: imageUrl,
            });
          } else {
            throw new Error(
              "Error parsing date/album name/path from S3 key via regex"
            );
          }
        } else {
          throw new Error("Error parsing key from S3 data");
        }
      });
    } else {
      throw new Error("Error getting contents from S3 ListObjectsCommand");
    }

    return Object.values(data);
  } catch (err) {
    console.log("Error", err);
  }
};

const Home = async () => {
  const data = await getData();
  console.log(data);
  return <main className=""></main>;
};

export default Home;

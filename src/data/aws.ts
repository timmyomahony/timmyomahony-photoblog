import { cache } from "react";
import { S3 } from "@aws-sdk/client-s3";
import { ListObjectsCommand } from "@aws-sdk/client-s3";

// https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#fetching-data-on-the-server-with-third-party-libraries

export const revalidate = 3600;

// Get list of all keys
const getS3Keys = cache(async (): Promise<string[]> => {
  console.log("Fetching S3 keys ...");
  const s3Client = new S3({
    forcePathStyle: false,
    endpoint: process.env.AWS_ENDPOINT || "",
    region: process.env.AWS_REGION || "",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
  });

  const s3Data = await s3Client.send(
    new ListObjectsCommand({
      Bucket: process.env.AWS_BUCKET,
    })
  );
  if (s3Data.Contents) {
    return Object.values(s3Data.Contents)
      .filter((obj) => typeof obj.Key !== "undefined")
      .map((obj) => <string>obj.Key);
  }
  return [];
});

export { getS3Keys };

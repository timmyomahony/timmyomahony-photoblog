import { S3 } from "@aws-sdk/client-s3";
import { ListObjectsCommand } from "@aws-sdk/client-s3";

const s3Client = new S3({
  forcePathStyle: false,
  endpoint: process.env.AWS_ENDPOINT || "",
  region: process.env.AWS_REGION || "",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

// Get list of all keys
const getS3Keys = async (): Promise<string[] | []> => {
  const s3Data = await s3Client.send(
    new ListObjectsCommand({
      Bucket: process.env.AWS_BUCKET,
    })
  );
  if (s3Data.Contents) {
    return Object.values(s3Data.Contents).map((obj) => obj.Key);
  }
  return [];
};

export { getS3Keys };

import Image from "next/image";
import { ListObjectsCommand } from "@aws-sdk/client-s3";

import { s3Client } from "@/utils/do";

const getAlbums = async () => {
  try {
    const data = await s3Client.send(new ListObjectsCommand({
      Bucket: process.env.DO_SPACES_BUCKET
    }));
    console.log("Success", data);
    return data;
  } catch (err) {
    console.log("Error", err);
  }
};

const Home = async () => {
  const albums = await getAlbums();
  return <main className=""></main>;
};

export default Home;

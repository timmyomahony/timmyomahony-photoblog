import Image from "next/image";
import { getPhotos } from "@/utils/do";
import MasonryGrid from "@/app/components/MasonryGrid";
import type { Photo } from "@/types/album";

const PhotoPage = async ({ params }: { params: { slug: string } }) => {
  const photo = (await getPhotos()).find((photo) => photo.uuid === params.slug);

  if (!photo) {
    return <></>;
  }

  return <main className="container mx-auto">{photo.uuid}</main>;
};

const generateStaticParams = async () => {
  return (await getPhotos()).map((photo) => ({ slug: photo.uuid }));
};

const generateMetadata = async ({ params }) => {
  return {};
};

export { generateMetadata, generateStaticParams };

export default PhotoPage;

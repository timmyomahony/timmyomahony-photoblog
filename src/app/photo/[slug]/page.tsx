import Image from "next/image";
import { getPhotos } from "@/utils/photos";

const PhotoPage = async ({ params }: { params: { slug: string } }) => {
  const photo = (await getPhotos()).find((photo) => photo.uuid === params.slug);

  if (!photo) {
    return <></>;
  }

  return (
    <section>
      <div className="bg-gray-100 w-full h-[80vh] flex justify-center">
        <Image
          src={photo.url}
          width={0}
          height={0}
          sizes="100vw"
          placeholder="blur"
          blurDataURL={photo.placeholder}
          className="w-auto h-auto max-w-full max-h-full"
          alt=""
          quality={100}
        />
      </div>
      <div className="w-full flex gap-8 mt-12">
        <div className="w-1/2">
          <h1 className="text-xl font-medium mb-2">{photo.exif.title}</h1>
          <p className="text-md">{photo.exif.description}</p>
        </div>
        <div className="w-1/2">
          <div>
            <dl>
              <div className="px-4 py-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Date
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {photo.exif.date}
                </dd>
              </div>
              <div className="px-4 py-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Time
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {photo.exif.time}
                </dd>
              </div>
              <div className="px-4 py-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Camera
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {photo.exif.cameraMake} {photo.exif.cameraModel}
                </dd>
              </div>
              <div className="px-4 py-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Lens
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {photo.exif.lens}
                </dd>
              </div>
              <div className="px-4 py-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Aperture
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {photo.exif.aperture}
                </dd>
              </div>
              <div className="px-4 py-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Focal Length
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {photo.exif.focalLength}
                </dd>
              </div>
              <div className="px-4 py-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Shutter Speed
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {photo.exif.shutterSpeed}
                </dd>
              </div>
              <div className="px-4 py-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  ISO
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {photo.exif.iso}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
};

const generateStaticParams = async () => {
  return (await getPhotos()).map((photo) => ({ slug: photo.uuid }));
};

const generateMetadata = async ({ params }: { params: { slug: string } }) => {
  const photo = (await getPhotos()).find((photo) => photo.uuid === params.slug);
  return {
    title:
      photo?.exif?.title ||
      photo?.exif?.description ||
      photo?.exif?.fileName ||
      "Photo",
    description: photo?.exif?.description || "A photo by Timmy O'Mahony",
    openGraph: {
      images: [
        {
          url: photo?.thumbnail,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
};

export { generateMetadata, generateStaticParams };

export default PhotoPage;

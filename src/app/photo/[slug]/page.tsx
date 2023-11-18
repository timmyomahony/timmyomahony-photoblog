import Image from "next/image";
import { getPhotos } from "@/data/photos";
import { Exif, ExifKeys } from "@/types/photo";

const Attrs = ({ exif }: { exif: Exif }) => {
  let attrs: [string, ExifKeys][] = [
    ["Date", "date"],
    ["Time", "time"],
    ["Camera Make", "cameraMake"],
    ["Camera Model", "cameraModel"],
    ["Lens", "lens"],
    ["Aperture", "aperture"],
    ["Focal Length", "focalLength"],
    ["Shutter Speed", "shutterSpeed"],
    ["ISO", "iso"],
  ];

  return (
    <div>
      <dl>
        {attrs.map(([label, attr], i) => {
          if (!(attr in exif)) {
            return <></>;
          }
          return (
            <div
              key={i}
              id={`#{attr}`}
              className="px-4 py-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
            >
              <dt className="text-sm font-medium leading-6 text-gray-900">
                {label}
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {exif[attr]}
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
};

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
          <h1 className="text-xl font-medium mb-2">{photo?.exif?.title}</h1>
          <p className="text-md">{photo?.exif?.description}</p>
        </div>
        <div className="w-1/2">{photo.exif && <Attrs exif={photo.exif} />}</div>
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

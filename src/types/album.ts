type Photo = {
  id: number;
  uuid: string;
  path: string;
  height?: number;
  width?: number;
  type?: string;
  url: string;
  exif: {
    cameraMake: string,
    cameraModel: string,
    lens: string,
    aperture: string,
    focalLength: string,
    shutterSpeed: string,
  };
  placeholder: string;
};

type Album = {
  id: number;
  name: string;
  slug: string;
  date: string;
  photos: Photo[];
};

type Albums = { [key: string]: Album };

export type { Photo, Album, Albums };

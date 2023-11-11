type Photo = {
  name: string;
  ordering: number;
  url: string;
  exif: any;
  placeholder: string;
};

type Album = {
  name: string;
  slug: string;
  date: string;
  photos: Photo[];
};

type Albums = { [key: string]: Album };

export type { Photo, Album, Albums };

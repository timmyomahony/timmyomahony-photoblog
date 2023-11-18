import type { Photo } from "@/types/photo";

type Album = {
  id: number;
  name: string;
  description?: string;
  slug: string;
  date: string;
  photos: Photo[];
};

type Albums = { [key: string]: Album };

export type { Album, Albums };

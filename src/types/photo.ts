type Photo = {
  id: number;
  uuid: string;
  path: string;
  height?: number;
  width?: number;
  type?: string;
  url: string;
  ordering?: number;
  exif?: {
    title?: string;
    description?: string;
    date?: string;
    time?: string;
    fileName?: string;
    cameraMake?: string;
    cameraModel?: string;
    lens?: string;
    iso?: number;
    aperture?: string;
    focalLength?: string;
    shutterSpeed?: string;
  };
  placeholder: string;
  thumbnail: string;
};

export type { Photo };

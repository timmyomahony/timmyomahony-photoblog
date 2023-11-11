import withPlaiceholder from "@plaiceholder/next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.timmyomahony.com",
      },
      {
        protocol: "https",
        hostname: "timmyomahony-photos.ams3.digitaloceanspaces.com",
      },
    ],
  },
};

export default withPlaiceholder(nextConfig);

import withPlaiceholder from "@plaiceholder/next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  staticPageGenerationTimeout: 60 * 5,
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
  webpack(config) {
    // Taken from:
    // https://github.com/vercel/next.js/issues/48177#issuecomment-1557354538
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.(".svg")
    );
    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: ["@svgr/webpack"],
      }
    );
    fileLoaderRule.exclude = /\.svg$/i;
    return config;
  },
};

export default withPlaiceholder(nextConfig);

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  productionBrowserSourceMaps: process.env.LINKSTASH_SOURCE_MAPS === "true",
  async rewrites() {
    return [
        {
          source: "/",
          destination: "/bookmarks",
        },
      ];
  },
};
module.exports = nextConfig;

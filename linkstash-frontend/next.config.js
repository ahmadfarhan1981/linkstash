/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
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

/** @type {import('next').NextConfig} */
const path = require('path');
const nextConfig = {
  experimental: {
    // this includes files from the monorepo base two directories up
    outputFileTracingRoot: path.join(__dirname, '../../'),
  },
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

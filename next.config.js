/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/",
        headers: [
          {
            key: "x-use-cache",
            value: "false",
          },
        ],
      },
      {
        source: "/*",
        headers: [
          {
            key: "x-use-cache",
            value: "false",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig

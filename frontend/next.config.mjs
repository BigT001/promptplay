/** @type {import('next').NextConfig} */
const config = {
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"],
      bodySizeLimit: "2mb"
    }
  },
  images: {
    domains: ['localhost'],
  },
}

export default config

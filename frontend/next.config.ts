import { NextConfig } from 'next'

const config: NextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ['localhost'],
  },
}

export default config

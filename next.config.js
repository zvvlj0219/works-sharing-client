/** @type {import('next').NextConfig} */

const nextConfig_dev = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains:['localhost','lh3.googleusercontent.com']
  }
}

const nextConfig_prod = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains:['works-sharing-server.herokuapp.com','lh3.googleusercontent.com']
  }
}

const nextConfig = process.env.NODE_ENV === 'production'
  ? nextConfig_prod
  : nextConfig_dev

module.exports = nextConfig

/** @type {import('next').NextConfig} */
const path = require('path')

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
  },
  webpack(config){
    config.resolve.alias['@components'] = path.join(__dirname, 'components')
    config.resolve.alias['@models'] = path.join(__dirname, 'models')
    config.resolve.alias['@config'] = path.join(__dirname, 'config')
    config.resolve.alias['@styles'] = path.join(__dirname, 'styles')
    return config
  }
}

const nextConfig = process.env.NODE_ENV === 'production'
  ? nextConfig_prod
  : nextConfig_dev

module.exports = nextConfig

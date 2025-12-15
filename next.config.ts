/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    allowedDevOrigins: [
      'https://hugozera.space',
      'https://www.hugozera.space',
      'https://api.hugozera.space',
      'http://localhost:3001'
    ]
  }
}

module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {

    allowedDevOrigins: [
      'https://hugozera.space',
      'https://www.hugozera.space',
      'https://api.hugozera.space',
      'https://resiarteakin.com.br',
      'https://www.resiarteakin.com.br',
      'https://api.resiarteakin.com.br',
      'http://localhost:3001'
    ]
  }
}

module.exports = nextConfig

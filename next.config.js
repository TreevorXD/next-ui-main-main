

/** @type {import('next').NextConfig} */
const nextConfig = {
    crossOrigin: 'anonymous',
    async rewrites() {
        return [
          {
            source: '/api/:path*',
            destination: 'https://antip2w.com/:path*',
          },
        ]
      },
}

module.exports = nextConfig

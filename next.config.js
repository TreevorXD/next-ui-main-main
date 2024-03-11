const isProd = process.env.NODE_ENV === 'production'

/** @type {import('next').NextConfig} */
const nextConfig = {
    crossOrigin: 'anonymous',
    assetPrefix: isProd ? 'https://cdn.antip2w.com' : undefined,
}

module.exports = nextConfig

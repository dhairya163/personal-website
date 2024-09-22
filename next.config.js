const withMDX = require('@next/mdx')()

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include MDX files
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  // todo This configuration option will be removed in a future major version.
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  // Optionally, add any other Next.js config below
  
  // Serve the sitemap.xml file
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
    ]
  },
}

module.exports = withMDX(nextConfig)
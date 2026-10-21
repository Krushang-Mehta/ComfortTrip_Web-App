/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow LAN development origins for Hot Module Replacement (HMR) & Dev WebSocket
  allowedDevOrigins: [
    '192.168.31.235',
    '192.168.31.235:3000',
    'localhost',
    'localhost:3000',
  ],

  // Allow external LAN origins for mobile testing & server actions
  experimental: {
    serverActions: {
      allowedOrigins: [
        '192.168.31.235:3000',
        'localhost:3000',
        '127.0.0.1:3000',
      ],
    },
  },

  // Allow image loading and optimization from Cloudinary, Unsplash & local LAN origin
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'http',
        hostname: '192.168.31.235',
        port: '3000',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
      },
    ],
  },

  // Cross-Origin headers for LAN mobile testing
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT,OPTIONS' },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

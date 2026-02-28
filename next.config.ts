import type { NextConfig } from "next";

const securityHeaders = [
  // Prevent browsers from guessing (sniffing) the MIME type
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Prevent clickjacking via iframes
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Control referrer information sent with requests
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Restrict browser features / APIs
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self), interest-cohort=()",
  },
  // Force HTTPS for 1 year (enable once you have a real domain + TLS)
  // { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  //
  // Content Security Policy — restricts which resources the browser can load.
  // Keeps this permissive for dev while blocking the most dangerous vectors.
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Next.js requires 'unsafe-inline' for its inline scripts in dev;
      // nonces are needed to lock this down further in production.
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      // Leaflet tiles + user avatars from Google
      "img-src 'self' data: blob: https://*.googleusercontent.com https://*.cartocdn.com https://*.openstreetmap.org https://tile.openstreetmap.org",
      // Map tile requests and auth callbacks
      "connect-src 'self' https://*.cartocdn.com https://*.openstreetmap.org https://accounts.google.com",
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  async headers() {
    return [
      {
        // Apply security headers to every route
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;

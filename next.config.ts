import type { NextConfig } from "next";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const withPWA = require("next-pwa")({
  dest: "public",
  register: false,       // tự đăng ký thủ công để tương thích Next.js 16
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  fallbacks: {
    document: "/offline",
  },
  runtimeCaching: [
    // Cache page navigations
    {
      urlPattern: /^https?.*/,
      handler: "NetworkFirst",
      options: {
        cacheName: "offlineCache",
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 ngày
        },
      },
    },
    // Cache static assets (fonts, images)
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|ico|webp|woff|woff2|ttf|otf)$/i,
      handler: "CacheFirst",
      options: {
        cacheName: "static-assets",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 ngày
        },
      },
    },
    // Cache Google Fonts
    {
      urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com/,
      handler: "CacheFirst",
      options: {
        cacheName: "google-fonts",
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 năm
        },
      },
    },
  ],
});

const nextConfig: NextConfig = {
  /* config options here */
};

export default withPWA(nextConfig);

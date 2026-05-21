import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Spicy Street',
        short_name: 'Spicy Street',
        description: 'Order food at your table',
        theme_color: '#e85d04',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        runtimeCaching: [
          {
            // Cache API menu for offline browsing
            urlPattern: /\/api\/menu/,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'api-menu', expiration: { maxAgeSeconds: 60 * 60 } },
          },
        ],
      },
    }),
  ],
});

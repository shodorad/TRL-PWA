import { fileURLToPath } from 'url'
import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const SRC_PATH = new URL('./src', import.meta.url).pathname

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      includeAssets: ['car-3d.png', 'icons/*.png'],
      manifest: false,
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
        runtimeCaching: [
          {
            urlPattern: /\/api\//,
            handler: 'NetworkFirst',
            options: { cacheName: 'api-cache' },
          },
          {
            urlPattern: /maps\.googleapis\.com/,
            handler: 'CacheFirst',
            options: { cacheName: 'maps-cache' },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: [
      { find: '@mui/styled-engine', replacement: '@mui/styled-engine-sc' },
      {
        find: '@',
        replacement: SRC_PATH,
      },
    ],
  },
  server: {
    open: true,
    port: 3000
  },
  preview: {
    open: true,
    port: 3000
  },
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: '/DM-Tool/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'DM Util - Dice Roller & Combat Tracker',
        short_name: 'DM Util',
        description: 'Dice roller and combat tracker for tabletop RPGs',
        start_url: '/DM-Tool/',
        scope: '/DM-Tool/',
        display: 'standalone',
        display_override: ['standalone', 'fullscreen'],
        background_color: '#0a0a0a',
        theme_color: '#cd7f32',
        icons: [
          {
            src: '/DM-Tool/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/DM-Tool/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        categories: ['utilities', 'games'],
        lang: 'en-US'
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,jpg,jpeg,gif,woff,woff2,ttf,eot}'],
        globIgnores: ['**/*.map'],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024
      },
      devOptions: {
        enabled: false,
        type: 'module'
      }
    })
  ],
})

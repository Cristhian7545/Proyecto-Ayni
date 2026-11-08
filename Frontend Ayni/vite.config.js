import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ''),
    target = env.VITE_BACKEND_TARGET || 'http://127.0.0.1:3001',
    proxy = {
      '/api': { target, changeOrigin: true },
      '/uploads': { target, changeOrigin: true },
    };
  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'prompt',
        injectRegister: 'auto',
        includeAssets: ['assets/avatar-default.svg', 'assets/logo-ayni.png'],
        manifest: {
          name: 'Ayni · Tu barrio conectado',
          short_name: 'Ayni',
          description:
            'Trueques, apoyo y servicios de tu distrito, también sin conexión.',
          theme_color: '#4d6149',
          background_color: '#faf3ea',
          display: 'standalone',
          start_url: '/inicio',
          scope: '/',
          lang: 'es-PE',
          icons: [
            {
              src: '/assets/pwa-ayni.svg',
              sizes: 'any',
              type: 'image/svg+xml',
              purpose: 'any',
            },
            {
              src: '/assets/pwa-maskable.svg',
              sizes: 'any',
              type: 'image/svg+xml',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,svg,png,jpg,webp,woff2}'],
          globIgnores: ['**/assets/referencias/**'],
          navigateFallback: 'index.html',
          navigateFallbackDenylist: [/^\/api(?:\/|$)/, /^\/uploads(?:\/|$)/],
          cleanupOutdatedCaches: true,
          clientsClaim: true,
          skipWaiting: false,
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\//,
              handler: 'CacheFirst',
              options: {
                cacheName: 'ayni-public-fonts',
                expiration: { maxEntries: 20, maxAgeSeconds: 31536000 },
              },
            },
          ],
        },
        devOptions: { enabled: false },
      }),
    ],
    server: { port: 5173, strictPort: true, proxy },
    preview: { port: 4173, strictPort: true, proxy },
  };
});

import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import ViteVue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        VitePWA({
            registerType: 'injectManifest',
            // devOptions: {
            //     enabled: true
            // },
            manifest: {
                id: "/",
                start_url: "/",
                name: "Pokedex",
                short_name: "Pokedex",
                description: "A portable encyclopedic reference tool, able to give information about a certain species of Pokémon even if a Trainer has not seen or caught it.",
                display: "standalone",
                display_override: ["window-controls-overlay"],
                background_color: "#AAAAAA",
                theme_color: "#AAAAAA",
                icons: [
                    {
                        "src": "pwa-64x64.png",
                        "sizes": "64x64",
                        "type": "image/png"
                    },
                    {
                        "src": "pwa-192x192.png",
                        "sizes": "192x192",
                        "type": "image/png"
                    },
                    {
                        "src": "pwa-512x512.png",
                        "sizes": "512x512",
                        "type": "image/png"
                    },
                    {
                        "src": "maskable-icon-512x512.png",
                        "sizes": "512x512",
                        "type": "image/png",
                        "purpose": "maskable"
                    }
                ],
                screenshots: [
                    {
                        "src": "screenshots/screenshot-desktop-1.png",
                        "sizes": "2878x1418",
                        "type": "image/png",
                        "form_factor": "wide",
                        "label": "screenshot desktop 1"
                    },
                    {
                        "src": "screenshots/screenshot-mobile-1.png",
                        "sizes": "572x1232",
                        "type": "image/png",
                        "form_factor": "narrow",
                        "label": "screenshot mobile 1"
                    },
                ],
            },
            workbox: {
                globPatterns: ['**/*.{vue,js,css,html,ico,png,svg}'],
                runtimeCaching: [
                    {
                        urlPattern: /^https:\/\/raw.githubusercontent.com\/PokeAPI\/sprites\/master\/sprites\/pokemon\//,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'pokemons-images-cache',
                            expiration: {
                                maxEntries: 2000,
                                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
                            },
                            cacheableResponse: {
                                statuses: [0, 200],
                            },
                        },
                    },
                ],
            },
        }),
        ViteVue(),
    ],
});

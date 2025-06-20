// https://nuxt.com/docs/api/configuration/nuxt-config
import { transformerDirectives } from "unocss";
import process from "node:process";

const sw = process.env.SW === "true";

export default defineNuxtConfig({
  app: {
    head: {
      title: 'PARABOULE',
      htmlAttrs: {
        lang: 'en',
      },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'theme-color', content: '#000000' },
        { 'http-equiv': 'Permissions-Policy', content: 'speaker-selection=*' },

      ],
      // link: [
      //   { rel: 'preconnect', href: 'https://cdn.fonts.net' },
      //   { href: 'https://cdn.fonts.net/kit/b6404f4d-9ec8-4db4-b5d5-c631ce819028/b6404f4d-9ec8-4db4-b5d5-c631ce819028_enhanced.js', rel: 'stylesheet' },
      //   { href: 'https://cdn.fonts.net/kit/b6404f4d-9ec8-4db4-b5d5-c631ce819028/b6404f4d-9ec8-4db4-b5d5-c631ce819028_enhanced.css', rel: 'stylesheet' }
      // ]
    }
  },
  compatibilityDate: "2024-11-01",
  devtools: { enabled: false },
  ssr: false,
  modules: [
    "@vueuse/nuxt",
    "@pinia/nuxt",
    "@nuxtjs/supabase",
    "pinia-plugin-persistedstate",
    "@unocss/nuxt",
    "@vite-pwa/nuxt",
    "@vueuse/sound/nuxt",
    "@nuxt/scripts",
    "@nuxt/fonts"
  ],
  supabase: {
    redirect: false,
  },
  unocss: {
    attributify: true,
    icons: true,
    components: false,
    shortcuts: [
      ["fullScreen", "w-screen h-screen"],
      ["fullScreenAll", "w-100dvw h-100dvh fixed top-0 left-0 overflow-hidden"],
      ["flexCenter", "flex justify-center items-center"],
      ["circle", "w-10 h-10 rounded-full bg-blue-500"],
    ],
    rules: [],
    transformers: [transformerDirectives()],
  },
  vite: {
    server: {
      allowedHosts: ["elephant-emerging-uniformly.ngrok-free.app"],
    },
  },
  future: {
    typescriptBundlerResolution: true,
  },
  experimental: {
    payloadExtraction: true,
    watcher: "parcel",
  },
  nitro: {
    esbuild: {
      options: {
        target: "esnext",
      },
    },
    prerender: {
      routes: ["/"],
    },
  },
  imports: {
    autoImport: true,
  },
  pwa: {
    strategies: sw ? "injectManifest" : "generateSW",
    srcDir: sw ? "service-worker" : undefined,
    filename: sw ? "sw.ts" : undefined,
    registerType: "autoUpdate",
    manifest: {
      name: "PARABOULE",
      short_name: "PARABOULE",
      theme_color: "#000000",
      background_color: "#000000",
      display: "standalone",
      icons: [
        {
          src: "pwa-64x64.png",
          sizes: "64x64",
          type: "image/png",
        },
        {
          src: "pwa-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
        {
          src: "maskable-icon-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable",
        },
      ],
    },
    workbox: {
      globPatterns: ["**/*.{js,css,html,png,svg,ico,mp3,m4a}"],
      maximumFileSizeToCacheInBytes: 6 * 1024 * 1024, // 6 MiB limit to handle larger assets
    },
    injectManifest: {
      globPatterns: ["**/*.{js,css,html,png,svg,ico,mp3,m4a}"],
      maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
    },
    client: {
      // installPrompt: true,
      // you don't need to include this: only for testing purposes
      // if enabling periodic sync for update use 1 hour or so (periodicSyncForUpdates: 3600)
      // periodicSyncForUpdates: 20,
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallback: "/",
      navigateFallbackAllowlist: [/^\/$/],
      type: "module",
    },
  },
  runtimeConfig: {
    public: {
      ADAFRUIT_AIO_USERNAME: process.env.ADAFRUIT_AIO_USERNAME,
      ADAFRUIT_AIO_KEY: process.env.ADAFRUIT_AIO_KEY,
    },
  },
  sound: {
    sounds: {
      scan: true,
    },
  },
  pinia: {
    storesDirs: ["./stores/**"],
  },
  // scripts: {
  //   globals: {
  //     strudel: 'https://unpkg.com/@strudel/web@1.0.3',
  //   }
  // }
  fonts: {
    defaults: {
      weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    },
    families: [
      { name: 'Test', provider: 'none' },
    ]
  },
  devServer: {
    port: 5555
  }
});
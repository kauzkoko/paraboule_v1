// https://nuxt.com/docs/api/configuration/nuxt-config
import { transformerDirectives } from "unocss";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: false },
  ssr: false,
  modules: [
    "@vueuse/nuxt",
    "@pinia/nuxt",
    "@nuxtjs/supabase",
    "pinia-plugin-persistedstate",
    "@unocss/nuxt",
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
      ["flexCenter", "flex justify-center items-center"],
      ["circle", "w-10 h-10 rounded-full bg-blue-500"],
    ],
    rules: [],
    transformers: [transformerDirectives()],
  },
});

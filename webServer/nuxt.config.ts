// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  nitro: {
    plugins: ["~/server/index.ts"],
  },
  css: ["~/assets/css/main.css"],
  modules: ['@pinia/nuxt', '@sidebase/nuxt-session', "nuxt3-notifications"],
  pinia: {
    storesDirs: ['./stores/**'],
  },
  runtimeConfig: {
    mongodbUri: process.env.MONGODB_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI,
  },

  routeRules: {
    "/": { ssr: false },
  },
});
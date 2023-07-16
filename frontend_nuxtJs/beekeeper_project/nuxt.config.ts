// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/device', 
  ],
  plugins: [
    { src: '@/plugins/myPlug.js' },
  ],
  nitro:{
    compressPublicAssets: true
  },
  ssr: true,
  
})

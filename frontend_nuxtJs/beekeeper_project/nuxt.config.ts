// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/device', 
    '@nuxt/image',
  ],
  plugins: [
    { src: '@/plugins/myPlug.js' },
  ],
  nitro:{
    compressPublicAssets: true
  },
  ssr: true,
  image: {
    domains: ['owa.gagtain.ru']
  },
  
  
})

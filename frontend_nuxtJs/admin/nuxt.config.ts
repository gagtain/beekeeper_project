


// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  plugins: [
    { src: '@/plugins/myPlug.js' },
    { src: '@/plugins/useBootstrap.client.js'},
  ],
  css:['@/assets/styles/base_root.css']
})

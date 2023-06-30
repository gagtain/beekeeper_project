
export default defineNuxtPlugin(() => {
  return {
    provide: {
      api_root: 'http://localhost:8002/',
      
    }
  }
})
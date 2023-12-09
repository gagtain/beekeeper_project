import { api_root } from "~/main"

export default defineNuxtPlugin(() => {
  return {
    provide: {
      api_root: api_root,
      
    }
  }
})
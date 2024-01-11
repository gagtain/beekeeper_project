import type { NavigationGuard } from 'vue-router'
export type MiddlewareKey = "is-auth"
declare module "F:/beekeeper_project/frontend_nuxtJs/beekeeper_project/node_modules/nuxt/dist/pages/runtime/composables" {
  interface PageMeta {
    middleware?: MiddlewareKey | NavigationGuard | Array<MiddlewareKey | NavigationGuard>
  }
}
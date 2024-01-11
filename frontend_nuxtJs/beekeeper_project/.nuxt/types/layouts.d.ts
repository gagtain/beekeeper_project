import { ComputedRef, Ref } from 'vue'
export type LayoutKey = string
declare module "F:/beekeeper_project/frontend_nuxtJs/beekeeper_project/node_modules/nuxt/dist/pages/runtime/composables" {
  interface PageMeta {
    layout?: false | LayoutKey | Ref<LayoutKey> | ComputedRef<LayoutKey>
  }
}
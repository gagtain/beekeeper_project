import { ComputedRef, Ref } from 'vue'
export type LayoutKey = string
declare module "/media/gagtain/9C804AA4804A84AC/beekeeper_project/frontend_nuxtJs/beekeeper_project/node_modules/nuxt/dist/pages/runtime/composables" {
  interface PageMeta {
    layout?: false | LayoutKey | Ref<LayoutKey> | ComputedRef<LayoutKey>
  }
}
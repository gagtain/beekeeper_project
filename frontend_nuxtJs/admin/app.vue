<template>
  <div>
    <new_header></new_header>
    <page-contend></page-contend>
  </div>
</template>

<script>
import headers from '~/components/headers.vue'
import new_header from '~/components/new_header.vue';
import Page_contend from './components/page_contend.vue';
export default{
  components:{headers, new_header, Page_contend}
}

</script>
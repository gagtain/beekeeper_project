<template>
  <div>
    <new_header></new_header>
    <section class="page-content">
  <section class="search-and-user">
    <form>
      <input type="search" placeholder="Search Pages...">
      <button type="submit" aria-label="submit form">
        <svg aria-hidden="true">
          <use xlink:href="#search"></use>
        </svg>
      </button>
    </form>
    <div class="admin-profile">
      <span class="greeting">Hello admin</span>
      <div class="notifications">
        <span class="badge">1</span>
        <svg>
          <use xlink:href="#users"></use>
        </svg>
      </div>
    </div>
  </section>
    <NuxtPage/>
  </section>
  </div>
</template>

<script>
import headers from '~/components/headers.vue'
import new_header from '~/components/new_header.vue';
export default{
  components:{headers, new_header}
}

</script>
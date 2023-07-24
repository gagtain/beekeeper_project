<template>
    <div v-if="news">

        <section class="grid">
    <article style="padding: 3%; display: flex; height: auto; min-height: 300px;">
        <p>Привет {{ news[0].id }}</p>
        </article>
    <article style="display: block; height: auto;" v-for="news_item in news" :key="news_item.id">
        <p class="news_title">{{ news_item.title }} </p>
        <p>{{ $api_root + news_item.main_image }}</p>
        <div v-html="news_item.context">
        </div>
        <button class="btn">Подробнее</button>
        </article>
        </section>
    </div>
</template>

<style src="~/assets/styles/new.css" scoped>
</style>

<style scoped>

.news_title{
    color: red;
}
</style>

<script>
import newsGetList from '~/http/news/newsGetList'
export default {
    data(){
        return{
            news: null
        }
    },
    async mounted(){
        let r = await newsGetList(0, 10)
        this.news = r.data
        

    }
}
</script>

<template>
    <div v-if="news">

        <section class="grid">
    <article style="padding: 3%; display: flex; height: auto; min-height: 300px;">
        <div class="container">
            <h4 class="main_news_title">{{ news[0].title }} </h4>
            <br>
            <p class="main_element">{{ news[0].main_text }}</p>
            <div class="button">
            <nuxt-link :to="'/admin/news/'+ news[0].id"><button class="btn"><span>Подробнее</span></button></nuxt-link>
            </div>
        </div>
        
        </article>
    <article style="display: block; height: auto; padding: 3%;" v-for="news_item in news.slice(1)" :key="news_item.id">
        <div class="container">
            <h4 class="news_title">{{ news_item.title }} </h4>
            <br>
            <p class="element">{{ news_item.main_text.slice(0, 300) }}...</p> 
            <div class="button">
            <nuxt-link :to="'/admin/news/'+ news_item.id"><button class="btn"><span>Подробнее</span></button></nuxt-link>
            </div>
            
        </div>
    </article>
        </section>
    </div>
</template>

<style src="~/assets/styles/new.css" scoped>
</style>

<style scoped>

.news_title{
    color: red;
    font-size: 20px;
    text-overflow: clip;
    overflow: hidden;
    width: 100%;
    line-height: 20px;
    height: 20px;
}

.main_element{
    font-size: 20px;
}
.main_news_title{
    color: red;
    font-size: 20px;
    text-overflow: clip;
    overflow: hidden;
    width: 100%;
    line-height: 20px;
    height: 20px;
}
.container{
    overflow: hidden;
}
</style>

<script>

import newsGetList from '~/http/news/newsGetList'
export default {
    data(){
        return{
            news: null,
            maxLength: 30,

        }
    },
    async mounted(){
        let r = await newsGetList(0, 10)
        this.news = r.data

    },
     
}   

</script>

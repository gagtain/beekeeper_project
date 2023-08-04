<template>
    <div v-if="news">

        <section class="grid">
    <article v-if="news[0]" style="padding: 3%; display: flex; height: auto; min-height: 300px;">
        <div class="container">
            <h4 class="main_news_title">{{ news[0].title }} </h4>
            <br>
            <p class="main_element">{{ news[0].main_text.slice(0, 300) }}</p>
            <nuxt-link :to="'/admin/news/'+ news[0].id"><button class="btn"><span>Подробнее</span></button></nuxt-link>
        </div>
        
        </article>
    <article style="display: block; height: auto; padding: 3%;" v-for="news_item in news.slice(1)" :key="news_item.id">
        <div class="container">
            <h4 class="news_title">{{ news_item.title }} </h4>
            <br>
            <p class="element">{{ news_item.main_text.slice(0, 300) }}...</p> 
            <nuxt-link :to="'/admin/news/'+ news_item.id"><button class="btn"><span>Подробнее</span></button></nuxt-link>
        </div>
    </article>
        </section>
    <div class="paginator" v-if="total > 1">
        <button v-if="page > 1" @click="page -= 1" class="button">Назад</button>
        <button  :class="{active: page==1}" @click="page = 1" class="button">{{ 1 }}</button>
        <template v-for="t in total - 1" :key="t">
            <button v-if="t <= page + 2 && t >= page - 2 && t != 1"  :class="{active: page==t}" @click="page = t" class="button">{{ t }}</button>
        </template>
        <button :class="{active: page==total}" @click="page = total" class="button">{{ total }}</button>
            <button v-if="page !== total" @click="page += 1" class="button">Вперед</button>
    </div>
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
    height: 22px;
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
    width: 100%;
}
.paginator{
    margin: 15px 0 0 30%;
}
.paginator button{
    background: #fff;
    border: 1px solid #ddd;
    color: #337ab7;;
    text-decoration: none;
    padding: 8px 16px;
}
.paginator button.active{
    background: #337ab7;
    color: #fff;
    border-color: #337ab7;
}
.paginator button:hover{
    background: #ddd;
}
</style>

<script>

import newsGetList from '~/http/news/newsGetList'
import getNewsCount from '~/http/news/getNewsCount'

export default {
    data(){
        return{
            news: null,
            maxLength: 30,
            page: null,
            total: null,

        }
    },


    watch: {
        page() {
            window.history.pushState(
                null,
                document.title,
                `${window.location.pathname}?page=${this.page}`
            )
                this.getPageNewsList(this.page)
        }
    }, 

    async mounted(){
        let r = await newsGetList(0, 2)
        this.news = r.data
        if (this.$route.query.page == null) {
            this.page = 1
        } else {
            this.page = this.$route.query.page
        }
        let countNews = await getNewsCount()
        console.log(countNews.data.count)
        this.total = Math.ceil(countNews.data.count/2)
          

    },
    methods: {
        async getPageNewsList(number) {
            let ne = await newsGetList(number*2 - 2, 2)
            this.news = ne.data
            
            
        }
    },
}   

</script>

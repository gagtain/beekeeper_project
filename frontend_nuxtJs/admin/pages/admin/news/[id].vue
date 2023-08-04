<template>
 <div class="news_container" style="padding: 3%;" v-if="news">
    <div style="  width: 100%;
  display: flex;
  justify-content: end;">

        <button @click="delete_news()" style="width: auto; margin: 0; background: var(--red);" class="btn">Удалить</button>
    </div>
    <h1 class="news_title">{{ news.title }} </h1>
    <br>
    <p class="news_text" v-html="news.context"></p>
 </div>
</template>

<script>
import getNews from '~/http/news/getNews'
import deleteNew from '~/http/news/deleteNew'
export default {
    async mounted () {
        let r = await getNews(this.$route.params.id)
        let data = r.data
        try {
        data.context = data.context.replace('src="', `src="${this.$api_root}media/`)
        console.log(data.context)
        let width = window.screen.width
        if (width <= 900){
        data.context = data.context.replace(/width: \d{1,2}%/, 'width: 100%')
        }
    } catch {

    }
        this.news = data
        console.log(this.news)
    },
    methods:{
        async delete_news(){
            await deleteNew(this.news.id)
            this.$router.push('/admin/news')
        }
    },
    data () {
        return {
            news: null,
        }
    }
}
</script>

<style src="~/assets/styles/new.css" scoped>
</style>
<style>
.news_container{
    background: #fff;
}
.news_title{
    font-size: 35px;
}
.news_text{
    font-size: 16px;
}
</style>
<style src="~/assets/styles/news.scss" lang="scss" scoped>
</style>

<template>
  <div id="login_main">
    <div class="sot-ob">
      <div class="wrapper flex">
        <div class="login-page flex">
          <AuthImageForm></AuthImageForm>
          <div class="form">
            <p class="small login-p">Войти в аккаунт</p>

            <div class="flex h_sto">
              <div class="login-form auto">
                <div class="error_list">
                  <div v-if="login_401">
                    Нету учетной записи с введенными данными
                  </div>
                  <div v-if="message">
                    {{ message }}
                  </div>
                </div>
                <input type="text" placeholder="username" v-model="username" />
                <input
                  type="password"
                  placeholder="password"
                  v-model="password"
                />
                <button @click="login_request($event)">login</button>
                <p class="message">
                  Not registered? <a href="#">Create an account</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" src="../assets/css/login.scss" scoped></style>
<script>
import login from "@/additional_func/login";
import { useHead } from "nuxt/app";
export default {
  el: "#login_main",
  methods: {

    async login_request(event) {
      let obj = {
        username: this.username,
        password: this.password,
      };
      let response = await login(JSON.stringify(obj));
      if (response.status == 200) {
        await this.$router.push('/profile')
      } else if (response.status == 401) {
        this.login_401 = true;
      } else if (response == 404) {
        alert("сайт на проверке, подождите 5 минут");
      }
    },

  },
  mounted(){
    this.message = this.$route.query.message
  },
  data() {
    return {
      username: "gag",
      password: "13",
      login_401: false,
      message: null
    };
  },
    setup() {
      useHead({
    title: 'Пчелиная артель - Вход',
    meta: [
      { name: 'description', content: 'My amazing site.' }
    ],
      })
    }
};
</script>

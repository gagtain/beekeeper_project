<template>
  <div id="login_main">
    <div class="sot-ob">
      <div class="wrapper flex">
        <div class="login-page flex">
          <AuthImageForm></AuthImageForm>
          <div class="form">
            <p class="small login-p">Войти в аккаунт  </p>

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
                <input v-if="!is_code" type="text" placeholder="username" v-model="username" />
                <input v-if="!is_code"
                  type="password"
                  placeholder="password"
                  v-model="password"
                />
                <div v-else >
                  <p>Укажите отправленный вам код</p>
                <input type="text" placeholder="code" v-model="code" />
                </div>
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
import set_token from "~/additional_func/User/set_token";
export default {
  el: "#login_main",
  data() {
    return {
      username: "",
      password: "",
      login_401: false,
      message: null,
      is_code: false,
      code: ''
    };
  },
  methods: {

    async login_request(event) {
      if (this.is_code){
        let obj = {
        username: this.username,
        password: this.password,
        token: this.code
      };
      let response = await login(obj);
      this.default_check_status_login(response)
      }
      else{
        let obj = {
        username: this.username,
        password: this.password,
      };
        let response = await login(obj);
      if (response?.status == 400 && response?.data?.error == "Не указано поле token"){
              await set_token({
              'username':this.username,
              'password':this.password,
            })
            this.is_code = true

      }else{

        this.default_check_status_login(response)
      }
      }
      
    },
    async default_check_status_login(response){

      if (response.status == 200) {
        await this.$router.push('/profile')
      } else if (response.status == 401) {
        this.login_401 = true;
      } else if (response == 404) {
        alert("сайт на проверке, подождите 5 минут");
      }
    }
    
  },
  mounted(){
    this.message = this.$route.query.message
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

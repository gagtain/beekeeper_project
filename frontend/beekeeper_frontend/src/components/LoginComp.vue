<template>
  <div id="login_main">
    <div class="sot-ob">
      <div class="wrapper flex">
        <div class="login-page flex">
          <div class="form login-f log-img"></div>
          <div class="form">
            <p class="small login-p">Войти в аккаунт</p>
        <div v-if="login_401" class="error"><ul class="errorlist"><li>Нету учетной записи с введенными данными</li></ul></div>
            <div class="flex h_sto">
              <div class="login-form auto">
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
import axios from "axios";

export default {
  el: "#login_main",
  setup() {},
  methods: {

    set_cookie(response){
        var now = new Date();
        var time = now.getTime();
        var expireTime = time + 1000*3600;
        now.setTime(expireTime);
        document.cookie = "assess=" + response.data.access + ';expires='+now.toUTCString()+';path=/',
        document.cookie = "refresh=" + response.data.refresh + ';expires='+now.toUTCString()+';path=/'
    },
    redirect(params){
        this.$router.push(params)
    },

    login_request(event) {
      let obj = {
        'username': this.username,
        'password': this.password,
      };
      event.preventDefault;
      let self = this
      axios({
        url: "http://localhost:8000/api/token/",
        method: "post",
        data: JSON.stringify(obj),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(function (response) {
          self.set_cookie(response)
          self.redirect({
            path: '/profile'
          })
        })
        .catch(function (error) {
          console.log(error);
          if (error.response.status == 401){
            self.login_401 = true
          }
        });
    },
  },
  data() {
    return {
      username: "gag",
      password: "13",
      login_401: false
    };
  },
  created() {},
};
</script>

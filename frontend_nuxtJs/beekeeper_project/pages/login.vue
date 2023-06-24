<template>
  <div id="login_main">
    <div class="sot-ob">
      <div class="wrapper flex">
        <div class="login-page flex">
          <AuthImageForm></AuthImageForm>
          <div class="form">
            <p class="small login-p" @click="alert(1234)">Войти в аккаунт</p>

            <div class="flex h_sto">
              <div class="login-form auto">
                <div class="error_list">
                  <div v-if="login_401">
                    Нету учетной записи с введенными данными
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
import redirect from "@/additional_func/redirect";
export default {
  el: "#login_main",
  methods: {
    set_cookie(response) {
      var now = new Date();
      var time = now.getTime();
      var expireTime = time + 1000 * 3600;
      now.setTime(expireTime);
      (document.cookie =
        "assess=" +
        response.data.access +
        ";expires=" +
        now.toUTCString() +
        ";path=/"),
        (document.cookie =
          "refresh=" +
          response.data.refresh +
          ";expires=" +
          now.toUTCString() +
          ";path=/");
    },

    async login_request(event) {
      event.preventDefault;
      let obj = {
        username: this.username,
        password: this.password,
      };
      let response = await login(JSON.stringify(obj));
      console.log(response);
      if (response.status == 200) {
        this.set_cookie(response);
        redirect(this, {
          path: "/profile",
        });
      } else if (response.status == 401) {
        console.log("asd");
        this.login_401 = true;
      } else if (response == 404) {
        alert("сайт на проверке, подождите 5 минут");
      }
      return false;
    },

  },
  data() {
    return {
      username: "gag",
      password: "13",
      login_401: false,
    };
  },
};
</script>

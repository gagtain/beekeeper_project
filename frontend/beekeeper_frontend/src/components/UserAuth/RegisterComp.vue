<template>
  <div class="sot-ob">
    <div class="wrapper flex">
      <div class="login-page flex" id="registry">
        <div class="form login-f log-img"></div>
        <div class="form">
          <p class="small login-p">Создать аккаунт</p>
          <div class="flex h_sto">
            <form class="register-form auto" id="form">
              <div class="error_list">
                <div v-for="element in v$.username.value.$errors" :key="element.$uid">
                    {{element.$message}}
                </div>
                </div>
              <input
                type="text"
                :placeholder="username.label"
                :name="username.name"
                v-model="v$.username.value.$model"

              />
              <div class="error_list">
                <div v-for="element in v$.FIO.value.$errors" :key="element.$uid">
                    {{element.$message}}
                </div>
                </div>
              <input type="text" :placeholder="FIO.label" :name="FIO.name"
                v-model="v$.FIO.value.$model" />
              
              <div class="error_list">
                <div v-for="element in v$.password.value.$errors" :key="element.$uid">
                    {{element.$message}}
                </div>
              </div>
              <input
                type="text"
                :placeholder="password.label"
                :name="password.name"
                v-model="v$.password.value.$model"
              />
              <div class="error_list flex jus-sp-ar">
                <div v-for="element in v$.password2.value.$errors" :key="element.$uid">
                    {{element.$message}}
                </div>
                </div>
              <input
                type="text"
                :placeholder="password2.label"
                :name="password2.name"
                v-model="v$.password2.value.$model"
              />
              <button @click="refisterSubmit($event)">create</button>
              <p class="message">Already registered? <a href="#">Sign In</a></p>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="../../assets/css/login.scss" scoped></style>

<script>
import { useVuelidate } from "@vuelidate/core";
import { helpers, required, minLength, sameAs } from "@vuelidate/validators";
import redirect from '../../additional_func/redirect'
import register from '../../additional_func/register'
export default {
  el: "#registry",
  data() {
    return {
      v$: useVuelidate(),
      username: {
        label: "Логин",
        name: "username",
        value: "",
      },
      FIO: {
        label: "ФИО",
        name: "FIO",
        value: "",
      },
      password: {
        label: "Пароль",
        name: "password",
        value: "",
      },
      password2: {
        label: "Подтверждение пароля",
        name: "password2",
        value: "",
      },
    };
  },
  methods:{
    async refisterSubmit(event){
        this.v$.$touch()
        event.preventDefault();
        if (!this.v$.$error){
            let response = await register(new FormData(document.getElementById('form')))
            if (response.status == 201){
                console.log('success')
                redirect(this,{
            path: '/profile'
          })
            }else if (response.status == 400){
                console.log('error')
            }else if (response.status == 404){
                alert('сайт на проверке, подождите 5 минут')
            }
}
        return false;
    }
  },
  validations() {
    return {
      username: {
        value: {
            required: helpers.withMessage('Требуется', required)
        },
      },
      FIO: {
        value: {
            required: helpers.withMessage('Требуется', required)
        },
      },
      password: {
        value: {
            minLength: helpers.withMessage('Длинна не менее 8-ми символов', minLength(8)),
            required: helpers.withMessage('Требуется', required)
        },
      },
      password2: {
        value: {
            minLength: helpers.withMessage('Длинна не менее 8-ми символов', minLength(8)),
            required: helpers.withMessage('Требуется', required),
            sameAsPassword: helpers.withMessage('Пароли не совпадают', sameAs(this.password.value))
        },
      },
    };
  },

};
</script>

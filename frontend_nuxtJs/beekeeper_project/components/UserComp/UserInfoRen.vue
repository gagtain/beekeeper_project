<template>
    <div class="user_kor_zak" id="UserInfoRen">
            <div class="user_kor flex relative">
              <div class="w-sto h_sto s flex absolute">
                <div class="auto edit-user_info h_sto">
                  <button
                    onclick="alert('В разработке')"
                    class="edit-user_info_btn auto"
                  >
                    Изменить данные
                  </button>
                </div>
              </div>

              <div class="auto edit_block w-sto" style="filter: blur(10px)">
                <input
                  type="text"
                  class="user_form_input"
                  placeholder="username"
                />
                <input
                  type="password"
                  class="user_form_input"
                  placeholder="password"
                />
                <button class="edit-user_info_btn auto">Подтвердить</button>
              </div>
            </div>
            <div class="user_zak relative">
              <p class="small">Последний заказ</p>
              <div v-if="last_order.amount" class="end_zakaz">
                <div class="end_zakaz_img flex">
                  <img
                    style="aspect-ratio: 1/1"
                    class="auto w-sto"
                    :src="$api_root + last_order.product_list_transaction[0].productItem.product.image.slice(1)"
                    alt=""
                  />
                </div>
                <div class="end_zakaz_info flex">
                  <div class="auto end_zakaz_info_p_all">
                    <div class="block w-sto">
                      <p class="normal-small end_zakaz_info_p">Цена:</p>
                      <span class="info_end_zakaz_span">{{ last_order.amount }}</span>
                    </div>
                    <div class="block w-sto">
                      <p class="normal-small end_zakaz_info_p">
                        Дата офомления:
                      </p>
                      <span class="info_end_zakaz_span">20-10-23</span>
                    </div>
                    <div class="block">
                      <p class="normal-small end_zakaz_info_p">Статус:</p>
                      <span class="info_end_zakaz_span">В пути</span>
                    </div>
                  </div>
                </div>
              </div>
              <LoadingComp v-else-if="isLastOrder_loading"></LoadingComp>
              <div class="auto" v-else>
                    <p style="font-size: 28px;" class="VAG">Список заказов пуст :(</p>
                    <div class="select_size" >
                      <router-link to="/basket">
                            <button style="background: rgb(76, 175, 80); cursor: pointer; width: 100%; border: medium none; border-radius: 6px;font-size: 26px;padding: 2%;margin-top: 1%;" >
                              Перейти в корзину
                            </button>
                          </router-link>
                          </div></div>
            </div>
          </div>
</template>


<style lang="css" src="../../assets/css/account.css" scoped></style>

<script>
import getLastOrder from "~/additional_func/getLastOrder"
import LoadingComp from '../AddtionalComp/LoadingComp.vue'
export default {
  components: { LoadingComp },
    el: '#UserInfoRen',
    name: 'UserInfoRen',
    data(){
      return{
        last_order: {
          amount: null,
          product_list_transaction:[{
            productItem:{
              product:{
              image: null
            }
            }
            
          }]
        },
        isLastOrder_loading: true
      }
    },
    
    async mounted() {
      let response_last_order = await getLastOrder()
      if (response_last_order.code != 400){
        this.last_order = response_last_order.data
        console.log(123213)
        this.isLastOrder_loading = false
      }else{
        this.isLastOrder_loading = false
      }
       
    },
}
</script>

<template>
  <div class="sot-ob">
    <div class="wrapper flex">
        <DialogWindow :id="'product_rating'">
            <OrderProductList v-if="rating_list" :orderList="rating_list_obj">
                <template v-slot:default="slotProps">
                    <button @click="select_rating_product(slotProps.orderItem.productItem.product.id)" style="background: rgb(76, 175, 80); cursor: pointer; width: 100%; border: medium none; border-radius: 6px;font-size: 16px;padding: 2%;margin-top: 1%;" >
                              Выбрать
                            </button>
                </template>

        
        
        </OrderProductList>
        <div  v-else>
        <div   class="flex">

            <RatingChoise :product_id="select_rating_product_id" v-on:submit="RatingSubmit($event)"></RatingChoise>
        </div>
            <p class="VAG" align="center">Ваш отзыв</p>
        </div>
            
        
        </DialogWindow>
        <DialogWindow :id="'order_canceled'" style="width: fit-content; max-width: none;">
            <OrdersCanceled :order_id="select_order"></OrdersCanceled>
        </DialogWindow>
      <div class="user_card flex auto">
        <div class="interactiv user_card_div auto" id="orders_main">
          <div class="kor w-sto relative">
    <p class="small-big VAG">Заказы</p>
    <div class="w-sto h_sto">
        <div v-if="!list_order[0].loading" class="product_order_list ">
                <div v-for="order in list_order" :key="order.id" class="order m-2" >
                    <div :class="order.status == 'Закрытый' ? 'not-active' : ''">

                    <div class="flex w-sto jus-sp">
                    <p align="left">Заказ номер {{ order.id }}</p>
                        <div class="select_size" >
                            <button @click="ratingDialog(order.product_list_transaction)" style="background: rgb(76, 175, 80); cursor: pointer; width: 100%; border: medium none; border-radius: 6px;font-size: 16px;padding: 2%;margin-top: 1%;" >
                              Оставить отзыв
                            </button>
                          </div>
                    </div>

                    <div class="order_warp w-sto h_sto flex jus-sp">
                        <div class="product_order m-2">
                            <order-product-list :orderList="order.product_list_transaction"></order-product-list>

              </div><div class="order_description">
                        <div class="flex w-sto m-2">
                            <div class="w-50 ">

                                <p>Когда</p>
                            </div>
                            <div class="w-50">

                                <p>{{ getDateFormat(new Date(order.datetime))  }}</p>
                            </div>
                        </div>
                        <div class="flex w-sto m-2">
                            <div class="w-50 ">

                                <p>Куда</p>
                            </div>
                            <div class="w-50">

                                <p>{{ order.order_address }} {{ order.order_index }}</p>
                            </div>
                        </div>
                        <div class="flex w-sto m-2">
                            <div class="w-50 ">

                                <p>Способ оплаты</p>
                            </div>
                            <div class="w-50">

                                <p>Онлайн {{ order.amount }}</p>
                            </div>
                        </div>
                        <div class="flex w-sto m-2">
                            <div class="w-50 ">

                                <p>Покупатель</p>
                            </div>
                            <div class="w-50">

                                <p>{{ order.user.FIO }} {{ order.user.email }}</p>
                            </div>
                        </div>
                        <div class="flex w-sto m-2">
                            <div class="w-50 ">

                                <p>Получатель</p>
                            </div>
                            <div class="w-50">

                                <p>{{ order.user.FIO }} {{ order.user.email }}</p>
                            </div>
                        </div>
                        <div class="flex w-sto m-2">
                            <div class="w-50 ">

                                <p>Стоимости доставки</p>
                            </div>
                            <div class="w-50">

                                <p>* в разработке *</p>
                            </div>
                        </div> 
                        <div v-if="order.delivery != null" class="flex w-sto m-2">
                            <div class="w-50 ">

                                <p>Статус доставки</p>
                            </div>
                            <div class="w-50">

                                <p>{{ order.delivery.status }}</p>
                            </div>
                        </div>
                        <div class="flex w-sto m-2">
                            <div class="w-50 ">

                                <p>Статус оплаты</p>
                            </div>
                            <div class="w-50">

                                <p>{{ order.payment.status }}</p>
                            </div>
                        </div>
              </div>
                    </div>
                    <div class="order_menu m-2">
                        
                    <button v-if="order.status == 'Одобрен'" onclick="alert('В разработке')" style="background: yellow; cursor: pointer; width: 100%; border: medium none; border-radius: 6px;font-size: 16px;padding: 2%;margin-top: 1%;" >
                              Отследить
                            </button>
                            <div v-if="order.payment.status == 'pending'">

                                <p>Заказ будет отменен через 30 минут, в случае если он не будет оплачен</p>
                            <button @click="order_redirect_payments(order.payment.url)" style="background: rgb(76, 175, 80); cursor: pointer; width: 100%; border: medium none; border-radius: 6px;font-size: 16px;padding: 2%;margin-top: 1%;" >
                              Оплатить
                            </button>
                            </div>
                    </div>
                    
                </div>
                    <button
                     v-if="order.status == 'Закрытый'" 
                     style="background: rgb(76, 175, 80); cursor: pointer; width: 100%; border: medium none; border-radius: 6px;font-size: 16px;padding: 2%;margin-top: 1%;" 
                     @click="order_restart(order.id)"
                     >
                              Повторить заказ
                            </button>
                    </div>
            </div>
            <div v-else-if="list_order[0].no_order" class="w-sto h_sto flex auto">
                <div class="auto">
                    <p style="font-size: 28px;" class="VAG">Список заказов пуст :(</p>
                    <div class="select_size" >
                      <router-link to="/basket">
                            <button style="background: rgb(76, 175, 80); cursor: pointer; width: 100%; border: medium none; border-radius: 6px;font-size: 26px;padding: 2%;margin-top: 1%;" >
                              Перейти в корзину
                            </button>
                          </router-link>
                          </div></div>
                </div>
                
            <LoadingComp v-else></LoadingComp>
    </div>
            
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="css" src="../assets/css/account.css" scoped></style>
<style scoped>
.kor {
  min-height: 50vh;
}
.name_order_product {
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 16px;
  overflow: hidden;
}
.order_description, .product_order{
    width: 40%;
}
.order{
    width: 60%;
    margin-inline: auto;  
    border: 2px solid gray;
  padding: 2%;
}
.img_order_product_div{
    width: 80px;
}
.img_order_product{
    width: 100%;
    aspect-ratio: 1/1;
}
.product_order_info{
    display: flex;
}
.info_order_product_div{
    padding: 2% 0;
    text-align: left;
}
.order_description{
    text-align: left;
}
@media (max-width: 1000px) {
    .order{
        display: block;
        width: 100%;
    }
    .order_description, .product_order{
        width: 100%;
    }
}
@media (max-width: 500px) {
    .order{
        width: 100%;
    }
    .order_warp{
        display: block;
    }
    
}
.not-active{
    opacity: .8;
    pointer-events: none;
}
</style>
<script>
import getListOrder from '~/additional_func/getListOrder';
import LoadingComp from '../components/AddtionalComp/LoadingComp.vue';
import OrderProductList from '~/components/AddtionalComp/OrderProductList.vue';
import DialogWindow from '../components/AddtionalComp/Dialog.vue';
import RatingChoise from '~/components/Tovar/RatingChoise.vue';
import OrdersCanceled from '~/components/Orders/OrdersCanceled.vue';
import OrderRestart from '~/additional_func/Orders/RestartOrder'
export default {
  components: { LoadingComp, OrderProductList, DialogWindow, RatingChoise, OrdersCanceled },
  el: "orders_main",
  name: "BasketBase",
  data(){
    return{
        list_order:[
            {loading: true, no_order: false}, // свойство для проверки загрузки 
            {
                id: null,
                amount: null,
                user:{
                    FIO: null,
                    email: null,
                },
                product_list_transaction:[{
                    id: null,
                    productItem:{
                        id: null,
                        product:{
                            name: null,
                        description: null,
                        image: null,
                        price_currency: null,
                        price: null,
                        },
                        weight:{
                        id: null,
                        weight: null,
                    },
                    type_packaging:{
                        id: null,
                        name: null,
                    },
                        
                        

                    },
                    
                    count: null
                }],
                datetime: null,
                order_address: null,
                order_index: null
            }
        ],
        rating_list: true,
        select_rating_product_id: null,
        rating_list_obj: [],
        select_order: null
    }
  },
  async mounted(){
    let response_list_order = await getListOrder()
    if (response_list_order.status != 404){
        this.list_order = response_list_order.data
    }else{
        this.list_order[0].no_order = true
    }
  },
  methods:{
    select_rating_product(id){
        this.select_rating_product_id = id,
        this.rating_list = false
    },
    RatingSubmit(status){
        console.log(status)
        if (status == 201){

            this.rating_list = true
        }else{
            this.rating_list = true
            alert('Вы уже оставляли отзыв')
        }
    },
    getDateFormat(date){
        return `${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`
    },
    ratingDialog(rating_list_obj){
        this.rating_list_obj = rating_list_obj
        let a = document.getElementById('product_rating')
        a.showModal();
    },
    order_canceled(order_id){
        this.select_order = order_id
        let a = document.getElementById('order_canceled')
        a.showModal();
    },
    async order_restart(id){
        await OrderRestart(id)
        this.$router.push('/basket')
    },
    order_redirect_payments(url){
        window.location.href = url
    }
  }
};
</script>

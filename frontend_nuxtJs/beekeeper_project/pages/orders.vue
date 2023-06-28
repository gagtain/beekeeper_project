<template>
  <div class="sot-ob">
    <div class="wrapper flex">
      <div class="user_card flex auto">
        <div class="interactiv user_card_div auto" id="orders_main">
          <div class="kor w-sto relative">
    <p class="small-big VAG">Заказы</p>
    <div class="w-sto h_sto">
        <div v-if="!list_order[0].loading" class="product_order_list ">
                <div v-for="order in list_order" :key="order.id" class="order m-2">
                    <p align="left">Заказ номер {{ order.id }}</p>
                    <div class="w-sto h_sto flex">
                        <div class="product_order m-2">
                <div v-for="orderItem in order.product_list_transaction" :key="orderItem.id" class="product_order_info">
                  <div class="img_order_product_div">
                    <img class="img_order_product" :src="$api_root + orderItem.productItem.product.image" alt="" />
                  </div>
                  <div class="info_order_product_div">

                    <div class="name_order_product">{{ orderItem.productItem.product.name }} [{{ orderItem.productItem.weight.weight }} гр, {{ orderItem.productItem.type_packaging.name }}]</div>
                <p>{{ orderItem.productItem.product.price }} {{ orderItem.productItem.product.price_currency }}</p>
                <p>{{ orderItem.count }} шт</p>
                  </div>
                </div>

              </div><div class="order_description">
                        <div class="flex w-sto m-2">
                            <div class="w-50 ">

                                <p>Когда</p>
                            </div>
                            <div class="w-50">

                                <p>Когда</p>
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
              </div>
                    </div>
                    
                    
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
    width: 50%;
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
    }
    .order_description, .product_order{
        width: 100%;
    }
}
@media (max-width: 500px) {
    .order{
        width: 100%;
    }
    
}
</style>
<script>
import getListOrder from '~/additional_func/getListOrder';
import LoadingComp from '../components/AddtionalComp/LoadingComp.vue';
export default {
  components: { LoadingComp },
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
                datetime: null
            }
        ]
    }
  },
  async mounted(){
    let response_list_order = await getListOrder()
    if (response_list_order.status != 404){
        this.list_order = response_list_order.data
    }else{
        this.list_order[0].no_order = true
    }
  }
};
</script>

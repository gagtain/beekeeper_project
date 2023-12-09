<template>
  
</template>

<script>
export default {
  el: "#notify",
    props: ['basket_list'],
  data() {
    return {
      connection: null,
    };
  },
  created() {
    this.connection = new WebSocket(`wss://owa.pchel-artel.ru/ws/api/v0.1/online_store`);

    this.connection.onmessage = this.onmessage
    let time = new Date()
    let socket = this.connection
    this.connection.onopen = function (event) {
        socket.send(
            JSON.stringify(
            {
            "request_id": time.getTime(),
            "action":"subscribe_to_product_item",
            "type": "basket"
        })
        )
    }
  },
  methods:{
    onmessage
        (event) {
      let data = JSON.parse(event.data)
      switch (data.type){
        case 'product_item':
            switch (data.action){
                case 'update':
                    let index = this.$store.getUser.basket.findIndex(e => e.productItem.id == data.data.id)
                    this.$store.ADD_BASKET_REFACTOR_WEBSOCKET({
                        type: "price",
                        id: data.data.id
                    })
                    this.$store.getUser.basket[index].productItem = data.data
                    this.$store.REFACTOR_TOOLTIP({
			status: true,
			title: 'Товар из корзины был изменен'
		})   
                    setInterval(() => {
                        this.$store.REMOVE_BASKET_REFACTOR_WEBSOCKET({
                        type: "price",
                        id: data.data.id
                    })
                    }, 2000)     
                    break;
            }
      }
    
    }
  }
};
</script>

<style>

</style>
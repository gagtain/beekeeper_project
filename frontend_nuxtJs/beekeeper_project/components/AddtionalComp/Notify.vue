<template>
  <div id="notify">
    <div v-for="notify in notify_list" :key="notify.id" class="flex jus-sp m2">
      <div class="notify_img_div flex">
        <img src="/favicon.ico" alt="" class="auto">
      </div>  
      <div class="notify_context">
        
      <p>{{ notify.text }}</p>
      <p>Тип: {{ notify.type }}</p>
      <button style="background: rgb(76, 175, 80); cursor: pointer; width: 100%; border: medium none; border-radius: 6px;font-size: 16px;padding: 2%;margin-top: 1%;" >
      Перейти
      </button>
      </div>
    </div>
  </div>
  
</template>
<style>
.notify_img_div{
  width: 25%;
  aspect-ratio: 1/1;

}
.notify_img_div img{
  width: 100%;
  aspect-ratio: 1/1;
}
.notify_context{
  width: 70%;
}
</style>
<script>
export default {
  el: "#notify",

  data() {
    return {
      connection: null,
      notify_list: null
    };
  },
  created() {
    this.connection = new WebSocket(`ws://localhost:8000/api/v0.1/notify`);

    this.connection.onmessage = this.onmessage
    let time = new Date()
    let socket = this.connection
    this.connection.onopen = function (event) {
        socket.send(JSON.stringify({
            "request_id": time.getTime(),
            "action": "subscribe_to_notify",
            "all_notify": true
        })),
        socket.send(
            JSON.stringify({
            "request_id": time.getTime(),
            "action": "get_old_notify"
        }
        )
        
        )
    }
  },
  methods:{
    onmessage
        (event) {
      let data = JSON.parse(event.data)
      switch (data.type){
        case 'old_notify':
            console.log('123')
            this.notify_list = data.data
            break
        case 'subscribe':
            switch (data.action){
                case 'create':
                    console.log('123')
                    this.notify_list.unshift(data.data)
                    break
                case 'update':
                    let index = this.notify_list.findIndex(e => e.id == data.data.id)
                    this.notify_list[index] = data.data        
                    break
                case 'delete':
                    let index_del = this.notify_list.findIndex(e => e.id == data.data.id)
                    this.notify_list.splice(index_del, 1)
                    break
            }
      }
      console.log(this.notify_list)
    
    }
  }
};
</script>

<style></style>

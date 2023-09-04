<template>
  <div id="notify">
    <div v-for="notify in notify_list" :key="notify.id">
        <p>{{ notify.text }}</p>
    </div>
  </div>
  
</template>

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
            console.log(1243)
            this.notify_list = data.data
            console.log(this.notify_list)
            break
        case 'subscribe':
            switch (data.action){
                case 'create':
                    console.log('123')
                    this.notify_list.unshift(data.data)
                    break
            }
      }
      console.log(this.notify_list)
    
    }
  }
};
</script>

<style></style>

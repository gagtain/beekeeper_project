<template>
  <div style="display: flex;">

    <div class="dropdown" @click.stop>
            <button id="navbarDropdown" data-bs-toggle="dropdown" class="btn btn-primary dropdown-toggle"><slot></slot></button>
            
          <ul class="dropdown-menu" @click.stop aria-labelledby="navbarDropdown">
            <div class="mt-2 dropdown">
                <p class="dropdown-item" @click.stop="align_refactor('left')">Положение - слева</p>
                <p class="dropdown-item" @click.stop="align_refactor('right')">Положение - справо</p>
                <p class="dropdown-item" @click.stop="align_refactor('center')">Положение - центр</p>
        </div>
                
          </ul>
        </div>
    <div class="dropdown" @click.stop>
            <button id="navbarDropdown" data-bs-toggle="dropdown" class="btn btn-primary dropdown-toggle">Изменить размер шрифта</button>
            
          <ul class="dropdown-menu" @click.stop aria-labelledby="navbarDropdown">
            <div class="mt-2 dropdown">
              <li><p class="dropdown-item"  @click.stop="font_size_refactor()">Шрифт <input @click.stop v-model="font_size" type="text" name="" id=""></p></li>

        </div>
                
          </ul>
        </div>
    <div class="dropdown" @click.stop>
            <button id="navbarDropdown" data-bs-toggle="dropdown" class="btn btn-primary dropdown-toggle">Изменить цвет</button>
            
          <ul class="dropdown-menu" @click.stop aria-labelledby="navbarDropdown">
            <div class="mt-2 dropdown">
              <li><p class="dropdown-item" >Цвет <input @change.stop="color_refactor($event)" type="color" name="" id=""></p></li>

        </div>
                
          </ul>
        </div>
  </div>
</template>

<script>
export default {
  props:['el'],
  data(){
    return{
      font_size: '0',
    }
  },
  setup() {
    
  },
  methods:{

    align_refactor(sett){
            this.el.align = sett
        },
        font_size_refactor(){
          this.el.font_size = this.font_size
        },
        color_refactor(event){
          this.el.color = event.target.value
        }
  }
}
</script>
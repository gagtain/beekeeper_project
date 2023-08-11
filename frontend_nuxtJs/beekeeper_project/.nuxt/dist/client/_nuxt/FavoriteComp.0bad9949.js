import{i as d,j as u,a as l,o as i,e as o,Y as f,f as c}from"./entry.ca48256d.js";async function h(e,t){try{var s=await d({url:`${u}api/v0.1/beekeeper_web_api/basket/${e}`,method:"post",headers:{},withCredentials:!0,data:{type_weight:t}});return s}catch(n){return n.response}}async function v(e){try{var t=await d({url:`${u}api/v0.1/beekeeper_web_api/basket/${e}`,method:"delete",headers:{},withCredentials:!0});return t}catch(s){return s.response}}const m={methods:{tooltip(){this.$store.REFACTOR_TOOLTIP({status:!0,title:"Успешно"})}}};function $(e,t,s,n,_,a){return null}const p=l(m,[["render",$]]);const k={el:"#addBasket",name:"AddBasket",props:["id"],data(){return{isBasket:!1}},created(){},mixins:[p],setup(){},methods:{a(){let e=this;return this.$store.getUser.basket.find(function(s){return e.id==s.productItem.id})},async addBasketBtn(){let e=await h(this.id);e.status==200?(this.$store.ADD_BASKET_ITEM(e.data.basketItem),this.isBasket=!0,this.tooltip()):e.status==401&&this.$router.push("/login?message=Для данного действия необходимо авторизоваться")},async removeBasketBtn(){let e=await v(this.id);e.status==200?(this.$store.REMOVE_BASKET_ITEM(e.data.id),this.isBasket=!1,this.tooltip()):e.status==401&&this.$router.push("/login?message=Для данного действия необходимо авторизоваться")}},watch:{pack_id(){console.log(3214),this.a()},wei_id(){console.log(3214),this.a()}}},B={id:"addBasket"};function w(e,t,s,n,_,a){return i(),o("div",B,[a.a()?(i(),o("button",{key:0,onClick:t[0]||(t[0]=(...r)=>a.removeBasketBtn&&a.removeBasketBtn(...r)),class:"w-sto btn au"},"Из корзины")):(i(),o("button",{key:1,onClick:t[1]||(t[1]=(...r)=>a.addBasketBtn&&a.addBasketBtn(...r)),class:"w-sto btn au"},"В корзину"))])}const T=l(k,[["render",w],["__scopeId","data-v-164542d6"]]);async function g(e){try{var t=await d({url:`${u}api/v0.1/beekeeper_web_api/favorite/${e}`,method:"post",headers:{},withCredentials:!0});return t}catch(s){return s.response}}async function b(e){try{var t=await d({url:`${u}api/v0.1/beekeeper_web_api/favorite/${e}`,method:"delete",headers:{},withCredentials:!0});return t}catch(s){return s.response}}const y=f({el:"#favorite",name:"FavoriteComp",props:["id"],mixins:[p],setup(){},created(){this.a()},methods:{a(){let e=this;return this.$store.getUser.favorite_product.find(function(s){return e.id==s.productItem.id})},async addFavoriteBtn(){let e=await g(this.id);e.status==200?(this.$store.ADD_FAVORITE_ITEM(e.data.favoriteItem),this.isFavorite=!0,this.tooltip()):e.status==401&&this.$router.push("/login?message=Для данного действия необходимо авторизоваться")},async removeFavoriteBtn(){let e=await b(this.id);e.status==200?(this.$store.REMOVE_FAVORITE_ITEM(e.data.id),this.tooltip()):e.status==401&&this.$router.push("/login?message=Для данного действия необходимо авторизоваться")}},watch:{wei_id(){this.a()}}},"$mMs4bzKJaw"),E=["src"],F=["src"];function C(e,t,s,n,_,a){return e.a()?(i(),o("button",{key:0,onClick:t[0]||(t[0]=r=>e.removeFavoriteBtn()),id:"favorite",class:"fav-btn flex"},[c("img",{class:"auto",src:`${e.$api_root}static/online_store/images/favorite/favorite_remove.png`,alt:""},null,8,E)])):(i(),o("button",{key:1,id:"favorite",onClick:t[1]||(t[1]=r=>e.addFavoriteBtn()),class:"fav-btn flex"},[c("img",{class:"auto",src:`${e.$api_root}static/online_store/images/favorite/favorite_add.png`,alt:""},null,8,F)]))}const A=l(y,[["render",C],["__scopeId","data-v-23c1e945"]]);export{T as A,A as F};

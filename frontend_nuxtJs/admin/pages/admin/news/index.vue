<template>
  <div class="mt-5" style="padding-bottom: 10%">
    <div class="card col-sm-6 m-auto mt-2">
      <div class="card-header">
        <div class="form-group">
          <input
            type="text"
            class="form-control"
            v-model="name"
            id="exampleInputPassword1"
            placeholder="Введите название"
          />
        </div>
      </div>
      <div class="card-body" id="cart_body">
        <h5 class="card-title"></h5>
        <div
          v-for="(el, index) in elements"
          :key="el.id"
          class="form-group"
          id="textarea_form"
        >
          <text-area
            v-on:text_area_sub="el_sub($event)"
            :el="el"
            :index="index"
            v-if="el.type == 'textarea'"
          ></text-area>
          <image-obj
            :el="el"
            :index="index"
            :select_id_media="select_id_media"
            v-else-if="el.type == 'image'"
          ></image-obj>
          <div v-if="el.submit == 'true'" style="display: flex">
            <div class="dropdown" @click.stop>
              <button
                style="margin: auto"
                id="navbarDropdown"
                data-bs-toggle="dropdown"
                class="btn btn-primary dropdown-toggle"
              >
                Добавить
              </button>

              <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <p class="dropdown-item" @click="el_add('textarea', index)">
                    Большой текст
                  </p>
                </li>
                <li>
                  <p class="dropdown-item" @click="el_add('image', index)">
                    Картинка
                  </p>
                </li>
              </ul>
            </div>
            <div class="dropdown" @click.stop>
              <button
                style="margin-left: 3px"
                id="navbarDropdown"
                data-bs-toggle="dropdown"
                class="btn btn-primary dropdown-toggle"
              >
                Добавить перед элементом
              </button>

              <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <p
                    class="dropdown-item"
                    @click="el_add('textarea', index - 1)"
                  >
                    Большой текст
                  </p>
                </li>
                <li>
                  <p class="dropdown-item" @click="el_add('image', index - 1)">
                    Картинка
                  </p>
                </li>
              </ul>
            </div>
            <button
              style="margin-left: 3px"
              @click="el_remove(index)"
              class="btn btn-danger"
            >
              Удалить
            </button>
          </div>
        </div>
        <div class="mt-2 dropdown" @click.stop>
          <button
            style="margin: auto"
            id="navbarDropdown"
            data-bs-toggle="dropdown"
            class="btn btn-primary dropdown-toggle"
          >
            Добавить
          </button>

          <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
            <li>
              <p
                class="dropdown-item"
                @click="el_add('textarea', elements.length - 1)"
              >
                Большой текст
              </p>
            </li>
            <li>
              <p
                class="dropdown-item"
                @click="el_add('image', elements.length - 1)"
              >
                Картинка
              </p>
            </li>
          </ul>
        </div>
      </div>
      <button
        @click="pred_rel = !pred_rel"
        href="#"
        class="btn mt-2 btn-primary"
      >
        Предпросмотр
      </button>
    </div>
    <div v-if="pred_rel" class="card col-sm-6 m-auto mt-2">
      <div class="card-header">
        <div class="form-group">
          <p style="font-size: 24px">{{ name }}</p>
        </div>
      </div>
      <div class="card-body" id="cart_body_rel">
        <div
          v-for="(el, index) in get_pred_rel_elements()"
          :key="el.id"
          class="form-group"
          id="textarea_form"
        >
          <text-area-rel
            v-on:text_area_sub="el_sub($event)"
            :el="el"
            :index="index"
            v-if="el.type == 'textarea'"
          ></text-area-rel>
          <image-rel
            :el="el"
            :index="index"
            :select_id_media="select_id_media"
            v-else-if="el.type == 'image'"
          ></image-rel>
        </div>
      </div>
      <button @click="pred_rel_create()" href="#" class="btn mt-2 btn-primary">
        Подтвердить
      </button>
    </div>
  </div>
</template>

<script>
import ImageObj from "~/components/NewsConstructor/Image.vue";
import ImageRel from "~/components/NewsConstructor/Pred_rel/ImageRel.vue";
import TextAreaRel from "~/components/NewsConstructor/Pred_rel/TextAreaRel.vue";
import TextArea from "~/components/NewsConstructor/TextArea.vue";
import axios from "axios";
export default {
  components: { TextArea, ImageObj, TextAreaRel, ImageRel },

  data() {
    return {
      header: "",
      textarea: "",
      elements: [
        {
          id: 1,
          type: "textarea",
          submit: "none",
          text: "",
          width: "100",
          align: "left",
          margin: "0",
          margin_bottom: "0",
          height: "300",
        },
      ],
      width: "100",
      default_obj: {
        id: null,
        type: "",
        submit: "none",
        text: "",
        width: "100",
        align: "0",
        margin: "0",
        margin_bottom: "0",
        height: "300",
        font_size: "16",
        color: "#000",
        img_src: "",
      },
      count: 1,
      pred_rel: false,
      name: "",
      main_image: "",
    };
  },
  setup() {},
  methods: {
    el_add(type, index) {
      this.count++;
      console.log(this.count);
      let el = Object.assign({}, this.default_obj);
      el.id = this.count;
      el.type = type;
      console.log(index);
      this.elements.splice(index + 1, 0, el);
    },
    el_sub(index) {
      console.log(123, index);
      this.elements[index].submit = "true";
    },
    el_remove(index) {
      this.elements.splice(index, 1);
    },
    get_pred_rel_elements() {
      let el = this.elements.slice();

      return el.filter((f) => f.submit == "true");
    },
    get_main_title() {
      let main_text = ''
      for (var i = 0; i < this.elements.length; i++) {
        if (this.elements[i].type == "textarea") {
          main_text = this.elements[i].text;
          break;
        }
      }
      return main_text
    },
    pred_rel_create() {
      console.log(213);
      let form = new FormData();
      form.append("main_image", this.main_image);
      form.append(
        "context",
        document.getElementById("cart_body_rel").innerHTML
      );
      form.append("title", this.name);
      form.append("main_text", this.get_main_title());
      axios({
        url: "http://localhost:8000/api/v0.1/news/create",
        method: "post",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: form,
      });
    },
  },
};
</script>

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
            <div class="user_zak" onclick="alert('В разработке')">
              <p class="small">Последний заказ</p>
              <div class="end_zakaz">
                <div class="end_zakaz_img flex">
                  <img
                    width="100%"
                    style="aspect-ratio: 1/1"
                    class="auto"
                    src="../../assets/images/2.png"
                    alt=""
                  />
                </div>
                <div class="end_zakaz_info flex">
                  <div class="auto end_zakaz_info_p_all">
                    <div class="block w-sto">
                      <p class="normal-small end_zakaz_info_p">Цена:</p>
                      <span class="info_end_zakaz_span">400 р</span>
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
            </div>
          </div>
</template>


<style lang="css" src="../../assets/css/account.css" scoped></style>

<script>
export default {
    el: '#UserInfoRen',
    name: 'UserInfoRen'
}
</script>

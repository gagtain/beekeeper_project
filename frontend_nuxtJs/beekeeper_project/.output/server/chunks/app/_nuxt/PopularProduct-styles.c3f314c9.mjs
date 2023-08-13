import { b as buildAssetsURL } from '../../handlers/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'h3';
import 'devalue';
import 'vue/server-renderer';
import '../../nitro/node-server.mjs';
import 'node-fetch-native/polyfill';
import 'node:http';
import 'node:https';
import 'destr';
import 'ofetch';
import 'unenv/runtime/fetch/index';
import 'hookable';
import 'scule';
import 'klona';
import 'defu';
import 'ohash';
import 'ufo';
import 'unstorage';
import 'radix3';
import 'node:fs';
import 'node:url';
import 'pathe';
import 'ipx';

const main_css_vue_type_style_index_0_src_0708b8a4_scoped_0708b8a4_lang = '.wrapper[data-v-0708b8a4]{background-size:100% 100%;position:relative;width:100%}.sot[data-v-0708b8a4]{background-color:#f1c360;padding-top:3%;width:100%}.main[data-v-0708b8a4]{display:flex;padding-top:50px}.main[data-v-0708b8a4],.main-nak[data-v-0708b8a4]{transition:2s ease;width:100%}.main-nak[data-v-0708b8a4]{background-color:rgba(252,201,39,.5);-webkit-clip-path:polygon(0 0,100% 0,0 0,0 0);clip-path:polygon(0 0,100% 0,0 0,0 0);height:100%}.actives[data-v-0708b8a4]{-webkit-clip-path:polygon(0 0,100% 0,100% 100%,0 100%);clip-path:polygon(0 0,100% 0,100% 100%,0 100%)}.tint[data-v-0708b8a4]{background-blend-mode:multiply;background-color:rgba(0,0,0,.5)}.main_center[data-v-0708b8a4]{display:flex;justify-content:space-between;padding:3% 2%;width:100%}.main_text_div[data-v-0708b8a4]{width:60%}.main_img_div[data-v-0708b8a4]{position:relative;width:50%}.phel[data-v-0708b8a4]{height:10%;left:30%;position:absolute;top:25%;width:10%;z-index:6}.main_img[data-v-0708b8a4]{animation:wiggle-0708b8a4 2s infinite;aspect-ratio:1/1;float:right}.main_img[data-v-0708b8a4]:hover{animation:none}.main_text[data-v-0708b8a4]{font-family:VAG;font-size:86px;font-weight:400;line-height:1.2}@keyframes wiggle-0708b8a4{0%{transform:rotate(0deg)}80%{transform:rotate(0deg)}85%{transform:rotate(3deg)}95%{transform:rotate(-3deg)}to{transform:rotate(0deg)}}.main_bt[data-v-0708b8a4]{background:#7a941c;border:2px solid #ff0;border-radius:50px;cursor:pointer;height:100%;margin:5% auto auto;padding:10px 20px;transition:1s;width:70%}.bt[data-v-0708b8a4]{width:100%}.main_bt_p[data-v-0708b8a4]{font-family:VAG;font-size:32px}.main_bt[data-v-0708b8a4]:hover{background-color:transparent;box-shadow:inset 600px 0 0 0 #5bb637;transition:1s}.tovar[data-v-0708b8a4]{height:80vh}.p-block[data-v-0708b8a4]{font-family:VAG;line-height:1.2}.info[data-v-0708b8a4]{background-image:url("../../images/pngwing.com/%20/(1).png");background-repeat:no-repeat;background-size:contain;padding:5% 0;position:relative;width:100%;z-index:2}.main-text[data-v-0708b8a4]{font-family:VAG;line-height:1.2}.text_in_sot[data-v-0708b8a4]{text-align:center}.block_info[data-v-0708b8a4]{background-color:#a0a63e;border-radius:20px;display:flex;justify-content:space-between;margin-bottom:3%;margin-top:3%;min-width:0;padding:5%;width:100%}.dostav_info[data-v-0708b8a4]{width:40%}.kart[data-v-0708b8a4]{width:50%}.tovar[data-v-0708b8a4]{height:100%;width:100%}.swiper-container[data-v-0708b8a4]{overflow:hidden}.sliders[data-v-0708b8a4]{position:relative;width:100%}.slide[data-v-0708b8a4]{height:100%;width:80%}.ref-block[data-v-0708b8a4]{background:url(' + buildAssetsURL("3.de54ba29.jpg") + ") no-repeat 50%;background-attachment:fixed;background-size:cover;height:700px;margin-top:3%}.o_product[data-v-0708b8a4]{display:grid;grid-template-columns:.3fr 1fr;height:80%}.predp[data-v-0708b8a4]{text-align:center}.predp-img[data-v-0708b8a4]{aspect-ratio:1/1;width:80%}.predp-name[data-v-0708b8a4]{font-family:VAG}@media (max-width:1200px){.main_center[data-v-0708b8a4]{display:block;margin-top:90px;padding-top:0;text-align:center}.main_img_div[data-v-0708b8a4]{height:400px;margin:auto;width:80%}}@media (max-width:1000px){.main_text[data-v-0708b8a4]{font-size:64px}.block_info[data-v-0708b8a4]{display:block}.dostav_info[data-v-0708b8a4]{text-align:center;width:100%}.kart[data-v-0708b8a4]{height:500px;margin:auto;width:100%}.main-text[data-v-0708b8a4],.p-block[data-v-0708b8a4]{font-size:64px}.ref-block[data-v-0708b8a4]{height:auto;padding:4% 0}.o_product[data-v-0708b8a4]{height:auto;margin:auto}.predp-img[data-v-0708b8a4]{width:40%}}@media (max-width:780px){.main_bt[data-v-0708b8a4]{width:80%}.info_kart_div[data-v-0708b8a4]{display:block}.main_bt_p[data-v-0708b8a4]{margin:auto}.main_text_div[data-v-0708b8a4]{width:auto}.main_img_div[data-v-0708b8a4]{height:480px;width:auto}.dostav_info .small-big[data-v-0708b8a4]{font-size:24px}}@media (max-width:600px){.main_text[data-v-0708b8a4]{font-size:52px}.slider-main .swiper-wrapper .swiper-slide[data-v-0708b8a4]{height:auto}}@media (min-width:1201px){.main_center[data-v-0708b8a4]{padding-top:120px}}";

const hexTovar_css_vue_type_style_index_1_src_0708b8a4_scoped_0708b8a4_lang = ".card-img[data-v-0708b8a4]{filter:drop-shadow(1px 1px 3px green);max-width:100%}.product[data-v-0708b8a4]{background-color:#fff;border-radius:5px;display:flex;height:100%;margin:auto;padding:2.5em 0;width:100%}.product__photo[data-v-0708b8a4]{position:relative;width:50%}.photo-container[data-v-0708b8a4]{border-radius:6px;box-shadow:4px 4px 25px -2px rgba(0,0,0,.3);height:100%;left:-2.5em;position:absolute;width:100%}.photo-main[data-v-0708b8a4]{background-color:#9be010;background:radial-gradient(#e5f89e,#96e001);border-radius:6px 6px 0 0;height:80%}.photo-album[data-v-0708b8a4]{background-color:#fff;border-radius:0 0 6px 6px;height:85px;padding:.7em 1em}.product__info[data-v-0708b8a4]{padding:.8em 0;width:50%}.product__price[data-v-0708b8a4]{color:#f57328;font-family:Roboto}.product__code[data-v-0708b8a4]{font-family:Roboto;line-height:1.2}.description[data-v-0708b8a4]{clear:left;margin:2em 0}.product__name[data-v-0708b8a4]{font-family:VAG;font-weight:400;line-height:1.2}.btn[data-v-0708b8a4]{border:none;border-radius:50px;box-shadow:2px 2px 25px -7px #000;cursor:pointer;display:inline-block;font-size:.8em;font-weight:700;padding:1.5em 3.1em}.btn[data-v-0708b8a4],.btn[data-v-0708b8a4]:active{background-color:#f5ad28;color:#000}.btn[data-v-0708b8a4]:active{scale:.96}.btn[data-v-0708b8a4]:hover{background-color:#ffbc41}.variant-ul[data-v-0708b8a4]{display:flex;list-style:none;padding:0;width:100%}.photo-album-li[data-v-0708b8a4]:not(:first-child){margin-left:1%}.photo-album-li.active[data-v-0708b8a4]{box-shadow:0 0 2px 1px #000}.photo-album-li[data-v-0708b8a4]{border-radius:3px;cursor:pointer;float:left;padding:3px;text-align:center;width:90px}.photo-album-li[data-v-0708b8a4]:hover{box-shadow:0 0 2px 1px #000}.product__text[data-v-0708b8a4]{margin-top:8px}.add-img-tovar[data-v-0708b8a4]{aspect-ratio:1/1;cursor:pointer;margin-left:2%}.add-img-tovar[data-v-0708b8a4]:hover{box-shadow:0 0 2px 1px #000}@media (max-width:1100px){.photo-main[data-v-0708b8a4]{height:400px}.product[data-v-0708b8a4]{display:block;padding-top:2%}.product__photo[data-v-0708b8a4]{height:400px;width:100%}.slider-product .swiper-wrapper .swiper-slide[data-v-0708b8a4]{height:1000px}.photo-container[data-v-0708b8a4]{left:-5%;width:110%}.product__info[data-v-0708b8a4]{text-align:center;width:100%}}@media (max-width:700px){.photo-container[data-v-0708b8a4]{display:block;position:static;width:100%}.product__photo[data-v-0708b8a4]{height:auto}.photo-main[data-v-0708b8a4]{height:220px}.slider-product .swiper-wrapper .swiper-slide[data-v-0708b8a4]{height:700px}}";

const PopularProduct_vue_vue_type_style_index_2_lang = ".photo-main img{height:100%;width:100%}.product__name{overflow:hidden;text-overflow:ellipsis;transition:.5s;white-space:nowrap}.product__name:hover{overflow:auto;transition:.5s;white-space:normal}";

const PopularProductStyles_c3f314c9 = [main_css_vue_type_style_index_0_src_0708b8a4_scoped_0708b8a4_lang, hexTovar_css_vue_type_style_index_1_src_0708b8a4_scoped_0708b8a4_lang, PopularProduct_vue_vue_type_style_index_2_lang];

export { PopularProductStyles_c3f314c9 as default };
//# sourceMappingURL=PopularProduct-styles.c3f314c9.mjs.map
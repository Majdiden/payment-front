import Vue from "vue";
import "./plugins/axios";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import VCurrencyField from "v-currency-field";
import { VTextField } from "vuetify/lib";

Vue.config.productionTip = false;

Vue.component("v-text-field", VTextField);
Vue.use(VCurrencyField, {
  locale: "en",

  decimalLength: 1,

  autoDecimalMode: true,

  min: 0,

  max: null,

  defaultValue: 0,

  valueAsInteger: false,

  allowNegative: false,
});

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");

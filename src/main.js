import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import data from "./store/data";
import "./registerServiceWorker";

Vue.config.productionTip = false;

data.token = localStorage.getItem("github-token");

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");

import Vue from 'vue';
import App from './App.vue';


import './assets/style.scss'
import '@mdi/font/css/materialdesignicons.css'

Vue.config.productionTip = false;

const vue = new Vue({
  render: h => h(App),
}).$mount('#app');


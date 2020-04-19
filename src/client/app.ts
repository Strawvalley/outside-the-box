import Vue from 'vue';
import App from './app.vue';
import i18n from './plugins/i18n';

new Vue({
  el: '#game',
  i18n,
  render: h => h(App),
})

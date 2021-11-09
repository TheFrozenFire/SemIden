import Vue from 'vue'
import App from './App.vue'
import AsyncComputed from 'vue-async-computed'
import vuetify from '@/plugins/vuetify'

Vue.config.productionTip = false

new Vue({
  vuetify,
  AsyncComputed,
  render: h => h(App)
}).$mount('#app')

import Vue from 'vue'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en'

import App from './App.vue'
import router from './router'
import store from './store'
import element from './utils/element'


Vue.use(element, { locale })

Vue.config.productionTip = false


new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')

import Vue from 'vue'
import App from './App'
import commonFn from './utils/common'
// 引入 uview-ui
import uView from "uview-ui";
Vue.use(uView)
// 全局变量
import store from './store/index'

Vue.config.productionTip = false
Vue.prototype.$store = store
Vue.prototype.commonFn = commonFn 

App.mpType = 'app'

const app = new Vue({
    ...App,
	store
})
app.$mount()


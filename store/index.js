import Vue from 'vue';
import Vuex from 'vuex';
import tabBer from '@/store/modules/tabBer.js'
import getters from '@/store/getters.js'
//蓝牙设置
// import Bluetooth from '@/store/bluetooth/index.js'

Vue.use(Vuex);

const store = new Vuex.Store({
	modules:{
		tabBer,
		
		// Bluetooth
	},
	state: {
		hasNet:true, // 当前网络状态 true 有网络  false 无网络
		sysinfo: uni.getSystemInfoSync(),//系统信息
	},
	mutations: {
		// 实时网络状态
		changeNetStatus(state,status){
			state.hasNet = status;
		}
	},
	getters
})
export default store;


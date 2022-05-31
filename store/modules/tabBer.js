import tabBar from '@/utils/tabBar.js'  //引入tabbar文件。

let chipType = uni.getStorageSync('chipType')//读取本地角色

/* Vuex数据页面刷新丢失问题解决方案 https://www.cnblogs.com/heioray/p/10284268.html */

// 1、对传入的state初始值判断类型，并尝试从sessionStorage中读取数据替换默认值
// 2、通过Proxy重置state的set逻辑，添加同步保存到sessionStorage的逻辑
const storeMaker = (state) => {
    // 初始化
    Object.keys(state).map((key) => {
		// uni.getStorageSync(key); uniApp  sessionStorage.getItem(key) //h5写法
		let getStorageValue = uni.getStorageSync(key);
		// console.log(getStorageValue)
        // 判断类型获取本地存储数据
        if (typeof state[key] === 'object') {
            if (getStorageValue && JSON.parse(getStorageValue)) {
                state[key] = JSON.parse(getStorageValue)
            }
        } else if (typeof state[key] === 'number') {
            if (getStorageValue && parseInt(getStorageValue)) {
                state[key] = parseInt(getStorageValue)
            }
        } else {
            if (getStorageValue) {
                state[key] = getStorageValue
            }
        }
    })

    // 重写set处理
    return new Proxy(state, {
        set: function(target, key, value) {
            let temp = value
            if (typeof temp === 'object') {
                temp = JSON.stringify(temp)
            }
			uni.setStorageSync(key, temp);
            // sessionStorage.setItem(key, temp)
            return Reflect.set(target, key, value)
        }
    })
}

// 判断用户tabBer类别
// 0 所有 BOTH
// 1 传统 TRADITIONAL
// 2 共享 PUBLIC

const tabBer = {
	state:storeMaker({
        	chipType: '',
        	tabBarList: [],
    }),
	mutations: {
		setRole(state,chipType){
			state.chipType = chipType;
			//先得到权限，再根据权限设置tabbarList
			// console.log(chipType)
			let type= "";
			if(chipType == "BOTH"){
				type = "BOTH";
			}else if(chipType == "TRADITIONAL"){
				type = "TRADITIONAL";
			}else{
				type = "PUBLIC";
			}
			// console.log(chipType)
			state.tabBarList = tabBar[type];
		}
	},
}

export default tabBer
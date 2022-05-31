import config from "@/utils/config.js"
// 全局请求封装
var token = "";

export default (url, method, params) => {
	// uni.showLoading({
	// 	title: "加载中"
	// });
	if(uni.getStorageSync('token')){
		token = uni.getStorageSync('token');
		// console.log(token);
	}else{
		console.log("没有token")
	}
// http://192.168.3.254:20000 本地 http://test.jw.com:10000 http://rfid.hxh8888.com:10000/ 线上 
	return new Promise((resolve, reject) => {
		uni.request({
			url: config.base_url + url,
			method: method,
			header: {
				'k': token,
				'u':'CUSTOMER_USERS',
				'a':'Y'
			},
			timeout:30000,
			data: {
				...params
			},
			success(res) {
				// switch (res.data.code) {
				// 	case "1000":{
						
				// 	},
					
				// }
				if(res.data.code === "1000"){
					uni.showToast({
						icon:'none',
						title:"您没有登录"
					})
					// 跳转登录页
					var jump = uni.getStorageSync('jump');
					console.log(jump)
					if(!jump){
						console.log("跳转登录页")
						// 跳转登录页
						setTimeout(function(){
							uni.redirectTo({
								url: '/pages/login/login'
							});
						},2000)
						uni.setStorageSync("jump",'true')
					}
					
				}else if(res.data.code === "1001"){
					uni.showToast({
						icon:'none',
						title:"用户名或密码错误"
					})
				}else if(res.data.code === "7777"){
					uni.showToast({
						icon:'none',
						title:"系统维护中"
					})
				}else if(res.data.code === "8888"){
					uni.showToast({
						icon:'none',
						title:res.data.msg
					})
				}else if(res.data.code === "9999"){
					uni.showToast({
						icon:'none',
						title:"服务器繁忙"
					})
				}else if(res.data.code === "1101"){
					uni.showToast({
						icon:'none',
						title:res.data.msg
					})
				}else if(res.data.code === "1002"){
					uni.showToast({
						icon:'none',
						title:res.data.msg
					})
				}else if(res.data.code === "0"){
					// uni.showToast({
					// 	title:'获取数据成功'
					// })
				}else{
					uni.showToast({
						icon:'none',
						title:res.data.msg || "请求失败，请重试"
					})
				}
				resolve(res.data);
			},
			fail(err) {
				uni.showToast({
					icon:'none',
					title:"请求出错，请重试"
				})
				reject(err);
			},
			complete() {
				// uni.hideLoading();
			}
		});
	});
};
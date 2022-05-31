import request from "./request.js"

const token = uni.getStorageSync('token');
export default {

	// 登录
	getLogin(url,params) {
		return request(url, "POST", params)
	},
	// 获取验证码
	getAuthCode(params) {
		return request("/app/sms/smsCode", "POST", params)
	},
	// 获取所有代理商 下拉框
	// getAgentList(params) {
	// 	return request("/app/agent/getAgentList", "POST", params)
	// },
	// 判断是否注册过
	 isRegister(params){
		 return request("/app/security/identUserIsNew", "POST", params)
	 },
	// 设置 个人信息
	setUserInfo(params) {
		return request("/app/security/setUserInfo", "POST", params)
	},
	// 校验验证码
	verifyCode(params){
		return request("/app/sms/verifySmsCode", "POST", params)
	},
	// 修改密码
	editPassword(params) {
		return request("/app/security/updatePwd", "POST", params)
	},
	//获取最新的版本号与更新说明
	 getVersion(params){
		 return request("/app/version/newest", "POST", params)
	 },
	 // 获取共享布草
	 getPublicCloth(params){
	 		 return request("/app/customer/getPublicLinens", "POST", params)
	 },
	 // 获取常用的布草品类
	 getUsedCloth(params){
		  return request("/app/category/commonUseCategories", "POST", params)
	 },
	//传统订单列表
	customerOrderList(params) {
		return request("/app/order/orderPage", "POST", params)
	},
	
	//订单详情
	orderDetail(params,url) {
		return request(url, "POST", params)
	},
	// /app/order/orderDetail 传统 
	
	// 干净布草下单
	addOrder(params){
		return request("/app/order/addClean", "POST", params)
	},
	//共享订单列表
	publicOrderList(params) {
		return request("/app/order/page", "POST", params)
	},
	// 取消订单 
	cancelOrder(params){
		return request("/app/order/cleanCancel", "POST", params)
	},
	// 共享订单详情接口
	// shareDetail(params) {
	// 	return request("/app/order/info", "POST", params)
	// },
	
	//脏布草回收列表
	dirtyList(params) {
		return request("/app/order/dirty/page", "POST", params)
	},
	// 脏布草详情接口
	dirtyDetail(params) {
		return request("/app/order/dirty/info", "POST", params)
	},
	
	// 个人中心
	getUserInfo(params) {
		return request("/app/user/info", "POST", params)
	},
	// 共享库存统计
	getPublicStorage(params) {
		return request("/app/storage/info", "POST", params)
	},
	// 账户明细 充值记录
	getRechargeRecord(params) {
		return request("/app/wallet/rechargeRecord", "POST", params)
	},
	// 账户明细 消费记录
	getConsumptionRecord(params) {
		return request("/app/wallet/consumeRecord", "POST", params)
	},
	// 账户中心 个人信息
	getWalletInfo(params) {
		return request("/app/wallet/userInfo", "POST", params)
	},
	
	// 首页 近一年洗涤情况统计
	getLineData(params) {
		return request("/app/index/cYearCount", "POST", params)
	},
	//首页 近半年传统洗涤数量统计
	getBarData(params) {
		return request("/app/index/cHalfYearCount", "POST", params)
	},
	// 首页 共享
	getPublicData(params) {
		return request("/app/index/publicHalfYearCount", "POST", params)
	},
	// 首页 洗涤数据
	getWashCount(params) {
		return request("/app/index/washCount", "POST", params)
	},
	
	// //
	// (params) {
	// 	return request("", "POST", params)
	// },
	// //
	// (params) {
	// 	return request("", "POST", params)
	// },
	// //
	// (params) {
	// 	return request("", "POST", params)
	// },
	// //
	// (params) {
	// 	return request("", "POST", params)
	// },
	// //
	// (params) {
	// 	return request("", "POST", params)
	// },
	// //
	// (params) {
	// 	return request("", "POST", params)
	// },
	// //
	// (params) {
	// 	return request("", "POST", params)
	// },
	// //
	// (params) {
	// 	return request("", "POST", params)
	// },
	// //
	// (params) {
	// 	return request("", "POST", params)
	// },
	// //
	// (params) {
	// 	return request("", "POST", params)
	// },
	// //
	// (params) {
	// 	return request("", "POST", params)
	// },
	
}

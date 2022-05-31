<template>
	
    <view class="content">
	  <view class="logo-box">
	   	<view class="yz-logo">
	   		<image class="yz-icon-img" src="@/static/img/logo2.png" mode="widthFix"/>
	   	</view>
		<view class="yz-title">
			<text>壹智sass云洗涤系统</text>
		</view>	
	  </view> 
	  <uni-segmented-control  :current="current" :values="['免密登录','密码登录']" @clickItem="onClickItem" style-type="text" active-color="#007aff"></uni-segmented-control>
	  <view v-if="current === 0">
		  <uni-forms :value="formData" ref="form" class="login-form" :rules="rules" required="true">
			  <!-- @blur="getRegister" -->
		  	   <uni-forms-item label="手机号" name="phone" required>
		  			<uni-easyinput type="text" v-model="formData.phone" placeholder="请输入手机号" />
		  		</uni-forms-item>
				<view class="code-box">
					<uni-forms-item label="验证码" name="smsCode" required>
							<uni-easyinput type="number" v-model="formData.smsCode" placeholder="请输入验证码" @blur="" /><!--checkCode-->
					</uni-forms-item>
					<button type="primary" size="mini"  :disabled="showTime" @click="countDown">{{!codeTime ?'获取验证码' : codeTime+'s后重新获取'}}</button>
				</view>
				<!-- <uni-forms-item required label="服务商" name="aid" v-show="isShow">
					<picker class="border-box" mode="selector" :range="agentList" :range-key="'name'" @change="changeAgent" :value="agentIndex">
						<view>{{agentList[agentIndex].name}}</view>
					</picker>
				</uni-forms-item> -->
		  	   <view class="login-btn-box">
					<view class="login-btn" @click="submitForm">登录</view>
		  	   </view> 
		  </uni-forms>
	  </view>
	  <view v-if="current === 1">
		  <uni-forms :value="formData" ref="form" class="login-form" :rules="rules" required="true">
		  	   <uni-forms-item label="手机号" name="phone" required>
		  			<uni-easyinput type="text" v-model="formData.phone" placeholder="请输入手机号" />
		  		</uni-forms-item>
		  		<uni-forms-item label="密码" name="psd" required>
		  			<uni-easyinput type="password" v-model="formData.psd" placeholder="请输入密码" @input=""></uni-easyinput>
		  		 </uni-forms-item>
		  	   <view class="login-btn-box">
		  		<view class="login-btn" @click="submitForm">登录</view>
		  	   </view>
		  </uni-forms>
	  </view>   
    </view>
	
</template>

<script>
	import {mapState,mapMutations} from 'vuex';
	import api from "@/utils/api.js"
export default {
    data() {
        return {
			current: 0,
			codeTime:0,
			showTime:false,
			agentIndex:0,//服务商默认下标
			agentList:[{name:"请选择服务商",aid:''}],
			isShow:false,
            formData:{
                phone:'',
                psd:'',
				smsCode:'',
				// aid:""
            },
			rules: {
			               phone: {
			                    rules: [{
			                            required: true,
			                            errorMessage: '手机号不能为空',
			                        },
									{
										pattern:/^[1][3,4,5,6,7,8,9][0-9]{9}$/,
										errorMessage: '手机号有误',
									}
			                       
			                    ]
			                },
			                psd: {
			                    rules: [{
			                        required: true,
			                        errorMessage: '密码不能为空',
			                    },
								{
								    minLength: 6,
								    errorMessage: '密码长度不小于{minLength}位数',
								}
								]
			                },
							smsCode: {
							    rules: [{
							        required: true,
							        errorMessage: '验证码不能为空',
							    },
								// {
								//     maxLength: 6,
								//     errorMessage: '密码长度应为{maxLength}位数',
								// }
								]
							},
							aid:{
								rules: [{
								    required: true,
								    errorMessage: '请选择服务商',
								}]
							}
			            }
            
        }
    },
	created() {
		
	},
	onLoad() {
		console.log("登录页onLoad")
		uni.removeStorage({
			key:"jump"
		})
		// this.getAgentList()
	},
    methods: {
		// getAgentList(){
		// 	console.log(this.agentList)
		// 	api.getAgentList().then((res)=> {
		// 					 // console.log(res)
		// 					 if(res.success){
		// 				 			if(res.data.length>0){
		// 				 				res.data.forEach((element, index, array)=> {
		// 				 						this.agentList.push({aid:element.id,
		// 				 								name:element.nickName
		// 				 							})
		// 				 				 })
		// 				 			} 						
		// 					 }								 
		// 	})
		// },
		// 
		// getRegister(){
		// 	console.log(this.formData.phone)
		// 	let data = {
		// 		phone:this.formData.phone
		// 	}
		// 	api.isRegister(data).then((res)=> {
		// 					 // console.log(res)
		// 					 if(res.success){
		// 						 this.isShow = true;						
		// 					 }								 
		// 	})
			
		// },
		// 选择服务商
		// changeAgent(e){
		// 				 this.agentIndex = e.detail.value;
		// 				 this.formData.aid = this.agentList[this.agentIndex].aid
		// },
		onClickItem(e){
			if (this.current !== e.currentIndex) {
			    this.current = e.currentIndex;
			}
		},
		 // 获取验证码 倒计时
		countDown(){
			if(this.formData.phone){
				let data = {
					type: 'CODE_TEMPLATE',
					phone: this.formData.phone
				}
				api.getAuthCode(data).then( res => {
					console.log(res)
				}).catch( err => {
					console.log(err)
				})

				this.showTime = true // 禁用按钮
				if(this.codeTime>0){
					  uni.showToast({
						  title: '不能重复获取',
						  icon:"none"
					  });
				 }else{
					  this.codeTime = 59
					  let timer = setInterval(()=>{
						this.codeTime--;
						 if(this.codeTime<1){
							clearInterval(timer);
							this.codeTime = 0
							this.showTime = false
						  }
					  },1000)
				 } 
			}else{
				console.log("请先输入手机号");
				uni.showToast({
					title: '请先输入手机号',
					icon:"none",
					duration: 2000
				});
			}
			  
		},    
		// 校验验证码
		// checkCode(e){
		// 	console.log(e.detail.value)
			
		// 	this.formData.smsCode = e.detail.value
		// 	if(this.formData.smsCode.length == 6){
		// 		let data = {
		// 			type:'CODE_TEMPLATE',
		// 			smsCode:this.formData.smsCode
		// 		}
		// 		uni.request({
		// 	    url: this.baseUrl + 'app/sms/verifySmsCode', 
		// 	    data: data,
		// 		method:'POST',
		// 	    success: (res) => {
		// 	        console.log(res.data);
		// 	        if(res.data.success){
		// 				console.log(res.data)
		// 			}else{
		// 				uni.showToast({
		// 					icon:'none',
		// 					title:res.data.msg
		// 				})
		// 			}
		// 	    },
		// 		fail(res) {
		// 			console.log(res)
		// 			uni.showToast({
		// 				title: '网络不佳，请重试',
		// 				icon:"none",
		// 				duration: 2000
		// 			});
		// 		}
		// 	});
		// 	}else{
		// 			uni.showToast({
		// 			    title: '验证码有误',
		// 				icon:'none',
		// 			    duration: 2000
		// 			});
		// 	}
			
			
		// },
		// 登录
        submitForm(form) {
            // 手动提交表单
            this.$refs.form.validate().then((res)=>{
                console.log('表单返回得值：', res); 
				console.log("跳转")
				let apiUrl ='';
				let data ='';
				if(this.current === 0 ){
					 apiUrl = '/app/security/loginByPhone'
					 data = res
					
				}else{
					 apiUrl = '/app/security/loginByPassword'
					data ={
						loginName:this.formData.phone,
						password :this.formData.psd
					}
				}
				// console.log(this.baseUrl + apiUrl)
				api.getLogin(apiUrl,data).then( res => {
					console.log(res)
							if(res.success){
								console.log(res.data)
								// 存储token
								uni.setStorage({
									  key: 'token',
									  data: res.data.token,
								});
								uni.setStorage({
									key: 'userInfo',
									data:JSON.stringify(res.data.userInfo),
								})
								uni.setStorage({
									key: 'roleType',
									data: res.data.roleType,
								});
						uni.setStorageSync('chipType', res.data.chipType);//存芯片类型
						this.$store.commit('setRole',res.data.chipType);//设置tabbar
								// 没有设置密码，跳转到 个人信息设置  有则跳转首页
								if(res.data.userInfo.isSetPassword){
									uni.showToast({
										title: '登录成功!',
										duration: 2000
									});
									setTimeout(function(){
										uni.switchTab({
											url: '/pages/tabbar/tabbar-1/tabbar-1'
										});
									},1000)
								}else{
									uni.showToast({
										title: '注册成功!', 
										duration: 2000
									});
									setTimeout(function(){
										uni.navigateTo({
											url: '/pages/edit-psd/set-psd'
										});
									},1000)
								}
								
							}else{
								uni.showToast({
									icon:'none',
									title:res.msg
								})
							}
				}).catch( err => {
					console.log(err)
				})
				
            }).catch(err =>{
                console.log('表单错误信息：', err);
            })
        }
    }
}
</script>

<style scoped lang="scss">
	/* page{
		height: 100%;
		background: url('~@/static/img/bg.jpg') no-repeat center;
		background-size: 100% 100%;
		
	} */
.content {
	/* border: 1px solid red; */
	width: 100%;
}
.logo-box{
	// margin-top: 100rpx;
	margin: 100rpx 0 40rpx 0;
}
.yz-logo{
	width: 100%;
	text-align: center;
}
.yz-icon-img{
	width: 200rpx;
}
.yz-title{
	text-align: center;
	font-size: 36rpx;
	font-weight: bold;
	// color:$uni-color-primary ;
}
.login-form{
	width: 90%;
	margin: 40rpx auto;
	
}
.uni-forms-item{
	color: #ffffff;
}
.gray {		color: #C0C0C0;	}

.code-box{
	display: flex;
	// justify-content: space-between;
	// align-items: flex-start;
}
.code-box button{
	height: 29px;
	margin: 3px 0 0 10px;
	width: 135px;
}
.login-btn-box {		position: absolute;		// bottom: 50px;
		bottom: calc(var(--window-bottom) + 50px);		left: 10%;		width: 80%;	}.login-btn {		height: 82rpx;		// border-radius: 41rpx;
		border-radius: 20rpx;		background-color: #007aff;		box-shadow: -1px 12px 11px 0px rgba(0,122,255, 0.4);		text-align: center;		line-height: 82rpx;		font-size: 36rpx;		font-weight: 500;		color: #fff;	}
	/deep/ .uni-forms-item__content{
		line-height: 36px;
	}
	.forms-box{
		width: 90%;
		margin: 40rpx auto;
		
	}
	.border-box{
		padding-left: 10px;
		border:1px solid rgb(229, 229, 229);
		color:#000000;
	}
/* /deep/ .uni-forms-item__label .label-text{
	color: #ffffff;
}
/deep/ .login-btn[type=default]{
	background-color: rgab(255,255,255,.5);
} */

</style>

<template>
    <view class="content">
		  <uni-forms ref="form" :modelValue="formData" class="login-form" :rules="rules" required="true">
				<uni-forms-item label="手机号" name="phone" required>
					<uni-easyinput type="text" v-model="formData.phone" placeholder="请输入手机号" disabled/>
				</uni-forms-item>
				<view class="code-box">
					<uni-forms-item label="验证码" name="smsCode" required>
						<uni-easyinput type="number" v-model="formData.smsCode" placeholder="请输入验证码" @blur="checkCode" /><!--checkCode-->
					</uni-forms-item>
					<button type="primary" size="mini"  :disabled="showTime" @click="countDown">{{!codeTime ?'获取验证码' : codeTime+'s后重新获取'}}</button>
				</view>
				<view v-show="isShow">
					<uni-forms-item label="设置密码" name="psd" required>
						<uni-easyinput type="password" v-model="formData.psd" placeholder="请输入密码" @input=""></uni-easyinput>
					</uni-forms-item>
					 <uni-forms-item label="确认密码" name="repeatPsd" required>
						<uni-easyinput type="password" v-model="formData.repeatPsd" placeholder="请输入密码" @input="binddata('repeatPsd',$event.value)"></uni-easyinput>
					  </uni-forms-item>
				</view>
		  	   <view class="login-btn-box">
		  		<view class="login-btn" @click="submitForm">提交</view>
		  	   </view>
		  </uni-forms>
    </view>
	
</template>

<script>
	// import { mapGetters } from 'vuex'
	import api from "@/utils/api.js"
	
export default {
    data() {
        return {
			codeTime:0,
			showTime:false,
			isShow:false,
            formData:{
				phone:'',
                smsCode:'',
                psd:'',
				repeatPsd:'',
				// code:''
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
							     ],
								 validateTrigger:'submit'
							 },
							 smsCode: {
							     rules: [{
							         required: true,
							         errorMessage: '验证码不能为空',
							     },
							 	],
								validateTrigger:'submit'
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
								],
								validateTrigger:'submit'
			                },
							repeatPsd: {
							    rules: [{
							        required: true,
							        errorMessage: '密码不能为空',
							    },
								{
								    minLength: 6,
								    errorMessage: '密码长度不小于{minLength}位数',
								},
								{
								    validateFunction:function(rule,value,data,callback){
										console.log(data.psd) 
										console.log(value)
										if(data.psd.length >5 && value === data.psd){
											return true
										}else{
											callback('两次密码不一致，请检查')
								     }
									}
								}
								],
								validateTrigger:'submit'
							},
						
			            }
            
        }
    },
	 onReady() {
	        // 需要在onReady中设置规则
	        this.$refs.form.setRules(this.rules)
	    },
	onLoad() {
		let userInfo = uni.getStorageSync("userInfo");
		this.formData.phone = JSON.parse(userInfo).phone;
		// console.log(this.formData.phone) 	
	},
    methods: {
		// 获取验证码 倒计时
		countDown(){
			if(this.formData.phone){
				let data = {
					type: 'CODE_TEMPLATE',
					phone: this.formData.phone
				}
				// 向后台获取验证码
				api.getAuthCode(data).then( res => {
					console.log(res)
					if(res.success){
						uni.showToast({
							icon:"success",
							title:"验证码已发送，请注意查收！"
						})
					}else{
						uni.showToast({
							icon:"none",
							title:res.msg
						})
					}
					
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
		// 检查验证码是否正确
		checkCode(e){
			console.log(e.detail.value);
			let data ={
				type:"CODE_TEMPLATE",
				smsCode:e.detail.value
			}
			api.verifyCode(data).then(res =>{
				console.log(res)
				if(res.success){
					this.isShow = true;
				}else{
					this.isShow = false;
					uni.showToast({
						icon:"none",
						title:res.msg
					})
				}
			})
			
			
		},
        submitForm(form) {
            // 手动提交表单
            this.$refs.form.validate().then((res)=>{
                console.log('表单返回得值：', res); 
				
				let data = {
					password:this.formData.repeatPsd,
					// phone:this.formData.phone
				}
				
				// 向后台提交
				api.editPassword(data).then((res)=>{
					console.log(res)
					if(res.success){
						uni.showToast({
							title: '密码修改成功!',
							duration: 2000
						});
						//退出，重新登录
						uni.removeStorage({
						    key: 'roleType'
						});
						uni.removeStorage({
						    key: 'userInfo'
						});
						uni.removeStorage({
						    key: 'token',
						    success: function (res) {
						        console.log('success');
								uni.redirectTo({
									url: '/pages/login/login',
									animationType: 'pop-in',
									animationDuration: 200
								});
						    }
						});
					}else{
						uni.showToast({
							icon:"none",
							title: res.msg || "密码修改失败，请重试！",
							duration: 2000
						});
					}
					
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
	margin-top: 3px;
}
.login-btn-box {		position: absolute;		bottom: 50px;		left: 10%;		width: 80%;	}.login-btn {		height: 82rpx;		// border-radius: 41rpx;
		border-radius: 20rpx;		background-color: #007aff;		box-shadow: -1px 12px 11px 0px rgba(0,122,255, 0.4);		text-align: center;		line-height: 82rpx;		font-size: 36rpx;		font-weight: 500;		color: #fff;	}
/* /deep/ .uni-forms-item__label .label-text{
	color: #ffffff;
}
/deep/ .login-btn[type=default]{
	background-color: rgab(255,255,255,.5);
} */

</style>

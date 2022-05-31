<template>
    <view class="content">
		  <uni-forms ref="form" :value="formData" class="login-form"  required="true">
		  	  <uni-forms-item label="用户名" name="userName" required>
		  			<uni-easyinput type="text" v-model="formData.userName" placeholder="请输入用户名" />
		  		</uni-forms-item>
		  		<uni-forms-item label="设置密码" name="psd" >
		  			<uni-easyinput type="password" v-model="formData.psd" placeholder="请输入密码" @input=""></uni-easyinput>
		  		 </uni-forms-item>
				 <uni-forms-item label="确认密码" name="repeatPsd" >
				 	<uni-easyinput type="password" v-model="formData.repeatPsd" placeholder="请输入密码" ></uni-easyinput>
				  </uni-forms-item>
		  	   <view class="login-btn-box">
		  		<view class="login-btn" @click="submitForm">提交</view>
		  	   </view>
		  </uni-forms>
    </view>
	
</template>

<script>
	import api from "@/utils/api.js"
export default {
    data() {
        return {
		
            formData:{
                userName:'',
                psd:'',
				repeatPsd:'',
				// code:''
            },
			rules: {
			               userName: {
			                    rules: [{
			                            required: true,
			                            errorMessage: '用户名不能为空',
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
								    validateFunction:(rule,value,data,callback)=>{
										console.log(data.psd) 
										console.log(value)
										if(data.psd.length >5 && value === data.psd){
											return true
										}else{
											callback('两次密码不一致，请检查')
								     }
									}
								}
								]
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
			this.formData.userName = JSON.parse(userInfo).nickName;
			// console.log(this.formData.phone) 	
		},
    methods: {
        submitForm(form) {
            // 手动提交表单
            this.$refs.form.validate().then((res)=>{
                console.log('表单返回得值：', res); 
				let data = {
					password:this.formData.repeatPsd,
					nickName:this.formData.userName
				}
				console.log(data)
				// 向后台提交
				api.setUserInfo(data).then((res)=>{
					console.log(res)
					if(res.success){
						uni.showToast({
							title: '个人信息设置成功!',
							duration: 2000
						});
						setTimeout(function(){
							uni.switchTab({
								url: '/pages/tabbar/tabbar-1/tabbar-1'
							});
						},1000)
					}else{
						uni.showToast({
							icon:"none",
							title: res.msg,
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

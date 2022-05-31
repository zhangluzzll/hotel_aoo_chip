<template>
	<view class="content">
		
		<view class="head-box">
			<view class="account-box">
				<view class="user-box">
					<view>
						<uni-icons type="contact-filled" color="#ffffff" size="30"></uni-icons>
					</view>
					<view>
						<text class="font-lg">{{nickName}}</text>
					</view>
					
				</view>
				<!-- <view class="money-box">
					<view>
						<text class="font-bolder">￥{{msg.balance || 0}}</text>
						<view class="align-box">
							<text class="icon iconfont icon-xinbaniconshangchuan-"></text>
							<text>余额</text>
						</view>
						
					</view>
					<view>
						<text class="font-bolder">￥{{msg.give || 0}}</text>
						<view class="align-box">
							<text class="icon iconfont icon-servicezengyunfeixian"></text>
							<text > 赠送</text>
						</view>
						
					</view>
					<view>
						<text class="font-bolder">- {{msg.debt || 0}}</text>
						<view class="align-box">
							<text class="icon iconfont icon-fuzhaiqingkuang"></text>
							<text>欠款</text>
						</view>
						
					</view>
				</view> -->
			</view>
		</view>
		<view>
			 <uni-list>
				<uni-list-item clickable link to="/pages/account/account" :show-extra-icon="true" :extra-icon="extraIcon1" title="账户明细" ></uni-list-item>
				<uni-list-item v-show="isPublic" clickable link to="/pages/stock/stock" :show-extra-icon="true" :extra-icon="extraStock"  title="共享布草出入统计" ></uni-list-item>
				<uni-list-item v-show="isPublic" clickable link to="/pages/dirty-linen/dirty-linen" :show-extra-icon="true" :extra-icon="extraRecovery"  title="脏布草回收" ></uni-list-item>
				<uni-list-item clickable link to="/pages/edit-psd/edit-psd" :show-extra-icon="true" :extra-icon="extraEdit"  title="修改密码" ></uni-list-item>
				<uni-list-item clickable link to="/pages/contact/contact" :show-extra-icon="true" :extra-icon="extraContact"  title="联系我们" ></uni-list-item>
				<uni-list-item clickable link  :show-extra-icon="true" :extra-icon="extraUpload"  title="版本更新" @click="update"></uni-list-item>
				<uni-list-item clickable link  :show-extra-icon="true" :extra-icon="extraExit" @click="exit" title="退出登录" ></uni-list-item>
			</uni-list>
		</view>
		<u-tabbar  :list="tabBarList" :active-color="activeColor" :inactive-color="inactiveColor"></u-tabbar>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	import api from "@/utils/api.js"
	export default {
		computed: {
					...mapGetters([
						'tabBarList',
						'role'
					])
				},
		data() {
			return {
				msg:{},
				isPublic:false,
				inactiveColor: '#606266',
				activeColor: '#007aff',
				nickName:"", // 账户信息
				extraUpload:{color: '#007AFF',size: '20',type:'cloud-upload'},
				extraContact:{color: '#007AFF',size: '20',type:'phone'},
				extraExit:{color: '#007AFF',size: '20',type:'closeempty'},
				extraStock:{color: '#007AFF',size: '20',type:'shop'},
				extraEdit:{color: '#007AFF',size: '20',type:'compose'},
				extraRecovery:{color: '#007AFF',size: '20',type: 'loop'},
				extraIcon1:{color: '#007AFF',size: '20',type: 'info'},
			}
		},
		onLoad() {
			
			//获取所有数据	
			
			if(uni.getStorageSync('token')){
				this.getInfo()
			}else{
				console.log("没有token")
					uni.redirectTo({
						url: '/pages/login/login'
					});
			}
			
		},
		onNavigationBarButtonTap(e) {
		       
			  if(e.float == "right"){
				  console.log("右边")
				  // 设置个人信息
				  // uni.navigateTo({
				  // 					url: '/pages/edit-psd/edit-psd',
				  // 					animationType: 'pop-in',
				  // 					animationDuration: 200
				  //  });
				  // 退出登录 删掉token
				  uni.showModal({
				      title: '退出登录提醒',
				      content: '您确定要退出登录？',
				      success: function (res) {
				          if (res.confirm) {
				              console.log('用户点击确定');
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
				          } else if (res.cancel) {
				              uni.showToast({
				              	icon:"none",
								title:"您已取消"
				              })
				          }
				      }
				  });
				  
			  }
			   
		   }, 
		
		methods: {
			getInfo(){
				// let userInfo = uni.getStorageSync("userInfo");
				// // console.log(userInfo.)
				// // console.log(JSON.parse(userInfo).nickName)
				// this.nickName = JSON.parse(userInfo).nickName;
				api.getUserInfo().then((res)=>{
					console.log(res)
					if(res.success){
						this.nickName = res.data.nickname
						if(res.data.chipType !== 'TRADITIONAL'){
							this.isPublic = true
						}else{
							this.isPublic = false
						}
						
					}else{
						uni.showToast({
							icon:"none",
							title:res.msg
						})
					}
					
				})
				
			},
			// 版本更新
			update(){
				getApp().software_version_update()
			},
			// 退出登录
			exit(){
				let that = this;
						   // 退出登录 删掉token
						   uni.showModal({
						       title: '退出登录提醒',
						       content: '您确定要退出登录？',
						       success:function (res) {
						           if (res.confirm) {
						               console.log('用户点击确定');
									   uni.removeStorage({
									       key: 'roleType'
									   });
									   uni.removeStorage({
									       key: 'userInfo'
									   });
						   				uni.removeStorage({
						   					key: 'token',
						   					success: function (res) {
												uni.redirectTo({
														url: '/pages/login/login',
														animationType: 'pop-in',
														animationDuration: 200
												 });
						   					}
						   				 });
						           } else if (res.cancel) {
						               uni.showToast({
						               	icon:"none",
						   								title:"您已取消"
						               })
						           }else{
									   
								   }
						       }
						   });
			}
		}	
	}
</script>

<style scoped>
	.content {
		position: relative;
	}
	.head-box{
		    /* position: fixed; */
			background-color: #ffffff;
		    /* z-index:10; */
		    width: 100%;
			
		    
			
	}
	.account-box{
		background-color: #007AFF;
		color: #ffffff;
		width: 90%;
		padding:40rpx 20rpx ;
		margin: 20rpx auto;  
		border-radius: 10px;
		box-shadow: -1px 8px 11px 0px rgba(0,122,255, 0.4);
		position: relative;
	}
	.money-box{
		display: flex;
		justify-content: space-between;
		text-align: center;
	}
	.user-box{
		text-align: center;
		margin-bottom: 20rpx;
	}
	.align-box{
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top:10rpx;
		letter-spacing: 1px;
		font-size:12px ;
	}

	.uni-list{
		margin-top: 20px;
		
				
	}

	
</style>

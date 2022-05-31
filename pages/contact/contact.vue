<template>
	<view>
		<view class="contact-box">
			<view class="box-title font-lg margin_10 font-bolder">服务热线</view>
			<view class="font-base margin_10 font-bolder">技术支持：壹智科技</view>
			<view class="font-base margin_10 font-bolder">+86 13908096096</view>
			<button type="primary" size="mini" @click="call">立即拨打</button>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		onLoad() {

		},
		methods: {
			call(){
				uni.showModal({
				    title: '联系我们',
				    content: '您准备拨号吗？',
				    success: function (res) {
				        if (res.confirm) {
				            console.log('用户点击确定');
							uni.makePhoneCall({
							    phoneNumber: '13908096096' // 林总电话
							});
				        } else if (res.cancel) {
				            uni.showToast({
				                title: '您取消了该操作',
								icon:'none',
								position:"bottom",
				                duration: 2000
				            });
				        }
				    }
				});
				
			}
		}	
	}
</script>

<style scoped>
	page{
		background-color:#F0EFF5;
	}
	.contact-box{
		width: 80%;
		/* height: 255rpx; */
		margin: 300rpx auto 0 auto;
		text-align: center;
		background-color: rgba(255,255,255,.5);
		padding: 30px 0;
		border-radius: 10rpx;
		/* border: 1px solid red; */
		box-shadow:0 0 20px -5px #CCCCCC;
	}
	.box-title{
		color: #A5A2B2;
		letter-spacing: 5rpx;
	}
	.margin_10{
		margin-bottom: 10px;
	}
	.contact-box button{
		width: 50%;
	}
</style>

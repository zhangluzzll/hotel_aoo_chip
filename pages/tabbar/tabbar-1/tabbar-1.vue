<template>
	<view class="content">
		<!-- <view class="char-box-title">
			<view>
				<h3 class="color-title"></h3>
			</view>
			<view>
				<h3><text>{{commonFn.getToady("indexDate")}}</text>
				<br><text class="color-blue">{{currentTime}}</text></h3>
			</view>
		</view> -->
		<view class="char-box-title">
			<view>
				<h3><text>本月洗涤总金额</text> <br><text class="color-blue">￥ {{totalPrice}}</text></h3>
			</view>
			<view>
				<h3><text>待结算金额</text><br><text class="color-red">￥ {{notPayPrice}}</text></h3>
			</view>
		</view>
		<view class="char-box-title">
			<view v-show="chipRole == 'BOTH' ">
				<h3><text>传统洗涤</text> <br><text class="color-blue">￥ {{triOrderPrice}}</text></h3>
			</view>
			<view v-show="chipRole == 'BOTH' ">
				<h3><text>共享洗涤</text><br><text class="color-red">￥ {{publicOrderPrice}}</text></h3>
			</view> 
		</view>
		<view>
			
			<!-- <qiun-title-bar title="本月布草品类统计"/>
			<view class="charts-box charts-box-position" >
			  <qiun-data-charts
			    type="pie"
			    :chartData="chartData1"
			    background="none"
				:errorShow="true"
				errorMessage="数据异常,请点击重试"
			  />
			  <view v-show="isShow" class="no-data no-data-char">(T＿T) 暂无数据</view>
			</view> -->
			<view v-show="chipRole == 'BOTH' || chipRole == 'TRADITIONAL'">
				<qiun-title-bar title="近半年传统洗涤统计"/>
				<view class="charts-box">
				  <qiun-data-charts type="column" canvasId="scrollcolumnid"  :opts="{enableScroll:true,xAxis:{scrollShow:true,itemCount:4,disableGrid:true,},color:['#FC8452','#91CB74']}" :ontouch="true" :canvas2d="true" :chartData="chartsDataLine1" />
				</view>
			</view>
			
			<view v-show="chipRole == 'BOTH' || chipRole == 'PUBLIC'">
				<qiun-title-bar title="近半年共享洗涤统计"/>
				<view class="charts-box">
				  <qiun-data-charts type="column" canvasId="scrollcolumnid2"  :opts="{enableScroll:true,xAxis:{scrollShow:true,itemCount:4,disableGrid:true,},color:['#FC8452','#91CB74']}" :ontouch="true" :canvas2d="true" :chartData="chartsDataLine2" />
				</view>
			</view>
			
			
		</view>
		<u-tabbar :list="tabBarList" :active-color="activeColor" :inactive-color="inactiveColor"></u-tabbar>
	</view>
</template>

<script>
	import {mapGetters} from 'vuex'
	import api from "@/utils/api.js"
	import commonFn from "@/utils/common.js"
export default {
	computed: {
				...mapGetters([
					'tabBarList',
					'role',
				])
			},
	data() {
		return {
			inactiveColor: '#606266',
			activeColor: '#007aff',
			rangDay:"无",
			notPayPrice:0,
			totalPrice:0,
			triOrderPrice:0,
			publicOrderPrice:0,
			chartsDataLine1:{},// 传统洗涤布草情况
			chartsDataLine2:{}, // 共享洗涤布草情况
			currentTime:'',
			isShow:false,
			chipRole:'',
		};
	},
	onReady() {	 
	   
	},
	onLoad() {
		// if(uni.getStorageSync('token')){
		// 	this.getServerData();
		// 	this.getCurrentTime();
		// 	let role = uni.getStorageSync('chipType');
		// 	console.log(role)
		// 	this.role = role;
			
		// }else{
		// 	console.log("没有token")
		// 		uni.redirectTo({
		// 			url: '/pages/login/login'
		// 		});
		// }
		  
	},
	onShow() {
		 if(uni.getStorageSync('token')){
		 	this.getServerData();
		 	let role = uni.getStorageSync('chipType');
		 	console.log(role)
		 	this.chipRole = role;
		 	
		 }else{
		 	console.log("没有token")
		 		uni.redirectTo({
		 			url: '/pages/login/login'
		 		});
		 }
	},
	methods: {
		 getServerData(){
			 // 近一年
			 // api.getLineData().then((res)=> {
			 				 
			 // 				 this.chartsDataColumn4 = res.data
			 // })
			 // 近半年传统
			 api.getBarData().then((res)=> {
			 			this.chartsDataLine1 = res.data
			 })
			 // 近半年共享
			 api.getPublicData().then((res)=> {
			 			this.chartsDataLine2 = res.data
			 })
			 api.getWashCount().then((res)=> {
			 				this.notPayPrice = res.data.notPayPrice
			 				this.totalPrice = res.data.totalPrice
							this.triOrderPrice = res.data.triOrderPrice // 传统统计
							this.publicOrderPrice = res.data.publicOrderPrice // 共享统计
							// 设置酒店名称
							// let that = this;
							// // 动态修改导航栏标题
							// uni.setNavigationBarTitle({
							// 				title:that.hotelName
							// 			})
			 })
		 },
		
		// 当前时间
		 getCurrentTime(){
					//  var myDate = new Date();
					// this.currentTime = commonFn.getTime();
					setInterval(()=>{
						this.currentTime = commonFn.getTime();
					},1000)
		 }
		
	}
};
</script>

<style scoped lang="scss">
.content {
	
}
.char-box-title{
	width: 90%;
	margin:0 auto;
	padding: 20rpx;
	display: flex;
	justify-content: space-around;
	text-align: center;
	line-height: 1.5;
}
.charts-box {
  width: 100%;
  height: 300px; 
}
.date-box{
		background-color: #F8F8F8;
		padding: 30rpx 10rpx;
		display: flex;
		/* justify-content: space-between; */
		align-items: center;
		position: relative;
	}
	.date-box button{
		border: none;
		margin: 0;
	}
	.date-box text{
		text-align: right;
		font-size: 13px;
	}
</style>

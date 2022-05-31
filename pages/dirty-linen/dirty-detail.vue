<template>
	<view class="content">
		
		<uni-group title="基础信息" top="0" >
		    <view class="info-box">
				<view v-show="msg.floor!==''">楼层号：<text class="font-bolder">{{msg.floor+'F'}}</text> </view>
		    	<view>回收时间：{{msg.insertTime}}</view>
				<view>收货司机：{{msg.driverName}}</view>
				<view>联系电话：{{msg.driverPhone}}</view>
		    </view>
		</uni-group>
		
		<uni-group title="布草详情" top="0" >
			<view class="">
				<table id="mytabel">
					<thead>
						<tr>
							<th>名称</th>
							<th>规格</th>
							<th>重量</th>
							<th>回收数量</th>
						</tr>
					</thead>
					
						<tbody>
							<!-- <scroll-view scroll-y="true" class="scroll-Y" :scroll-top="scrollTop" @scrolltoupper="upper" @scrolltolower="lower"
							@scroll="scroll"> -->
							<template v-if="linenInfo&&linenInfo.length>0">
								<tr v-for="(item, index) in linenInfo" :key="index" class="list-item">
									<td>{{item.title}}</td>
									<td>{{item.specs}}</td>
									<td>{{item.weight}}Kg</td>
									<td>{{item.count}}</td>	
								</tr>
							</template>
							<template v-else>
								<tr>
									<td  colspan="4">(T＿T) 暂无数据</td>
								</tr>
								<!-- <view class="no-data">
									<text>(T＿T) 暂无数据</text> 
								</view> -->
							</template>

							<!-- </scroll-view> -->
						</tbody>
					
					
					
					 <tfoot>
					    <tr>
							<td class=" font-bolder">合计</td>
							<td></td>
							<td></td>
							<!-- <td>{{totalWeight || 0}}Kg</td> -->
							<td>{{totalCount || 0}}</td>
							
					    </tr>
						
					  </tfoot>
				</table>
			</view>
		    
		</uni-group>
		
		<uni-group title="电子签名" top="0" >
			
			<view>
				<!-- <h4>下单：</h4> -->
				<view class="img-box ">
					<image :src="msg.signSrc" alt="" mode="heightFix">
				</view>
			</view>
			
		</uni-group>
	</view>
</template>

<script>
	import commonFn from '@/utils/common.js'
	import api from "@/utils/api.js"
	export default {

	data() {
		return {
			msg:{
				id:"",
				status:"",
				floor:"",
				driverName:"",
				driverPhone:"",
				signSrc:"",
				insertTime:"",
				linenInfo:"",
			},
			linenInfo:[],
			totalCount:"",
			totalWeight:"",
			
		};
	},
	onLoad(e) {
		
		console.log(e.id)

		if(e.id){
			// 向后台请求数据
			let data = {
				dirtyId:e.id
			}
			this.getInfo(data)
		}else{
			uni.showToast({
				icon:"none",
				title:"没有ID，请返回上一页重新进入"
			})
		}
	},
// onBeforeBack(options) {  
		// 	console.log("跳转工作台")
		
		// },
		onBackPress(){
			console.log("onBackPress")
			// 跳转列表页
				uni.navigateTo({
					url:"/pages/dirty-linen/dirty-linen"
				})
				return true; 
		},
	methods: {
		//获取订单详情数据
		getInfo(data){
			api.dirtyDetail(data).then((res) => {
				if(res.success){
					this.linenInfo = res.data.categories
					this.msg.id = res.data.id;
					this.msg.floor = res.data.floor;
					this.msg.driverName = res.data.driverName;
					this.msg.driverPhone = res.data.driverPhone;					
					this.msg.insertTime = res.data.insertTime;
					// this.totalWeight =   res.data.totalWeight;
					this.totalCount =  res.data.count;
					// 签名照片字段
					this.msg.signSrc = res.data.file
					// console.log(this.signSrc) 
				}
				
			}).catch((err) => {
				
			})
		},
		
		
		
		
		
	},
};
</script>

<style scoped lang="scss">
.content {
	
}
.info-box{
	letter-spacing: 1px;
}
.info-box view{
	margin-bottom: 5px;
}
.scroll-Y{
	width: 100%;
	height: 400px;
}
table{
	width: 100%;
	text-align: center;
	color: $uni-text-color;
	padding: 0;
}
th,td{
	padding: 20rpx 0;
}
tr:nth-child(2n){
	background-color: rgba(0, 122, 255,.1);
	color: #777777;
}
tfoot tr{
	background-color: #eeeeee;
}
/deep/ .uni-group__title-text{
		color: #007aff;
		position: relative;
	}
	/* 二维码 */
	.img-box{
		width: 100%;
		margin-bottom: 15px;
		text-align: center;
	}
	.img-box1 image{
		width: 200px;
		height: 200px ;
		text-align: center;
	}
	
	.canvas {
		margin-top: 50rpx;
		text-align: center;
	}
	.canvas-hide {
			/* 1 */
			position: fixed;
			right: 100vw;
			bottom: 100vh;
			/* 2 */
			z-index: -9999;
			/* 3 */
			opacity: 0;
		}
		
</style>

<template>
	<view class="content">
		<!--共享订单状态-->
		<uni-group title="订单状态" top="0" v-if="isPublic">
					<uni-steps v-if="msg.status!=='已取消'" active-color="#3b99ff" :options="[{title: '待送货'}, {title: '送货中'},{title: '已完成'}]" :active="msg.statusStep"></uni-steps>
					<uni-steps v-else active-color="#8f939c" :options="[{title: '待送货'}, {title: '已取消'}]" :active="msg.statusStep"></uni-steps>
		</uni-group>
		<!--传统订单状态-->
		<uni-group title="订单状态" top="0" v-else>
					<uni-steps active-color="#3b99ff" :options="[{title: '脏布草待入厂'}, {title: '脏布草入厂'},{title: '净布草出厂'},{title: '订单完成'}]" :active="msg.statusStep"></uni-steps>
		</uni-group>
		
		<uni-collapse>
		    <uni-collapse-item title-border="none" :border="false" :open="true">
		        <template v-slot:title>
					<view class="title-box">
						<text>基础信息</text>
					</view>
		        </template>
		        <view class="content info-box">
					<view v-show="msg.floor!==''">楼层号：<text class="font-bolder">{{msg.floor+'F'}}</text> </view>
		        	<view v-show="!isPublic">	
		        	<view>芯片订单：<text :class="msg.hasChip?'font-bolder':'font-bolder color-gary2'">{{msg.hasChip?'是':'否'}}</text></view>
		        	</view>
		        	<view>结算状态：<text :class="msg.settlementStatus=='未结算'?'color-red':'color-green'">{{msg.settlementStatus}}</text></view>
		        	<view>
		        		结算金额：<text class="color-blue font-bolder">￥{{msg.settlementPrice || 0}}</text>
		        	</view>
		        	<view>
		        		结算备注：<text class="color-gary2">{{msg.settlementRemark || '无'}}</text>
		        	</view>
		        	<view>订单编号：<text class="color-gary2">{{msg.orderId}}</text></view>
		        	<view>订单时间：<text class="color-gary2">{{msg.insertTime}}</text></view> 
		        	<view><text v-if="!isPublic">收货</text><text v-else="isPublic">送货</text>司机：<text class="">{{msg.driverName || '无'}}</text></view>
		        	<view>联系电话：<text class="color-gary2">{{msg.driverPhone || '无'}}</text></view>
		        </view>
		    </uni-collapse-item>
		</uni-collapse>
		
		<uni-collapse>
		    <uni-collapse-item title-border="none" :border="false" :open="true">
		        <template v-slot:title>
					<view class="title-box">
						<text>布草详情</text>
					</view>
		        </template>
		        <view class="content info-box">
		        	<table id="mytabel">
		        		<thead>
		        			<tr>
		        				<th>名称</th>
		        				<th>规格</th>
		        				<th>重量</th>
		        				<th>单价</th>
		        				<th>订单数</th>
		        				<th v-show="!isPublic && msg.statusStep >= 2">洗涤数</th>
		        				<th>总价</th>
		        				<th v-show="isPublic && msg.statusStep > 1">实收数</th>
		        				<th v-show="isPublic && msg.statusStep > 1">实收价</th>
		        			</tr>
		        		</thead>
		        		
		        			<tbody>
		        				<template v-if="linenInfo&&linenInfo.length>0">
		        					<tr v-for="(item, index) in linenInfo" :key="index" class="list-item">
		        						<td>{{item.title}}</td>
		        						<td>{{item.specs}}</td>
		        						<td>{{item.weight}}Kg</td>
		        						<td>￥{{item.price || 0}}</td>
		        						<td>{{item.count}}</td>
		        						<td v-show="!isPublic && msg.statusStep >= 2">{{item.outCount}}</td>
		        						<td >￥{{parseFloat(Number(item.price) * Number(item.count)).toFixed(1) }}</td>
		        						<td v-show="isPublic && msg.statusStep > 1">{{(item.count-item.lostCount) || 0}}</td>
		        						<td v-show="isPublic && msg.statusStep > 1">￥{{parseFloat(Number(item.price) * Number(item.count - item.lostCount)).toFixed(1) }}</td>
		        					</tr>
		        				</template>
		        				<template v-else>
		        					<tr>
		        						<td colspan="6" class="color-gary">(T＿T) 暂无数据</td>
		        					</tr>
		        				</template>
		        			</tbody>
		        	
		        		 <tfoot>
		        		    <tr v-show="linenInfo && linenInfo.length>0">
		        				<td class=" font-bolder">合计</td>
		        				<td></td>
		        				<td>{{totalWeight || 0}}Kg</td>
		        				<td></td>
		        				<td>{{totalCount || 0}}</td>
		        				<td v-show="!isPublic && msg.statusStep >= 2">{{totalOutFacCount || 0}}</td>
		        				<td class="color-red font-bolder">￥{{isPublic?price:totalPrice }}</td>
		        				<td v-show="isPublic && msg.statusStep > 1">{{receiveCount || 0}}</td>		    	
		        				<td v-show="isPublic && msg.statusStep > 1" class="color-blue font-bolder">￥{{totalPrice}}</td>
		        				
		        		    </tr>
		        			
		        		  </tfoot>
		        	</table>
					<!-- 非本订单布草 -->
					<table id="mytabel2" v-show="!isPublic && msg.statusStep >= 2 && linenInfo2.length>0">
						<thead>
							<tr>
								<th colspan="7" >非本订单布草</th>
							</tr>
							<tr>
								<th>名称</th>
								<th>规格</th>
								<th>重量</th>
								<th>单价</th>
								<th colspan="2">洗涤数</th>
								<th>总价</th>
							</tr>
						</thead>
						<!-- info.categoryList -->
							<tbody class="scroll-Y">
								<template v-if="linenInfo2 && linenInfo2.length>0">
									<tr v-for="(item, index) in linenInfo2" :key="item.oid" class="list-item">
										<td class="font-15">{{item.title}}</td>
										<td>{{item.specs}}</td>
										<td>{{item.weight}}Kg</td>
										<td >￥{{item.price}}</td>
										<!-- <td>{{item.count}}</td> -->
										<td colspan="2" class=" color-orange ">{{item.outCount}}</td>
										<td >￥{{parseFloat(Number(item.price) * Number(item.outCount)).toFixed(1) }}</td>
										
									</tr>									
								</template>
								<template v-else>
									<tr>
										<td  colspan="7">(T＿T) 暂无数据</td>
									</tr>
								</template>
							</tbody>
					
						 <tfoot>
						   <tr>
								<td class=" font-bolder">合计</td>
								<td></td>
								<td>{{notInTotalWeight}}Kg</td>
								<td></td>
								<td colspan="2">{{notInTotalOutCount}}</td>
								<td class="font-bolder">￥{{notInTotalPrice}}</td>
							</tr>
							<tr class="all-box">
								<td class=" font-bolder">共计</td>
								<td></td>
								<td class="">{{ Number(notInTotalWeight)  + Number(totalWeight) }}Kg</td>
								<td ></td>
								<td colspan="2">{{Number(notInTotalOutCount)  + Number(totalOutFacCount)}}</td>
								<td class="font-bolder color-blue">￥{{Number(notInTotalPrice)  + Number(totalPrice)}}</td>
							</tr>
						  </tfoot>
					</table>
					<!--订单完成才会显示-->
					<view class="remark-box" v-if="msg.statusStep > 2">
						<view>
							收货备注：<text class="color-gary2">{{msg.remarkOut || '无'}}</text> 
						</view>
						<view>收货时间：<text class="color-gary2">{{msg.insertTime}}</text></view>
					</view>
		        </view>
		    </uni-collapse-item>
		</uni-collapse>

		<uni-collapse>
		    <uni-collapse-item title-border="none" :border="false" :open="true">
		        <template v-slot:title>
					<view class="title-box">
						<text>电子签名</text>
					</view>
		        </template>
		        <view class="content info-box">
		        	<view class="img-box1" v-show="isPublic">
		        		<image :src="msg.signSrc" alt="图片加载失败" mode="heightFix">
		        	</view>
		        	<view v-show="!isPublic">
		        		<h4>下单：</h4>
		        		<view class="img-box1">
		        			<image :src="beginFile" alt="图片加载失败" mode="heightFix">
		        		</view>
		        	</view>
		        	<view v-show="!isPublic && msg.statusStep > 2">
		        		<h4 >收货：</h4>
		        		<view class="img-box1" >
		        			<image :src="endFile" alt="图片加载失败" mode="heightFix">
		        		</view>
		        	</view>
		        </view>
		    </uni-collapse-item>
		</uni-collapse>
		
	</view>
</template>

<script>
	import commonFn from '@/utils/common.js'
	import api from "@/utils/api.js"
	export default {

	data() {
		return {
			isPublic:false,
			msg:{
				orderId:"",
				status:"",
				floor:"",
				remarkOut:"",
				hasChip:"",
				operatorName:"",
				driverName:"",
				driverPhone:"",
				settlementStatus:"",
				signSrc:"",
				insertTime:"",
				linenInfo:"",
				statusStep:0
			},
			linenInfo:[], // 订单布草
			linenInfo2:[],// 传统特有（随本单出厂的其它布草）
			
			notInTotalOutCount:0, // 非本单布草 出厂总数 
			notInTotalPrice:0, // 非本单布草 总价
			notInTotalWeight:0 ,// 非本单 总重量
			
			total:0, // 总计金额
			totalCount:"",
			totalWeight:"",
			price:"",
			totalPrice:0,
			totalOutFacCount:0,// 本单出厂总数
			
			// totalNWeight:"",
			// totalNCount:0,
			// totalNOutCount:3, 
			
			// totalAllWeight:"",
			// totalAllCount:"",
			// totalAllOutCount:5, // 共计出厂总布草数
			
			receiveCount:"",// 共享订单 实收总数
			beginFile:"", // 下单 
			endFile:"", // 收货 
			
			fromType:""
		};
	},
	onLoad(e) {
		
		// console.log(e.id)

		if(e.id){
			let url = '';
			if(e.type === 'public'){
				
				// 共享订单详情接口
				this.isPublic = true;
				url = '/app/order/info'
			}else{
				// 传统订单详情接口
				this.isPublic = false;
				url = '/app/order/orderDetail'
			}
			// 向后台请求数据
			let data = {
				orderId:e.id
			}
			this.getInfo(data,url)
		}else{
			uni.showToast({
				icon:"none",
				title:"没有ID，请返回上一页重新进入"
			})
		}
	},

	methods: {
		//获取订单详情数据
		getInfo(data,url){
			api.orderDetail(data,url).then((res) => {
				if(res.success){
					
					
					this.msg.settlementPrice = res.data.settlementPrice;
					this.msg.driverName = res.data.driverName;
					this.msg.driverPhone = res.data.driverPhone;
					this.totalPrice = res.data.totalPrice; // 传统：订单总价 共享：实际总价
					this.msg.insertTime = res.data.insertTime;
					this.msg.floor = res.data.floor;
					
					// 传统订单特有字段
					if(!this.isPublic){
						this.msg.orderId = res.data.orderId;
						this.msg.operatorName = res.data.operatorName;
						
						this.msg.hasChip = res.data.hasChip;
						this.msg.remarkOut = res.data.remark;// 收货备注
						// this.totalOutFacCount = res.data.totalOutFacCount;
						this.totalCount =  res.data.totalCount;
						this.msg.statusStep = commonFn.statusIndex(res.data.status);
						this.beginFile = res.data.beginFile;
						this.endFile =  res.data.endFile;
						this.totalWeight = res.data.totalWeight;
						this.msg.settlementStatus = commonFn.settlementType(res.data.settlementStatus);
						this.linenInfo = res.data.orderCategories; // 本订单 布草详情
						this.linenInfo2 = res.data.notInOrderCategories; // 随本订单出厂的其它布草
						if(this.linenInfo.length > 0){
							this.linenInfo.forEach((item)=>{
								this.totalOutFacCount += parseInt(item.outCount)	
							})
						}
						console.log(111)
						if(this.linenInfo2.length > 0){
							this.linenInfo2.forEach((item)=>{
								this.notInTotalOutCount += parseInt(item.outCount)
								this.notInTotalWeight += parseInt(item.weight)
								this.notInTotalPrice += Number(parseFloat(Number(item.price) * Number(item.outCount)).toFixed(1)) 
							})
							console.log(222)
						}
					}else{
						// 共享特有
						this.msg.orderId = res.data.id;
						this.msg.statusStep = commonFn.statusShareIndex(res.data.status);	
						// console.log(this.msg.statusStep)
						this.msg.settlementStatus = res.data.settlementStatus;
						this.msg.status = res.data.status;
						this.msg.signSrc = res.data.file;
						this.linenInfo = res.data.categories;
						this.totalCount =  res.data.count;
						this.price = res.data.price; // 订单价
						this.receiveCount = res.data.receiveCount; // 实收布草总数
						this.totalWeight = res.data.weight;
					}					
					// console.log(this.linenInfo)
					
				}
				
			}).catch((err) => {
				
			})
		},
		
		
		
		
		
	},
};
</script>

<style scoped lang="scss">

/* 可折叠 */
/deep/ .uni-collapse-item__title{
	background-color: #f8f8f8;
}
.title-box{
	padding-left: 15px;
	height: 40px;
	// background-color: #f8f8f8;
	font-weight: normal;
	display: flex;
	align-items: center;
}
.title-box text{
	color:#007aff;
	position: relative;
}
.title-box text::before{
	position: absolute;
	    top: 3px;
	    left: -10px;
	    content: "";
	    height: 10px;
	    border: 2px solid #007aff;
}
.content-box{
	padding: 15px;
}
.info-box{
	letter-spacing: 1px;
	font-size: 14px;
	padding: 15px;
}
.info-box view{
	margin-bottom: 5px;
}

table{
	width: 100%;
	// table-layout: fixed;
	text-align: center;
	color: $uni-text-color;
	padding: 0;
}

table th,td{
	padding: 20rpx 0;
	// width: 12%;
	// word-wrap:break-word; 
}
#mytabel tr:nth-child(2n){
		background-color: rgba(118, 183, 255,.1); 
		color: #777777;
}
#mytabel2 tbody tr:nth-child(2n){
		background-color: rgba(118, 183, 255,.1); 
		color: #777777;
}
tfoot tr{
	background-color: #eeeeee;
}
tfoot .all-box{
		background-color: #dfe4ea;
	}
/deep/ .uni-group__title-text{
		color: #007aff;
		position: relative;
	}
	//备注
		.remark-box{
			margin-top: 15px;
		}
		.remark-box view{
			margin-bottom: 5px;
			letter-spacing: 1px;
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
	/*电子签名*/
	.img-box1{
		display: flex; 
		justify-content: center;
	}
	.img-box1 image{
		// width: 200px;
		height: 100px ;
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

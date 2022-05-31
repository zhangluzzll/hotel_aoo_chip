<template>
	<view class="content">
		<!-- <uni-group title="订单状态" top="0" >
			<uni-steps   :options="[{title: '脏布草待入仓'}, {title: '脏布草入仓'}, {title: '脏布草出仓'}, {title: '入洗涤厂'},{title: '出洗涤厂'},{title: '净布草入仓'},{title: '净布草出仓'}]" :active="1"></uni-steps>
		    
		</uni-group> -->
		<uni-group title="基础信息" top="0" >
		    <view class="info-box">
		    	<view>公司名称：{{msg.cName}}</view>
		    	<view>订单状态：<text class="color-blue">{{msg.orderStatus}}</text></view>
		    	<view>订单编号：{{msg.id}}</view>
		    	<view>订单时间：{{msg.insertTime}}</view>
		    </view>
		</uni-group>
		
		<uni-group title="布草详情" top="0" >
			<view class="">
				<table id="mytabel">
					<thead>
						<tr>
							<th>名称</th>
							<th>规格</th>
							<th>数量</th>
							<th>金额</th>
						</tr>
					</thead>
					
						<tbody>
							<!-- <scroll-view scroll-y="true" class="scroll-Y" :scroll-top="scrollTop" @scrolltoupper="upper" @scrolltolower="lower"
							@scroll="scroll"> -->
							<template v-if="linenInfo.length>0">
								<tr v-for="(item, index) in linenInfo" :key="index" class="list-item">
									<td>{{item.title}}</td>
									<td>{{item.specs}}</td>
									<td>{{item.count}}</td>
									<td>{{item.price}}</td>
								</tr>
							</template>
							
							<template v-else>
								<tr>
									<td  colspan="4">(T＿T) 暂无数据</td>
								</tr>
								
							</template>

							<!-- </scroll-view> -->
						</tbody>
					
					
					
					 <tfoot>
					    <tr>
							<!--colspan="3"-->
					    	<td></td>
							<td></td>
							<td class=" font-bolder">合计</td>
					    	<td class="color-red font-bolder">￥{{total}}</td>
					    </tr>
					  </tfoot>
				</table>
			</view>
		    
		</uni-group>
	</view>
</template>

<script>
	
	import api from "@/utils/api.js"
export default {
	
	data() {
		return {
			msg:{
				id:"",
				cName:"",
				orderStatus:"",
				count:"",
				totalPrice:"",
				insertTime:"",
				linenInfo:[]
			},
			linenInfo:[],
			total:0, // 总计金额
			 scrollTop: 0,
			 old: {
			    scrollTop: 0
			 }
		};
	},
	onLoad(e) {
		console.log(e.id)
		if(e.id){
			// 向后台请求数据
			let data = {
				id:e.id
			}
			this.getInfo(data)
		}else{
			
			uni.showToast({
				icon:"none",
				title:"没有ID，请返回上一页重新进入"
			})
		}
	},
	methods: {
		//获取详情数据
		getInfo(data){
			
			api.customerOrderDetail(data).then((res) => {
				if(res.success){
					this.linenInfo = res.data.linenInfo
					this.msg.cName = res.data.cName;
					this.msg.id = res.data.id;
					// this.msg.orderStatus = res.data.status;
					// 判断订单状态到哪一步
					          switch(res.data.status) {
					            case 'TRANSPORTING':
					              this.msg.orderStatus = '运输中'
					              break;
					            case 'ENTER_STORE':
					              this.msg.orderStatus = '脏布草入仓'
					              break;
					            case 'OUT_STORE':
					              this.msg.orderStatus = '脏布草出仓'
					              break;
					            case 'IN_FACTORY':
					              this.msg.orderStatus = '入洗涤厂'
					              break;
					            case 'OUT_FACTORY':
					              this.msg.orderStatus = '出洗涤厂'
					              break;
					            case 'CLEAN_IN':
					              this.msg.orderStatus = '净布草入仓'
					              break;
					            case 'CLEAN_OUT':
					              this.msg.orderStatus = '净布草出仓'
					              break;
					            default:
					              this.msg.orderStatus = '脏布草待入仓'
					          }
					this.msg.count = res.data.count;
					// this.msg.totalPrice = res.data.totalPrice;
					this.msg.insertTime = res.data.insertTime;
					this.total = res.data.totalPrice;
				}
				
			})
		},
		// 合计总金额 
		sumPrice(){
			
			if(this.linenInfo.length >0){
				let totalPrice = this.linenInfo.reduce(function(prev, cur, index, arr){
					return Number(prev.price) + Number(cur.price) ;
				})
				this.total = totalPrice
				console.log(total)
			}
				
		},
		upper: function(e) {
		            console.log(e)
		        },
		        lower: function(e) {
		            console.log(e)
		        },
		        scroll: function(e) {
		            console.log(e)
		            this.old.scrollTop = e.detail.scrollTop
		        },
		
	}
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
/deep/ .uni-group__title-text{
		color: #007aff;
		position: relative;
	}
</style>

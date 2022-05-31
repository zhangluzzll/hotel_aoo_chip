<template>
	<view class="content">
		<uni-group title="布草明细" top="0" >
			<view class="">
				<table id="mytabel">
					<thead>
						<tr>
							<th>名称</th>
							<th>规格</th>
							<th>重量</th>
							<th>收货数</th>
							<th>回收数</th>
							<th>差额</th>
						</tr>
					</thead>
					
						<tbody>
							<template v-if="linenInfo&&linenInfo.length>0">
								<tr v-for="(item, index) in linenInfo" :key="index" class="list-item">
									<td>{{item.categoryName}}</td>
									<td>{{item.categorySpecs}}</td>
									<td>{{item.categoryWeight}}Kg</td>
									<td>{{item.inCount}}</td>
									<td>{{item.outCount}}</td>
									<td>{{Number(item.inCount - item.outCount)}}</td>
								</tr>
							</template>
							<template v-else>
								<tr>
									<td colspan="6">(T＿T) 暂无数据</td>
								</tr>
								
							</template>
						</tbody>
					
					
					
					 <tfoot>
					    <tr>
							<td class=" font-bolder">合计</td>
							<td></td>
							<td>{{totalWeight || 0}}Kg</td>
							<td>{{totalInCount }}</td>
							<td>{{totalOutCount }}</td>
							<td class="color-red font-bolder">{{differenceCount }}</td>
					    </tr>
						
					  </tfoot>
				</table>
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
			linenInfo:[],
			totalWeight:"",
			totalInCount:0,
			totalOutCount:0,
			differenceCount:0
		};
	},
	onLoad() {
		this.getInfo()
		
		// this.linenInfo = [
		// 	{
		// 		id:1,
		// 		title:"床单",
		// 		specs:"1.8m*2m",
		// 		weight:0,
		// 		count:100,
		// 		returnCount:50,
		// 	},
		// 	{
		// 		id:2,
		// 		title:"床单",
		// 		specs:"1.5m*2m",
		// 		weight:0,
		// 		count:20,
		// 		returnCount:20,
		// 	},
		// 	{
		// 		id:3,
		// 		title:"被套",
		// 		specs:"1.5m*2m",
		// 		weight:0,
		// 		count:20,
		// 		returnCount:20,
		// 	}
		// ]
	},

	methods: {
		//获取详情数据
		getInfo(){
			api.getPublicStorage().then((res) => {
				if(res.success){
					this.linenInfo = res.data;
					this.total()
				}
				
			}).catch((err) => {
				
			})
		},
		total(){
			if(this.linenInfo.length>0){
				this.linenInfo.map((i,j)=>{
					console.log(i)
					 this.totalInCount += parseInt(i.inCount) 
					 this.totalOutCount += parseInt(i.outCount) 
					 
				})
				this.differenceCount = this.totalInCount - this.totalOutCount
			}
			//
		}
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

<template>
	<view>
		<view class="screen-box">
			<view class="label-title">日期筛选：</view>
			<view class="dateTime-box">
				<uni-datetime-picker
					v-model="range"
					type="daterange"
					:end="commonFn.getToady()"
					rangeSeparator="至"
					 @change="changeDate($event)"
				/>
			 </view>
		</view>
		<view>
			<uni-list>
				<!-- :to="'/pages/dirty-linen/dirty-detail/id='+item.id" -->
			    <uni-list-item v-for="(item, index) in filterList" :key="item.id" :title="'布草总数：'+item.count" :note="item.insertTime" link :to="'/pages/dirty-linen/dirty-detail?id='+item.id"  rightText="明细"></uni-list-item>
				 
			</uni-list>
			
			<template>
				<view class="no-data" v-if="dirtyList!== undefined && dirtyList.length == 0 || !isShow">
					<text>(T＿T) 暂无数据</text>
				</view> 
				<uni-load-more :status="status" :icon-size="14" :content-text="contentText" v-if="dirtyList!== undefined && dirtyList.length > 0 && isShow" />
				</uni-load-more>
			</template>
		</view>
	</view>
</template>

<script>
	import api from "@/utils/api.js"
	const dirtyList = [
		{
			id:12214,
			count:100,
			insertTime:"2021-12-06 14:00:26"
		},
		{
			id:12215,
			count:150,
			insertTime:"2021-12-05 13:00:26"
		},
		{
			id:12216,
			count:200,
			insertTime:"2021-12-04 11:00:26"
		}
	]
	export default {
		data() {
			return {
				dirtyList:[], // 脏布草列表
				status: 'more',//加载更多 组件状态 loading ,moMore
				contentText: {
						contentdown: '上拉加载更多~',
						contentrefresh: '加载中',
						contentnomore: '我是有底线的~'
				},
				isShow:true ,//是否显示 加载更多 组件
				range: [],
				search:{
					pageNum:1,
					pageSize:10,
					beginTime:'',
					endTime:'',
				},
				totalPages:0 // 总页数
			}
		},
		onLoad() {
			// this.dirtyList = dirtyList;
			this.getList()
			// if( this.beginTime && this.endTime){
			// 	this.getList()
			// }
			
			// this.customerOrderList = orderList; 
			// this.customerOrderList = []
		},
		onBackPress(){
			console.log("onBackPress")
			// 跳转个人中心
				uni.switchTab({
					url:"/pages/tabbar/tabbar-3/tabbar-3"
				})
				return true; 
		},
		methods: {
			// 下拉刷新
			onPullDownRefresh() {
					this.search.pageNum = 1	
					this.getList() 
			},
			//上拉加载
				onReachBottom(){
					this.status = "loading"; //更改加载状态 

					 if(this.totalPages > this.search.pageNum){
					 	this.search.pageNum+=1;//每加载一次，对应的页数+1
					 	this.getList("loading") 
					 }else{
					 	this.status = "moMore"; 
					 	console.log("当前已是最后一页")
					 }
					 // console.log(this.search.pageNum)
					// //向后台请求下一页的数据  data:当前类型 当前页数 type pages
					//  this.search.pageNum+=1;
					// this.getList("loading")
				},
			
			// 查询选中酒店的订单列表
			getList(obj){
				
				api.dirtyList(this.search).then( res => {
					 
					 uni.stopPullDownRefresh();
					if(res.success){
						this.search.pageNum = res.data.current;
						this.totalPages = res.data.pages; // 总页数
						if(obj){
								let oldData = this.dirtyList;  // 上一页的数据
								this.dirtyList = oldData.concat(res.data.records) //新旧数组合并
								// this.$set(this.dirtyList, oldData.concat(res.data.records))
								//加载状态变更
									if(res.data.records.length == 0){
										this.status = "moMore";
									}else{
										this.status = "more";
									}
						}else{
							this.dirtyList = res.data.records;
						}
						setTimeout(function () {
						    uni.hideLoading();
						}, 1000);
					}
					
				}).catch( err => {
					console.log(err)
					 uni.stopPullDownRefresh();
					 uni.hideLoading();
				})
			},	
			// 日期范围change时间
			changeDate(e){
				 console.log( e);
				 if(e.length === 0){
					 console.log( 1);
					this.search.beginTime = '';
					this.search.endTime = '';
					this.range = [];
				 }else{
					  console.log( 2);
					this.range = e;
					this.search.beginTime = this.range[0];
					this.search.endTime = this.range[1]; 
				 }
				 console.log(this.range)
				 this.search.pageNum = 1;
				 this.getList()
			},
		},
		
		computed:{
				filterList () {
							if(this.dirtyList !== undefined && this.dirtyList !== null && this.dirtyList.length>0){
								return this.dirtyList;
							}
							
				}
			}
	}
</script>

<style lang="scss" scoped>
	.screen-box{
		margin: 0 10px;
	}
	.label-title{
		padding: 5px 0 ;
		font-weight: bold;
	}
	.dateTime-box{
		margin-bottom: 10px;
	}
	/deep/ .uni-list-item__extra-text{
			color:$uni-color-primary;
	}
	.no-data{
		margin-top: 200rpx;
		font-size:$uni-font-size-lg;
		color: #8D8D8D;
	}
</style>

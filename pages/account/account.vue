<template>
	<view>
		<view class="account-box">
			<view class="money-box">
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
			</view>
		</view>
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
			 <!-- <view><button size="mini" type="primary" plain>重置</button></view> -->
		</view>
		<uni-segmented-control v-if="items!== undefined && items.length>0" :current="current" :values=" items" @clickItem="onClickItem" style-type="text" active-color="#007aff"></uni-segmented-control>
			<view v-if="current === current">
			   <uni-list :border="true" >
				 <uni-list-item v-for="(item, index) in filterList" :key="item.id">
					 <view slot="header">
						 <view>
						 	<text class="font-base" >{{current === 0 ? item.activityName || "后台充值" :item.consumeWay}}</text>
						 </view>
						 <view>
						 	 <text class="font-small color-gary">{{item.insertTime}}</text>	
						 </view>
					 </view>
					 <view slot="footer" v-if="current === 0">
						 <view >
							 <text class="font-small">充值<text class="color-white">- </text></text>
							 <text class="color-green font-bolder font-base">+ {{item.amount}}</text>
						 	
						 </view>
						 <view>
						 	<text class="font-small">赠送<text class="color-white">- </text></text>
							<text class="color-blue  font-bolder font-base"> + {{item.give}}</text>	
						 </view>
					 </view> 
					  <view slot="footer" v-else>
					  		<view >
					  			 <text class="font-small">扣款<text class="color-white">- </text></text>
					  			 <text class="color-red  font-bolder font-base">- {{item.consumeAmount}}</text>
					  		</view>
					  		<view>
					  			<text class="font-small">余额 </text>
					  			<text class="color-yellow font-bolder  font-base"><text class="color-white">- </text>{{item.balance}}</text>	
					  		</view>
					  </view>
			       </uni-list-item> 
			   </uni-list>
				 <template v-if=" items.length>0">
				 	<view class="no-data" v-if="(dataList[current]!== null && dataList[current]!== undefined && dataList[current].length == 0  ) || !isShow">
				 		<text>(T＿T) 暂无数据</text>
				 	</view>
				 	<uni-load-more :status="status" :icon-size="14" :content-text="contentText" v-if="dataList[current]!== null && dataList[current]!== undefined && dataList[current].length > 0 && isShow" />
				 	</uni-load-more>
				 </template>
			</view>
		</view>
	</view>
</template>

<script>
	import api from "@/utils/api.js"
	export default {
		data() {
			return {
				msg:{}, // 账户信息
				items: ['充值记录','消费记录'],//tab选项
				current: 0,
				// rechargeList:[],// 充值记录
				// consumptionList:[], // 消费记录
				dataList:[[],[]],
				range:[],
				pages:[1,1], // 当前页数
				totalPages:[0,0], // 总页数
				 reload: false,
				 status: 'more',//加载更多 组件状态 loading ,moMore 
				 contentText: {
				 		contentdown: '上拉加载更多~',
				 		contentrefresh: '加载中',
				 		contentnomore: '我是有底线的~'
				 },
				 isShow:true ,//是否显示 加载更多 组件
				 search:{
					beginTime:'',
					endTime:'',
				 	pageNum:1,
				 	pageSize:10,
				 },
				 
			}
		},
		onLoad() {
			console.log("onLoad")
			//获取所有数据	
			this.$nextTick(uni.startPullDownRefresh)
			// uni.startPullDownRefresh();
		},
		// onShow() {
		// 	console.log("onshow")
		// 	//获取所有数据	
		// 	uni.startPullDownRefresh();
		// },
		// 下拉刷新
		onPullDownRefresh() {
		        console.log('账户中心refresh');
				// 刷新当前页面 向后台请求一次数据
				let current = this.current;
				this.search.beginTime ='';
				this.search.endTime = '';
				this.search.pageNum = 1;
				this.$set(this.pages,current,1)
				this.getInfo()
				this.getRechargeList()
				this.getConsumptionList()
		},
		//上拉加载
			onReachBottom(){
				
				let current = this.current;
				console.log("触底函数"+current);
				this.status = "loading"; //更改加载状态 
				
				if(this.totalPages[current] > this.pages[current]){
					this.pages[current]+=1; //每加载一次，对应的页数+1
					this.search.pageNum = this.pages[current];
					
					if(current === 0){
						console.log("充值记录")
						this.getRechargeList("loading")
					}else{
						console.log("消费记录")
						this.getConsumptionList("loading")
					}
				}else{
					this.status = "moMore"; 
					console.log("当前已是最后一页")
				}
				
				
				
			},
		methods: {
			getInfo(){
				api.getWalletInfo().then((res)=>{
					console.log(res)
					if(res.success){
						this.msg = res.data
					}else{
						uni.showToast({
							icon:"none",
							title:res.msg
						})
					}
					uni.stopPullDownRefresh();
				})
			},
			getRechargeList(obj){
				let current = this.current;
				this.search.pageNum = this.pages[current]
				// let data = {
				// 	beginTime:'',
				// 	endTime:'',
				// 	pageNum:this.pages[current],
				// 	pageSize:10,
					
				// }
				
				
				api.getRechargeRecord(this.search).then((res)=>{
					
					if(res.success){
						
						console.log("充值记录");
						this.pages[current] = res.data.current; //当前页数
						this.totalPages[current] = res.data.pages; // 总页数
						if(obj){
							let oldData = this.dataList[current];  // 上一页的数据
							if(oldData){
								this.$set(this.dataList,current, oldData.concat(res.data.records))
							}
								// let oldData = this.dataList[0];  // 上一页的数据
								// this.dataList[0]= oldData.concat(res.data.records) //新旧数组合并
								//加载状态变更
									if(res.data.records.length == 0){
										this.status = "moMore"; 
									}else{
										this.status = "more";
									}
						}else{
							// 初始赋值 不是上拉加载 
							if(res.data.records){
								this.$set(this.dataList,0, res.data.records)
								this.status = "more";
							}
							
						}
						
						
					}else{
						uni.showToast({
							icon:"none",
							title:res.msg
						})
					}
					uni.stopPullDownRefresh();
				})
			},
			getConsumptionList(obj){
				let current = this.current;
				this.search.pageNum = this.pages[current]
				api.getConsumptionRecord(this.search).then((res)=>{
					console.log(res)
					if(res.success){
						// res.data.records
						// this.consumptionList = res.data.records;
						console.log("消费记录");
						this.pages[current] = res.data.current; //当前页数
						this.totalPages[current] = res.data.pages; // 总页数
						if(obj){
							let oldData = this.dataList[current];  // 上一页的数据
							if(oldData){
								this.$set(this.dataList,current, oldData.concat(res.data.records))//新旧数组合并
							}
								// let oldData = this.dataList[1];  // 上一页的数据
								// this.dataList[1]= oldData.concat(res.data.records) //新旧数组合并
								//加载状态变更
									if(res.data.length == 0){
										 this.status = "moMore";
									}else{
										this.status = "more";
									}
						}else{
							// 初始赋值 不是上拉加载 
							this.$set(this.dataList,1, res.data.records)
							this.status = "more";
						}
						
					}else{
						uni.showToast({
							icon:"none",
							title:res.msg
						})
					}
					uni.stopPullDownRefresh();
				})
			},
			onClickItem(e){
				if (this.current !== e.currentIndex) {
				    this.current = e.currentIndex;
				}
			},
			// 日期范围change时间
			changeDate(e){
				 console.log( e);
				 if(e.length === 0){
					this.search.beginTime = '';
					this.search.endTime = '';
				 }
				 this.search.pageNum = 1
				 if(this.current === 0){
				 	console.log("充值记录")
				 	this.getRechargeList()
				 }else{
				 	console.log("消费记录")
				 	this.getConsumptionList()
				 }
			},
			
		},
		computed:{
			//前端搜索
			filterList () {
				// console.log("计算属性");
						let arr = [];
						let current = this.current;
						if(this.dataList[current] !== undefined && this.dataList[current] !== null && this.dataList.length>0){
							return this.dataList[current];
						}
						
			}
						
			}
	}
</script>

<style scoped>
	.head-box{
		    position: fixed;
			background-color: #ffffff;
		    z-index:10;
		    width: 100%;
			/*  #ifdef  APP-PLUS || MP-WEIXIN */
				top: 0;
			/*  #endif  */
			/*  #ifdef  H5  */
			    top: 44px;  
			/*  #endif  */
		    
			
	}
	.account-box{
		background-color: #007AFF;
		color: #ffffff;
		width: 90%;
		padding:40rpx 20rpx ;
		margin: 20rpx auto;  
		border-radius: 10px;
		box-shadow: -1px 8px 11px 0px rgba(0,122,255, 0.4);
		/* position: fixed;
		z-index: 2;
		top:45px;
		left: 0;
		right: 0; */
	}
	.money-box{
		display: flex;
		justify-content: space-between;
		text-align: center;
	}
	.screen-box{
		margin: 0 10px;
		position: relative;
		/* z-index: 2;
		top:150px;
		left: 0;
		right: 0; */
	}
	.label-title{
		padding: 5px 0 ;
		font-weight: bold;
	}
	.dateTime-box{
		margin-bottom: 10px;
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
	
	/deep/ .segmented-control{
		width: 100%;
		color: #333333;
		background-color: #ffffff;
		position: sticky;
		 top: 0px;
		/* position: fixed;
		z-index: 2; */
		/* #ifdef  APP-PLUS || MP-WEIXIN */
			/* top: 224px; */
		/*  #endif  */
		/*  #ifdef  H5  */
		   /* top:264px; */
		/*  #endif */
	}
	.uni-list{
		/* margin-top: 45px; */
		/*  #ifdef  APP-PLUS || MP-WEIXIN */
			
		/*  #endif  */
		/*  #ifdef  H5  */
			/* margin-top: 265px; */
		/*  #endif  */
				
	}
</style>

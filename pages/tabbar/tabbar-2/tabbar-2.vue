<template>
	<view class="content">
		
		<uni-segmented-control v-if="items!== undefined && items.length > 0" :current="current" :values="items" @clickItem="onClickItem" style-type="text" active-color="#007aff"></uni-segmented-control>	       
			<view v-if="current == current">
			  <view>
					<uni-list class="list-box">
						  <uni-list-item   v-for="(item, index) in filterList" :key="item.id" class="list-item" >
								<template slot="body">
									<uni-card :title="'订单编号:'+item.id" note="true" extra="" isShadow="true">
										<uni-tag :text="item.status" mark="true" class="tag" size="small" :type="commonFn.statusType(item.status)"></uni-tag>
										<view v-show="item.floor!==''">	
											楼层号：<text class="margin-left font-bolder " >{{item.floor}}F</text>														
										</view>
											   <view>
												<text class="  body-text" >布草总数：{{item.count}}</text> 
											   </view>
											   <view>										   												   <text>芯片订单：<text :class="item.hasChip?'font-bolder':'font-bolder color-gary'">{{item.hasChip?'是':'否'}}</text></text>
											   </view>
											   <view>																							<text>收货司机：{{item.driverName}}</text>
											   </view>
											   
											   <!-- <view>
												<text class="  body-text" >订单总额：￥{{item.totalPrice}}</text> 
											   </view> -->
												<view>
												 <text class="  body-text" >订单时间：{{item.insertTime}}</text> 
												</view>
												<template v-slot:footer>
													<view class="footer-box">
													   <navigator :url="'/pages/order/detail/detail?id='+item.id"><view class="color-blue">订单详情</view></navigator>
													</view>
												</template>
											</uni-card>
								</template>		
						  </uni-list-item>			 
					</uni-list>
					<template>
						<view class="no-data" v-if="orderList[current]!== undefined && orderList[current].length == 0 || !isShow">
							<text>(T＿T) 暂无数据</text>
						</view> 
						<uni-load-more :status="status" :icon-size="14" :content-text="contentText" v-if="orderList[current]!== undefined && orderList[current].length > 0 && isShow" />
						</uni-load-more>
					</template>
				</view> 
			</view>		
		<uni-drawer ref="showSearch" mode="left" :mask-click="true" :width='320'>
			<view class="search-box">
				<h3>全部筛选条件：</h3>
				 <uni-forms >
				<!-- <view v-if="$store.state.tabBer.role =='FACTORY_USER'">
					<view class="label-title">司机名称</view>
				<song-data-picker :localdata="driverList"  popup-title="请选择司机" :openSearch="true" @change="onchange2" v-model="driverId"></song-data-picker>
				</view> -->
						<view class="label-title">日期范围</view>
						<view >
							<uni-datetime-picker
								v-model="range"
								type="daterange"
								:end="commonFn.getToady()"
								rangeSeparator="至"
								 @change="changeDate($event)"
							/>
						 </view>
						 <view class="label-title">结算状态</view>
						 <view >
						    <uni-data-checkbox v-model="search.settlementStatus" :localdata="settlementRange" ></uni-data-checkbox>
						 </view>
						 <view class="label-title">芯片订单</view>
						 <view >
						    <uni-data-checkbox v-model="search.hasChip" :localdata="hasChipRange" ></uni-data-checkbox>
						 </view>
						 
						 
			<view class="btn-box">
				<button size="mini" @click="clearSearch" plain type="primary">重置</button>
				<button size="mini" @click="confirmSearch" type="primary">确认</button>  
			</view>
				
				</uni-forms>
						
				    </view>
		</uni-drawer>
		<u-tabbar :list="tabBarList" :active-color="activeColor" :inactive-color="inactiveColor"></u-tabbar>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	import commonFn from '@/utils/common.js'
	import api from "@/utils/api.js"

	export default {
		
		data() {
			return {
				inactiveColor: '#606266',
				activeColor: '#007aff',
				items: ['全部','待入厂','已入厂','已出厂','已完成'],//tab选项 
				current: 0,
				orderList:[[],[],[],[],[]],
				webUrl:"",
				pages:[1,1,1,1,1],
				 searchText:"",//搜索框实时输入的文字
				 reload: false,
				 status: 'more',//加载更多 组件状态 loading ,moMore 
				 contentText: {
				 		contentdown: '上拉加载更多~',
				 		contentrefresh: '加载中',
				 		contentnomore: '我是有底线的~'
				 },
				 isShow:true ,//是否显示 加载更多 组件
				 range: [],
				 // ,{"value": '',"text": "全部"}
				 hasChipRange: [{"value":1,"text": "是"},{"value":0,"text": "否"}],
				 settlementRange:[{"value":'NOT_PAY',"text": "待结算"},{"value":'PAYED',"text": "已结算"}],
				 search:{
					 beginTime:'',
					 endTime:'',
					 pageNum:1,
					 pageSize:10,
					 status:'',
					 hasChip:'',
					 settlementStatus:''
				 },
				 totalPages:[0,0,0,0,0] // 总页数
			}
		},
		
		onLoad() {
			// console.log("onload");
			//获取所有数据	下拉刷新获取一次数据
			// this.orderList = orderList // 假数据
			// uni.startPullDownRefresh();	//后台接口数据
			
		},
		onShow(){
			uni.startPullDownRefresh();
			console.log(this.$store.state.hasNet)
		},
		// 下拉刷新
		onPullDownRefresh() {
				let current = this.current;
		        console.log('订单refresh');
				// this.search.pageNum = 1
				this.$set(this.pages,current,1)
				this.getHotelList();
		},
		//上拉加载
			onReachBottom(){
				let current = this.current;
				console.log("触底函数"+current);
				this.status = "loading"; //更改加载状态 
				if(this.totalPages[current] > this.pages[current]){
					this.pages[current]+=1; //每加载一次，对应的页数+1
					this.getHotelList("loading");
				}else{
					this.status = "moMore"; 
					console.log("当前已是最后一页")
				}
				
			},
		
		computed:{
			...mapGetters([
				'tabBarList',
				'role'
			]),
			//前端搜索
			filterList () {

						let current = this.current;
						// let currentType = this.currentType;
						
						if(this.orderList[current] !== undefined && this.orderList[current] !== null && this.orderList[current].length>0){						
							return this.orderList[current];
						}
			}
		},
		methods: {
			//向后台获取数据列表
			getHotelList(obj){
				let current = this.current;
				this.search.pageNum = this.pages[current];
				// let data = {
				// 	pageNum:this.pages[current],
				// 	pageSize:10,
				// 	settlementStatus:this.search.settlementStatus,
				// }
				api.customerOrderList(this.search).then((res)=>{
					uni.stopPullDownRefresh();
					if(res.success){
						this.pages[current] = res.data.current; //当前页数
						this.totalPages[current] = res.data.pages; // 总页数
						if(obj){
							let oldData = this.orderList[current];  // 上一页的数据
							if(oldData){
								// this.orderList[current]= oldData.concat(res.data) //新旧数组合并
								this.$set(this.orderList,current, oldData.concat(res.data.records))
							}
							//加载状态变更
								if(res.data.length == 0){
									this.status = "moMore"; 
								}else{
									this.status = "more";
								}
						}else{
							// 初始赋值 不是上拉加载
							this.$set(this.orderList,current, res.data.records)
							this.status = "more";
						}
						
					}
				})
			},
			back() {  
			            uni.navigateBack({  
			                    delta: 1  
			             });  
							
			       }  ,
			onClickItem(e){
				
				if (this.current !== e.currentIndex) {
				    this.current = e.currentIndex;
					// if(this.current == 0){
					// 	this.search.settlementStatus = "NOT_PAY"
					// }else{
					// 	this.search.settlementStatus = "PAYED"
					// }
					switch(this.current) {
					 case 1:
					    this.search.status = "TO_ENTER"
					    break;
					 case 2:
					    this.search.status = "IN_FACTORY"
					    break;
					 case 3:
					   this.search.status = "OUT_FACTORY"
					   break;
					 case 4:
					   this.search.status = "FINISH"
					   break;	    
					 default:
					    this.search.status = ""
					}
					this.$set(this.pages,this.current,1)
					this.getHotelList()
				}
				
			},
			// 关闭查询搜索遮罩层
			closeDrawer() {
			               this.$refs.showSearch.close();
			           },
			// 点击确定 开始搜索
			confirmSearch(){
						   console.log(this.range)
						   if(this.range.length>0){
							   this.search.beginTime = this.range[0];
							   this.search.endTime = this.range[1];
						   }
						   console.log(this.search)
						   // 查询订单
						   // this.search.pageNum = 1;
						   this.$set(this.pages,this.current,1)
						   this.getHotelList()
						   // 关闭
						   this.$refs.showSearch.close();
			},
			// 日期范围change时间
			changeDate(e){
						   console.log( e);
						   if(e.length === 0){
							   this.search.beginTime = '';
							   this.search.endTime = '';
						   }
					   },
			// 清除筛选条件 
			clearSearch(){
						   this.range = [];
						   this.search.beginTime = '';
						   this.search.endTime = '';
						   this.search.hasChip = '';
						   this.search.settlementStatus = '';
						   this.search.status = '';
						  
			},
			// 导航按钮点击事件
			onNavigationBarButtonTap(e) {
			       console.log("点击了导航按钮");  
				  if(e.float == "left"){
					  console.log("左边")
					  // 打开筛选
					  this.$refs.showSearch.open();
				  }
				   
			   },

		}
	}
</script>

<style lang="scss" scoped>
	page{
		background-color: #F8F8F8;
	}
	.search-box{
		padding: 10px ;
	}
	.label-title{
		padding: 5px 0 ;
		font-weight: bold;
	}
	.btn-box{
		width: 90%;
		margin: 15px auto 0 auto;
		display: flex;
		justify-content: space-between;
	}
	.btn-box button{
		width: 100px;
	}
	.segmented-control{
		width: 100%;
		position: fixed;
		z-index: 10;
		background-color: #ffffff;
		
	}
	 .list-box{
		
		padding-top: 40px; 
		text-align: left;
		
	}
	.list-item{
		width:100%;	
		// margin: 0 auto;
		// border: 1px solid red;
		font-size:$uni-font-size-base;
		letter-spacing: 1px;
		background-color: #F8F8F8;
	}
	/deep/ .uni-list-item__container{
		padding: 6px 15px;
	} 
	.uni-card{
		margin: 0;
		position: relative;
	}
	
	/deep/ .uni-card__header-title-text{
		font-size:$uni-font-size-base;
		
	}
	/deep/ .uni-card__content view{
		margin-bottom: 5px;
	}
	.uni-card__content .tag{
		position: absolute;
		top:10px;
		right: 10px;
		z-index:99;
		height: 22px;
		opacity: .7;
	}
	.footer-box{
		text-align: right;
	}
	
	/deep/ .uni-list--border-top,/deep/ .uni-list--border-bottom,/deep/ .uni-list--border:after{
		height: 0;
	}
	.no-data{
		margin-top: 200rpx;
		font-size:$uni-font-size-lg;
		color: #8D8D8D;
	}
</style>

<template>
	<view class="content">
		<!-- <uni-segmented-control v-if="items!== undefined && items.length > 0" :current="current" :values="items" @clickItem="onClickItem" style-type="text" active-color="#007aff"></uni-segmented-control>	       -->
			<!-- <view v-if="current === 0"> -->
				<template v-if="list!== undefined && list.length>0">
					<vgt-tab :list="list" :currentType="currentType" @onValueChange="onValueChange" openListTit="分类"></vgt-tab>
				</template>
				<view  v-if="currentType === currentType ">
					<uni-list class="list-box">
						  <uni-list-item   v-for="(item, index) in filterList" :key="item.id" class="list-item" >
										<template slot="body">
											<uni-card :title="'订单编号:'+item.id" note="true" :extra="changeOrderStatusText(item.status)" isShadow="true">
											   <view>
													酒店名称：<text class="body-text" >{{item.cName}}</text>
											   </view>
											   <view>
												<text class="  body-text" >布草总数：{{item.count}}</text> 
											   </view>
											   <view>
												<text class="  body-text" >订单总额：￥{{item.totalPrice}}</text> 
											   </view>
												<view>
												 <text class="  body-text" >订单时间：{{item.insertTime}}</text> 
												</view>
												<template v-slot:footer>
													<view class="footer-box">
													   <navigator :url="'../../order/detail/detail?id='+item.id"><view class="color-blue">订单详情</view></navigator>
													</view>
												</template>
											</uni-card>
										</template>		
						  </uni-list-item>			
					</uni-list>
					<template>
						<view class="no-data" v-if="orderList[currentType]!== undefined && orderList[currentType].length == 0 || !isShow">
							<text>(T＿T) 暂无数据</text>
						</view> 
						<uni-load-more :status="status" :icon-size="14" :content-text="contentText" v-if="orderList[currentType]!== undefined && orderList[currentType].length > 0 && isShow" />
						</uni-load-more>
					</template>
				</view>
			</view>
	</view>
</template>

<script>
	import vgtTab from '@/components/vgt-tab/vgt-tab.vue'
	import api from "@/utils/api.js"
	const orderList = [
				[{
					id:12214,
					customName:"全季酒店",
					orderStatus:"脏布草待入仓",
					totalPrice:10000,
					count:500,
					totalPrice:4000,
					insertTime:"2021-05-06 14:00:26"
					},
				],
				[{
					id:12215,
					customName:"全季酒店",
					orderStatus:"运输中",
					totalPrice:10000,
					count:500,
					totalPrice:4000,
					insertTime:"2021-05-06 14:00:26"
					},
				],
				[{
					id:12216,
					customName:"全季酒店",
					orderStatus:"脏布草入仓",
					totalPrice:10000,
					count:500,
					totalPrice:4000,
					insertTime:"2021-05-06 14:00:26"
					},
				],
				[],
				[],
				[],
				[],
				[]
	]
	
	export default {
		components: {
		            'vgt-tab': vgtTab 
		        },
		data() {
			return {
				// list:["脏布草待入仓","运输中","脏布草入仓","脏布草出仓","入洗涤厂","出洗涤厂","净布草入仓","净布草出仓"],
				list:["脏布草待入仓","脏布草入仓","脏布草出仓","入洗涤厂","出洗涤厂","净布草入仓","净布草出仓"],
				orderStatusList:['TO_ENTER','ENTER_STORE','OUT_STORE','IN_FACTORY','OUT_FACTORY','CLEAN_IN','CLEAN_OUT'],
				currentType:0,
				orderList:[],
				webUrl:"",
				pages:[1,1,1,1,1,1,1], 
				 searchText:"",//搜索框实时输入的文字
				 reload: false,
				 status: 'more',//加载更多 组件状态 loading ,moMore 
				 contentText: {
				 		contentdown: '上拉加载更多~',
				 		contentrefresh: '加载中',
				 		contentnomore: '我是有底线的~'
				 },
				 isShow:true ,//是否显示 加载更多 组件,			
				 search:{
					 pageNum:1,
					 pageSize:10,
				 	status:'TO_ENTER'
				 },
			}
		},
		
		onLoad() {
			console.log("onload");	
			//获取所有数据	
			uni.startPullDownRefresh();
		},
		
		onNavigationBarButtonTap(e) {
		      
			  if(e.float == "right"){
				  console.log("右边")
				  // 退出登录
				  uni.showModal({
				      title: '退出登录提醒',
				      content: '您确定要退出登录？',
				      success: function (res) {
				          if (res.confirm) {
				              console.log('用户点击确定');
				  							  uni.removeStorage({
				  							      key: 'token',
				  							      success: function (res) {
				  							          console.log('success');
				  									  uni.navigateTo({
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
				  // uni.navigateTo({
				  // 					url: '/pages/edit-psd/edit-psd',
				  // 					animationType: 'pop-in',
				  // 					animationDuration: 200
				  //  });
			  }
			   
		   }, 
		// 下拉刷新
		onPullDownRefresh() {
		        console.log('订单refresh');
				this.search.pageNum = 1
				this.getList();
		},
		//上拉加载
			onReachBottom(){
				
				 let currentType = this.currentType;
				console.log("触底函数 选项"+currentType);
				this.status = "loading"; //更改加载状态 
				// //向后台请求下一页的数据  data:当前订单类型 状态 当前页数 orderType statusType pages
				this.pages[currentType]+=1; //每加载一次，对应的页数+1
				this.search.pageNum = this.pages[currentType];
				this.getList("loading");
				
			},
		
		computed:{
			//前端搜索
			filterList () {
						let currentType = this.currentType;
						
						if(this.orderList[currentType] !== undefined && this.orderList[currentType] !== null && this.orderList[currentType].length>0){						
							return this.orderList[currentType];
						}
			}
			
		},
		methods: {
			
			//向后台获取数据列表
			getList(obj){
				let currentType =this.currentType
				let data = {
					pageNum:this.search.pageNum,
					pageSize:10,
					search:{
						status:this.search.status
					}
				}

				api.customerOrderList(data).then((res)=>{
					uni.stopPullDownRefresh();
					if(res.success){
						
						if(obj){
							let oldData = this.orderList[currentType];  // 上一页的数据
							
							if(oldData){
								this.$set(this.orderList, currentType, oldData.concat(res.data))
								// this.orderList[currentType]= oldData.concat(res.data) //新旧数组合并
							}
							//加载状态变更
								if(res.data.length == 0){
									this.status = "moMore"; 
								}else{
									this.status = "more";
								}
						}else{
								// 初始赋值 不是上拉加载
							this.$set(this.orderList,currentType, res.data)
							
							
						}
						// if(this.orderList[currentType] == null || this.orderList[currentType] == undefined){
						// 	// this.orderList[currentType] = res.data
						// 	this.orderList.splice(currentType,1,res.data) 
						// 	// console.log("酒店订单");
						// 	console.log(this.orderList[currentType]) 
							
						// }else{
						// 	let oldData = this.orderList[currentType];  // 上一页的数据
						// 	// console.log(oldData)
						// 	if(oldData){
						// 		this.orderList[currentType]= oldData.concat(res.data) //新旧数组合并
						// 	}
						// 	//加载状态变更
						// 		if(res.data.length == 0){
						// 			this.status = "moMore";
						// 		}else{
						// 			this.status = "more";
						// 		}
						// }
					}
				})
			},
			// onClickItem(e){
			// 	console.log(e)
			// 	if (this.current !== e.currentIndex) {
			// 	    this.current = e.currentIndex;
			// 	}
			// },
			// 选项卡切换
			onValueChange(e){
				
				if (this.currentType !== e.currentIndex) {
				    this.currentType = e.currentIndex;
					this.search.status = this.orderStatusList[this.currentType];
					
					this.getList()
				} 
			},
			changeOrderStatusText(text){
				console.log(text)
				switch(text) {
				  case 'TRANSPORTING':
				    return '运输中';
				    break;
				  case 'ENTER_STORE':
				    return '脏布草入仓';
				    break;
				  case 'OUT_STORE':
				    return  '脏布草出仓';
				    break;
				  case 'IN_FACTORY':
				    return  '入洗涤厂';
				    break;
				  case 'OUT_FACTORY':
				    return  '出洗涤厂';
				    break;
				  case 'CLEAN_IN':
				    return  '净布草入仓';
				    break;
				  case 'CLEAN_OUT':
				    return '净布草出仓';
				    break;
				  default:
				    return  '脏布草待入仓';
				}
			},
			
		
			
		}
	}
</script>

<style lang="scss" scoped>
	page{
		background-color: #F8F8F8;
	}
	.segmented-control{
		width: 100%;
		position: fixed;
		z-index: 10;
		background-color: #ffffff;
		
	}
	 .list-box{
		padding-top: 0;
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
	}
	/deep/ .uni-card__header-title-text{
		font-size:$uni-font-size-base;
		
	}
	/deep/ .uni-card__content view{
		margin-bottom: 5px;
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

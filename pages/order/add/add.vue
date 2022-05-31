<template>
  <view>
	  <uni-forms ref="form" :value="formData" :rules="rules" class="forms-box">
				<uni-group title="其它信息(选填)" top="0" >
					<uni-forms-item  label="楼层号" name="floor" >
						<uni-easyinput type="text" v-model="formData.floor" placeholder="只能输入整数与符号 ( 例：1 或 1-1 或 1#1 )" />
					</uni-forms-item>						  
				</uni-group>
	  			<!-- <uni-group title="布草 / 规格 / 克重 / 数量" margin-top="20"> -->
				<uni-group title="净布草信息(必填)" top="0">
					<view class="scroll-form" v-if="cloth.length !== 0">
						<view class="temp-box" v-for="(domain, index) in formData.domains" :key="index" >
							<view class="temp-box-title"><!--onchange-->
									<uni-forms-item  label="" :name="'domains.' + index + '.cloth.value'" :key="domain.key + '-cloth'" required >
											<song-data-picker :localdata="cloth"  popup-title="请选择布草 / 规格 / 克重" :openSearch="true" @change="clothChange(index,$event)" v-model="domain.weight.value"></song-data-picker>
										</uni-forms-item>
									</view>
									<view class="temp-box-price">
										 <uni-forms-item required label="" :name="'domains.' + index + '.count'" >
											<uni-easyinput type="number" format="number" v-model="domain.count" placeholder="请输入数量"  @blur="totalCountFn()" />
										 </uni-forms-item>
									</view>
									<view class="temp-box-btn">
										<uni-icons type="plus" size="30" @click="addDomain" v-if="index === 0" color="#007aff"></uni-icons>
										<uni-icons type="minus" size="30" @click="removeDomain(index)" color="#dd524d" v-else></uni-icons>
							</view>
						</view>
						</view>
					
					<u-divider margin-bottom="20" v-else>暂无可用布草</u-divider>
					
					<view class="total-box">
						<view>
							<text class="font-base">合计重量：</text><text class="font-lg color-blue">{{totalWeight}} Kg</text>
						</view>
						<view> 
							<text class="font-base">合计数量：</text><text class="font-lg color-red">{{totalCount}}</text>
						</view>
					</view>
				</uni-group>
	             <button @click="submitForm" type="primary" class="btn-submit" :disabled="isClick">提交</button>
	  </uni-forms>
    
  </view>
</template>

<script>
	import config from "@/utils/config.js"
	import api from "@/utils/api.js"

	
  export default {

    data() {
      return {
		  index:0, // key 唯一值
		   oids:[],
		   isClick:false, // 按钮是否可点击的状态
		   isSubmit:0, // 布草信息每行填充完整，没有漏填，如有，则 >0
		  customList:[] ,//所有客户 text value industry 客户名称 客户id 行业类型
		  candidates:[],//所有行业
		  tempList:[], // 所有价格模板
		  cloth:[], // 所有布草信息
		  totalWeight:0, // 总重量
		  totalCount:0, // 总数量
		  
		  formData:{
			floor:'',
			//布草信息
			domains: [{
					  // title:"",
					  // specs:"",
					  weight:{
						  text:"", // 计算重量需要
						  value:"" // id传至后台
					  },
					  count:"", // 数量 
					  key: 0
			        }]
		  },
		  rules:{
			 floor:{
			 	rules:[{
			 		pattern:/^[1-9]*[`#&-|,./?~！#&*——|？]?[0-9]+$/,
			 		errorMessage:'首尾只能是整数，中间只允许用特殊符号连接'
			 	}]
			 },
		  		count:{
		  			rules: [{
		  				required: true,
		  				errorMessage: '请输入数量',
		  				}
		  			]
		  		}
		  },
      }
    },
	onLoad() {
		// 查询共享布草
		this.getPublic()
		//渲染默认值 从后台返回默认品类，有就返，没有就没有
		setTimeout(()=>{
			this.getUsedCloth()
		},1000)
	},
    methods: { 
		// 获取共享布草
		getPublic(){
			// let value = e.detail.value[0].value;
			// console.log(value)
			// this.formData.type = value;
			let data = {
				weight:true
			}
			api.getPublicCloth(data).then((res)=> {
				console.log(res)
				if(res.success){
					if(res.data.length>0){
						this.cloth = res.data;
					}else{
						uni.showToast({
							icon:"none",
							title:"该客户所在行业没有布草信息，请先在后台管理系统中添加",
							duration:3000
						})
					}
					console.log(this.cloth)
				}else{
					uni.showToast({
						icon:"none",
						title:res.msg
					})
				}
			})
		},
		// 获取常用布草
		getUsedCloth(){
			api.getUsedCloth({isPublic:true}).then((res)=>{
				console.log(res)
				if(res.success){
					if(res.data.length>0){
						this.getUsed(res.data);
					}
				}else{
					uni.showToast({
						icon:"none",
						title:res.msg
					})
				}
			})
		},
		// 布草联选改变
		clothChange(index,e){
				 let domains = this.formData.domains; //是一个数组
				 domains.map((i,k)=>{
				      if(k === index){
						 i.weight.value = e.detail.value[2].value;
						 i.weight.text = e.detail.value[2].text;
						 this.$forceUpdate()
				      }
				 })
				 console.log(domains)
		},
		// 默认品类数据回显
		getUsed(obj){
			 let domains = this.formData.domains; //是一个数组
			 if(obj.length>1){
				obj.forEach((e,index)=> {
					if(index == obj.length -2 ){
						return;
					}
					this.addDomain()
				})
			 } 
			 console.log(obj);
			 domains.map((i,k)=>{
				// 设置常用布草默认值
				 i.weight.text = obj[k].weight
				 i.weight.value = obj[k].oidss.toString()
			 })
		},
		// 新增行
		addDomain(){
				this.index += 1; // 保持key的唯一性 
				console.log("新增"+this.index)
				console.log(this.index)
				this.formData.domains.push({
					weight:{},
					count:"",
					key: this.index
				})							 
		},
		// 删除行
		removeDomain(index) {
				this.formData.domains.splice(index,1); 
				this.totalCountFn() // 改变总计数量与重量
			},
		// 提交
	    submitForm(){
	  		  this.$refs.form.validate().then((res)=>{
	  		      // console.log('表单返回值：', res);
	  			  // console.log(this.formData);
	  			  this.oids = [];
	  			  this.isSubmit = 0;
	  			  let domains = this.formData.domains; //是一个数组
	  			  domains.map((i,k)=>{
	  			       if(i.weight.value !==0 && i.count!==undefined){
	  			           // console.log(i.weight.value) // 克重ID
	  			  			// console.log(i.count)	// 对应的数量
	  							if(i.weight.value && i.count){
	  								this.oids.push({
	  									oid:i.weight.value,
	  									count:i.count
	  								})
	  								
	  							}else{
	  								this.isSubmit ++;
	  								uni.showToast({
	  									icon:"none",
	  									title:"信息不完整"
	  								})
	  								
	  							}	
	  						
	  			       }else{
	  					    uni.showToast({
	  					    	icon:"none",
	  					    	title:"信息不完整"
	  					    })
	  						this.isSubmit ++;
	  				   }
	  			  })
	  			  if(this.oids.length>0 && this.isSubmit === 0){
					 console.log(this.formData)
					this.isClick = true; // 提交按钮不可点击
					uni.showLoading({
						title:"提交中"
					})

					setTimeout(()=>{
						
						let data = Object.assign({oids:this.oids}, this.formData);
						delete data.domains
						delete data.signSrc
						console.log(data)
						
						// 提交订单
						api.addOrder(data).then( res => {
							// console.log(res)
							if(res.success){
								// 返回订单id
								uni.showToast({
									title: '下单成功!',
									duration: 1000
								});
								
								// 跳转 订单详情页 携带订单id 
								setTimeout(function(){
									uni.redirectTo({
										url:"/pages/order/detail/detail?type=public&&id="+res.data.id
									})
									// this.isClick = false; // 提交按钮可点击
								},1000)
							}else{
								uni.showToast({
									icon:"none",
									title: res.msg,
									duration: 1000
								});
								this.isClick = false; // 提交按钮可点击
							}
							uni.hideLoading()
						})
					},2000)
	  		  		
	  			  }else{
	  				  uni.showToast({
	  				  	icon:"none",
	  					title:"布草信息不完整"
	  				  })
	  				 
	  			  }
	  		  	
	  		  	}).catch(err =>{
	  		  	    console.log('表单错误信息：', err);
	  		  		uni.showToast({
	  		  			icon:"none",
	  		  			title:err
	  		  		})
	  		  	})
	  		 
	  	  },
		  // 计算总重量 与 总数量
		  totalCountFn(){
			  this.totalCount = 0;
			  this.totalWeight = 0;
			  let domains = this.formData.domains; //是一个数组
			  domains.map((i,k)=>{
			  				 // console.log(parseInt(i.weight.text) );
			  				 if(isNaN(parseInt(i.count))){ 
			  				 		i.count = 0;
			  				 }
							 if(isNaN(parseFloat(i.weight.text))){
							 	i.weight.text = 0;
							 }
			  				 this.totalCount += parseInt(i.count);
							 this.totalWeight+= Math.round(parseFloat(i.weight.text) * parseInt(i.count));  // 四舍五入
			  				  
			  })
		  },
	   onnodeclick(node) {
		   console.log(node) 
	        }
    }
  }
</script>
<style scoped lang="scss">
	
	.forms-box{
		width: 90%;
		margin: 40rpx auto;
		padding-bottom: 46px;
	}
	.border-box{
		padding:6px 0 6px 10px ;
		border:1px solid rgb(229, 229, 229)
	}

	/deep/ .uni-easyinput__content{
		min-height: 40px;
	}
	.total-box{
		margin: 10px auto;
	}
	.btn-save{
		width: 100%;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
	}
	.scroll-form{
		position: relative;
		min-height: 62px;
		max-height: 550px;
		overflow-y: scroll;
	}
	.temp-box{
		display: flex;
		justify-content: space-between;
		// margin-top: 20px;
		// padding-bottom: 0;
	}
	// 第一行吸顶 
	.scroll-form .temp-box:first-child{
		position: sticky;
		top:0;
		z-index: 2;
		background-color: #ffffff;
	}
	.temp-box-title{
		width: 90%;
	}
	
	.temp-box-btn{
		width: 10%;
		line-height: 1.5;
	}
	/deep/ .uni-input-placeholder{
		font-size: 12px;
	}
	/deep/ .uni-group__content{
		padding:15px 0 0 0;
	}
	.btn-submit{
		width: 90%;
		margin: 0 auto;
		position: fixed;
		bottom: 10px;
	}
</style>

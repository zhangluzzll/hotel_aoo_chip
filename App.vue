<script>
	import {mapState,mapMutations} from 'vuex';
	import config from "@/utils/config.js" // 地址
	import api from "@/utils/api.js"
	export default {
		onLaunch: function() {
			// 锁定竖屏
			plus.screen.lockOrientation("portrait-primary");
			// 检测版本更新
			this.software_version_update(); 
			console.warn('当前组件仅支持 uni_modules 目录结构 ，请升级 HBuilderX 到 3.1.0 版本以上！')
			console.log('App Launch')
			var token = uni.getStorageSync('token');
			let chipType = uni.getStorageSync('chipType');
			if(token && chipType ){
				// console.log(chipType)
				this.setRole(chipType);
			}
			
		},
		onShow: function() {
			console.log('App Show')
			// 监听网络状况，断网重新连接
			let that = this;
			uni.onNetworkStatusChange(function(res){
				if(res.isConnected){
					that.$store.commit("changeNetStatus",true);
					uni.showToast({
						title:"网络已连接",
						icon:"none"
					})
				}else{
					that.$store.commit("changeNetStatus",false);
					uni.showToast({
						title:"无网络",
						icon:"none"
					})
				}
			})
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods:{
			...mapMutations(['setRole']),
			// 检查版本号
			software_version_update(){
					let that = this;
					//plus.nativeUI.showWaiting("检测更新...");
					// 获取本地应用资源版本号
					let wgtVer = null;
					plus.runtime.getProperty(plus.runtime.appid, function(inf) {
						wgtVer = inf.version;
						//		plus.storage.setItem("verNum", wgtVer);//版本号存起来
						console.log("当前版本：" + wgtVer);
					});
					
					// 向后台请求最新的版本号与更新说明
					let data = {
						type:'CHIP_CUSTOMER'
					}
					api.getVersion(data).then((res)=> {
									 console.log(res.data) 
									 if(res.success){
								 			let version = res.data.version; //最新版本号
								 			let updateText =  res.data.description; //更新说明
											let result = this.compareVersion(version,wgtVer); // 版本号的比较 
										if (wgtVer && data && (result === 1)) {
											console.log("下载前判定条件");
											//新增版本更新说明
												uni.showModal({
													 title: version + '版 更新说明',
													 content: updateText,
													 showCancel:true,
													success: function (res) {
														if (res.confirm) {
															console.log("下载前点击确定");
															that.downWgt(); // 下载升级包
														}
													}
												});
																									
									 }else{
										 console.log("版本一致，无需更新")
										 uni.showToast({
										 	icon:"none",
										 	title:"当前已是最新版"
										 })
									 }	
								 }
					})
					
			}, 	 
			downWgt(){
				console.log("进入更新下载");
				let that = this;
				let downUrl = config.updateWgtUrl+'/version/download/CHIP_CUSTOMER';
				// plus.nativeUI.showWaiting("新版本,正在下载,请稍后...");
				console.log("下载前"); 
				let w=plus.nativeUI.showWaiting(" 开始更新 0% ");   
				var dtask = plus.downloader.createDownload(downUrl, {
					filename: "_doc/update/"
				}, function(d, status) {
					if (status == 200) {
						console.log("下载wgt成功：" + JSON.stringify(d));
						console.log("下载wgt成功：" + d.filename);
						that.installWgt(d.filename); // 安装wgt包
					} else {
						// plus.nativeUI.alert("下载wgt失败！"+status)
						console.log("下载wgt失败！"+status);
						plus.nativeUI.toast("下载wgt失败！");
					}
					plus.nativeUI.closeWaiting();
					
				});
				dtask.start();  
				dtask.addEventListener( "statechanged", function(task,status){  
				        switch(task.state) {  
				             case 1: // 开始  
				                 // w.setTitle("　　 开始下载...　　 ");  
				             break;  
				             case 2: // 已连接到服务器  
				                // w.setTitle("　　 开始下载...　　 ");  
				             break;  
				             case 3:  
							 // console.log(task.totalSize)
							 // console.log(task.downloadedSize)
							 let a = (task.downloadedSize/task.totalSize)*100; 
								// console.log(a) 
				                w.setTitle(" 请勿退出或操作 "+parseInt(a)+"% ");  
				             break;  
				                case 4: // 下载完成  
								// w.setTitle(" 更新完成，正在重启"); 
				                   // w.close();  
				                break;  
				        } 
				});
									
				// plus.downloader.createDownload(downUrl, {
				// 	filename: "_doc/update/"
				// }, function(d, status) {
				// 	if (status == 200) {
				// 		console.log("下载wgt成功：" + JSON.stringify(d));
				// 		console.log("下载wgt成功：" + d.filename);
				// 		that.installWgt(d.filename); // 安装wgt包
				// 	} else {
				// 		console.log("下载wgt失败！"+status);
				// 		plus.nativeUI.toast("下载wgt失败！");
				// 	}
				// 	plus.nativeUI.closeWaiting();
					
				// }).start();
			
			},
			installWgt(path){
				// plus.nativeUI.showWaiting("更新包下载完成，正在安装...");
				plus.runtime.install(path, {}, function() {
					plus.nativeUI.closeWaiting();
					console.log("安装wgt文件成功！");
					plus.runtime.restart();
					// plus.nativeUI.alert("版本更新完成！程序将自动重新启动", function() {
					//		});
				}, function(e) {
					plus.nativeUI.closeWaiting();
					console.log("安装wgt文件失败[" + e.code + "]：" + e.message);
					plus.nativeUI.toast("更新失败,[" + e.code + "]：" + e.message);
				});
			},
			// 比较版本号的大小
			compareVersion(v1, v2) {
			  v1 = v1.split('.')
			  v2 = v2.split('.')
			  const len = Math.max(v1.length, v2.length)
			
			  while (v1.length < len) {
			    v1.push('0')
			  }
			  while (v2.length < len) {
			    v2.push('0')
			  }
			
			  for (let i = 0; i < len; i++) {
			    const num1 = parseInt(v1[i])
			    const num2 = parseInt(v2[i])
			
			    if (num1 > num2) {
			      return 1
			    } else if (num1 < num2) {
			      return -1
			    }
			  }
			
			  return 0
			}
		}
	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
	page{
		font-size: $uni-font-size-base;
	}
	@import url("/static/fonts/iconfont.css");
	/*每个页面公共css */
	uni-button[type=default]{
		background-color: rgab(255,255,255,.5);
	}
	.color-gary{
		color:$uni-text-color-grey;
	}
	.color-gary2{
		color: #A3A3A3;
	}
	.color-blue{
		color: $uni-color-primary;
	}
	.color-red{
		color: $uni-color-error;
	}
	.color-green{
		color: $uni-color-success;
	}
	.color-yellow{
		color: $uni-color-warning;
	}
	.color-white{
		color: #ffffff;
	}
	.font-bolder{
		font-weight: bolder;
	}
	.font-small{
		font-size:$uni-font-size-sm ;
	}
	.font-base{
		font-size: $uni-font-size-base;
	}
	.font-lg{
		font-size:$uni-font-size-lg;
	}
	/deep/ .uni-group__title-text{
		color: #007aff;
		position: relative;
	}
	/deep/ .uni-group__title-text ::before{
		position: absolute;
		top:3px;
		left: -10px;
		content: "";
		height: 10px;
		border: 2px solid  #007aff;
	}
	.no-data{
		margin-top: 200rpx ;
		font-size:$uni-font-size-lg;
		color: #8D8D8D;
		text-align: center;
		background-color: transparent;
	}
</style>

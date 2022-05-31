const commonFn = {
			// 获取今天的日期
			getToady:(type) =>{
				const mydate = new Date()
				let year = mydate.getFullYear()
				let month = mydate.getMonth() + 1 
				let day = mydate.getDate();
				let toady;
				if(type == "indexDate"){
					  toady = year + '年' + month + '月' + day + "日";
					return toady;
				}else{
					toady = year + '-' + month + '-' + day;
					return toady;
					
				}
				
				// // console.log(toady)
				// return toady
			},
			getTime:()=>{
				const myDate = new Date();
				let hours = checkTime(myDate.getHours()); //获取当前小时
				let minutes = checkTime(myDate.getMinutes()); //获取当前分钟
				let seconds = checkTime(myDate.getSeconds()); //获取当前秒
				function checkTime(i){
					if(i < 10){
						return "0"+ i;
					}else{
						return i;
					}
				}
				
				return hours +":"+ minutes +":"+ seconds;
			},
			statusType:(data) =>{
				 switch(data) {
				            case '待入厂' :
				              return 'error';
				              break;
				            case '已入厂':
				              return 'warning';
				              break;
				            case '已出厂':
				              return 'primary';
				              break;
				            default:
				              return 'success';
				 }
			},
			statusShareType:(data) =>{
				 switch(data) {
				            case '待送货' :
				              return 'error';
				              break;
				            case '送货中':
				              return 'warning';
				              break;
							case '已取消':
							    return 'default';
							    break;
				            default:
				              return 'success';
				 }
			},
			statusIndex:(data)=>{
				switch(data) {
				           case 'TO_ENTER' :
				             return 0;
				             break;
				           case 'IN_FACTORY':
						   console.log(1)
				             return 1;
				             break;
				           case 'OUT_FACTORY':
				             return 2;
				             break;
				           default:
				             return 3;
				}
				
			},
			statusShareIndex:(data)=>{
				switch(data) {
				           case '待送货' :
				             return 0;
				             break;
				           case '送货中' :
				             return 1;
				             break;
						   case '已取消':
							   return 1;
							   break;
				           default:
				             return 2;
				}
				
			},
			settlementType:(data)=>{
				switch(data) {
				           case 'NOT_PAY' :
				             return '未结算';
				             break;
				           default:
				             return '已结算';
				}
				
			}
}
export default commonFn
var API_URL = "http://129.204.228.14:8081";
// var API_URL = "http://118.24.237.67:8081";
var userId = "";
var token = "";
var request = function(url,method,data){
	var _url = API_URL + url;
	// console.log(JSON.stringify(data))
	// console.log(JSON.stringify(_url))
	return new Promise(function(resolve, reject){
		var userInfo = validation();
		var userId = userInfo.userId + '';
		var token = userInfo.token + '';
		uni.request({
			url:_url,
			method:method,
			header: {
			    'Content-Type': 'application/x-www-form-urlencoded',
				'userId': userId,
				'token': token
			},
			data:data,
			success: (res) => {
				// console.log(JSON.stringify(res))
				resolve(res.data)
			},
			fail: (error) => {
				console.log(JSON.stringify(error))
				reject(error)
			}
		})
	})
}
var uploadFile = function(url,filePath,fileName,formData){
	var _url = API_URL + url;
	var userInfo = validation();
	var userId = userInfo.userId + '';
	var token = userInfo.token + '';
	uni.uploadFile({
		url:_url,
		method:'post',
		header:{
			'userId': userId,
			'token': token
		},
		dataType:'application/text',
		filePath:filePath,
		name:fileName,
		formData:formData,
		success:function(res){
			console.log(JSON.stringify(res));
		},
		fail:function(err){
			console.log(JSON.stringify(err))
		}
		
	})
}
var downloadFile = function(url){
	var _url = API_URL + url;
	var userInfo = validation();
	var userId = userInfo.userId + '';
	var token = userInfo.token + '';
	uni.downloadFile({
		url:_url,
		header:{
			'userId': userId,
			'token': token
		},
		success:function(res){
			console.log(JSON.stringify(res));
		},
		fail:function(err){
			console.log(JSON.stringify(err));
		}
	})
}
// 获取身份验证信息
var validation = function(){
	return uni.getStorageSync("userInfo");
}
export default {
	validation:validation,
	init:function(url){
		API_URL = url
	},
	request:request,
	login:function(data){
		var _url = API_URL + "/app/login";
		return new Promise(function(resolve, reject){
			uni.request({
				url:_url,
				method:"POST",
				header: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				data:data,
				success: (res) => {
					// console.log(JSON.stringify(res))
					resolve(res.data)
				},
				fail: (error) => {
					// console.log(JSON.stringify(error))
					reject(error)
				}
			})
		})
	},
	//上传通话记录和录音文件
	insertionCallLog(filePath,formData){
		uploadFile("/call/insertCall",filePath,"file",formData);
	},
	//获取客户列表
	getClientList(option){
		return request("/client/getStarsClient/" + validation().userId + "/" + option,"GET",{});
	},
	//获取用户所有通话记录
	getCalls(option,pageIndex,pageSize){//0为已接通，1为未接通，2全部
		return request("/call/getCalls/" + validation().userId + "/" + option + "/" + pageIndex + "/" + pageSize,"GET",{})
	},
	//获取用户的统计数据
	getStatistics(fate){//fate为天数
		return request("/statistics/getData/" + validation().userId + "/" + fate,"GET",{})
	},
	//获取用户与单个客户的通话记录
	getCallList(data){
		return request("/call/getListCall","GET",data)
	},
	//添加客户
	addClient(data){
		return request("/client/insertClient","POST",data)
	},
	//批量添加用户
	insertClients(clientList){
		return request("/client/insertClients","POST",{'clientList':clientList})
	}
}
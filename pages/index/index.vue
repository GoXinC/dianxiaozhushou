<template>
	<view class="content">
		<view class="head">
			<input type="number" class="input-phone" v-model="phone" />
			<view class="call-number">Tips:本周累计呼出{{number}}次</view>
			<button class="call-button" @click="call(phone)">立即拨打</button>
		</view>
		<view class="neck">
			<block v-for="(item,index) in neck" :key="index">
				<view class="neck-item content" @click="neckRoute(item.url)">
					<image class="neck-img" mode="widthFix" :src="item.img"></image>
					<view class="neck-name">{{item.name}}</view>
				</view> 
			</block>
		</view>
		<view class="notice">
			<view class="notice-title">最新公告</view>
			<view class="notice-content">电销助手V1.0版将上线试运营啦！</view>
			<view><uni-icons type="arrowright" size="15"></uni-icons></view>
		</view>
		<view class="region">
			<view class="region-title">通话专区</view>
			<view class="region-content">
				<navigator class="region-content-block block-left" url="prefecture/BatchImport">
					<view class="block-title">批量导入客户</view>
					<view class="block-describe">导入所有客户信息</view>
				</navigator>
				<navigator class="region-content-block block-right" url="prefecture/addClient">
					<view class="block-title">客户管理</view>
					<view class="block-describe">添加/修改客户资料</view>
				</navigator>
			</view>
		</view>
		<view class="region">
			<view class="region-title">最近联系人</view>
			<view class="region-tag">
				<view class="tag-list" v-for="(item,index) in tagList" :key="index" >
					<uni-tag :text="item.content" type="primary" :inverted="item.check" size="small" circle="true"></uni-tag>
				</view>
			</view>
			<block v-for="(item,index) in callLogList" :key="index">
				<tel :callLog="item" @callPhone="call"></tel>
			</block>
		</view>
	</view>
</template>

<script>
	import uniIcons from "@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue";
	import uniTag from "@dcloudio/uni-ui/lib/uni-tag/uni-tag.vue";
	import android from "../../servier/android.js";
	import API from "../../servier/dxb-ajax.js";
	import tel from "../../components/list-item/tel-list.vue";
	import {formatTime,nesgame} from "../../utils/utils.js";
	export default {
		data() {
			return {
				number: '',
				phone:'',
				neck:[{
					img:'/static/statis.png',
					name:'数据统计',
					url:''
				},{
					img:'/static/record.png',
					name:'通话记录',
					url:'./callLog'
				},{
					img:'/static/call.png',
					name:'快速拨号',
					url:'./speedDial'
				}] ,
				tagList:[{
					content:"最近10次",
					check:false
				},{
					content:"意向客户",
					check:true
				}],
				callLogList:[],
				voicePath:'',
				callStartTime:'',
				callEndTime:'',
				date:'',
				duration:''
			}
		},
		onLoad() {
			var userInfo = uni.getStorageSync("userInfo");
			if(userInfo){
				console.log(JSON.stringify(userInfo));
				let self = this;
				//获取本周呼出次数
				self.getStatistics().then(function(res){
					self.number = res ;
				})
				//获取最近10次通话记录
				self.getCallLog().then(function(res){
					// console.log(JSON.stringify(res))
					self.callLogList = res ;
				})
				//录音结束回调
				android.recorderManager.onStop(function (res) {
					console.log('recorder stop' + JSON.stringify(res));
					self.voicePath = res.tempFilePath;//录音临时文件地址
					var ta = self.callLog();
					// var ta = {
					// 	name:"name",
					// 	phone:"10086",
					// 	duration:"5",
					// 	date:"1584236830478",
					// 	type:"1"
					// }
					var userId = uni.getStorageSync("userInfo").userId;//获取用户Id
					var startTime = formatTime(new Date(new Number(self.date)));
					var endTime = formatTime(new Date());
					var state = self.duration==0 ? "1" : "0";
					var data = {
						phone: self.phone,
						state: state,
						userId: userId,
						duration: self.duration,
						callStartTime:startTime,
						callEndTime:endTime,
					}
					console.log(JSON.stringify(data));
					//插入通话记录
					API.insertionCallLog(res.tempFilePath,data)
					// uni.showModal({
					//     title: '提示',
					//     content: ta.name + "-" + ta.duration + "-" + ta.date,
					//     success: function (res) {
					//         if (res.confirm) {
					//             console.log('用户点击确定');
					//         } else if (res.cancel) {
					//             console.log('用户点击取消');
					//         }
					//     }
					// });
				});
			}else{
				uni.redirectTo({
					url:"../login/login"
				})
			}
			
		},
		onPullDownRefresh() { // 下拉监听事件
			console.log('refresh');
			var self = this
			//获取本周呼出次数
			self.getStatistics().then(function(res){
				self.number = res ;
			})
			//获取最近10次通话记录
			self.getCallLog().then(function(res){
				// console.log(JSON.stringify(res))
				self.callLogList = res ;
			})
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		methods: {
			//拨号
			call(phone) {
				this.phone = phone;
				// android.insertRecords();
				android.dialOut(this.dialOutBack);//监听电话是否拨出
				android.callPhone(phone); //拨号
			},
			//电话拨出回调
			dialOutBack(){
				console.log("start")
				this.startRecord();
				console.log("end")
				android.hangUp(this.endRecord); //监听用户挂断
			},
			//获取通话记录
			async getCallLog(){
				var logLength = await API.getCalls(2,1,10);
				return logLength.list
			},
			async getStatistics(){
				var List = await API.getStatistics(7);
				var number = 0;
				List.forEach(item =>{
					if(item.callNumber){
						number += item.callNumber
					}
				})
				return number;
			},
			playVoice() {
				console.log('播放录音' + this.voicePath);
				if (this.voicePath) {
					this.innerAudioContext.src = this.voicePath;
					this.innerAudioContext.play();
				}
			},
			//根据手机号获取客户id
			async getClientId(){
				var clientList = await API.getClient();
				console.log(JSON.stringify(this.phone));
				console.log(JSON.stringify(clientList));
				for(let i = 0; i < clientList.length; i++){
				    if(nesgame(clientList[i].customerPhone) == nesgame(this.phone)){
						console.log(JSON.stringify(clientList[i]));
						return clientList[i].id;
					}
				}
				return -1;
			},
			// 颈部路由
			neckRoute(url){
				console.log(url)
				uni.navigateTo({
					url:url
				})
			},
			startRecord:function() {
				// this.callStartTime = formatTime(new Date());
			    android.startRecord()
			},
			pauseRecord:function() {
			    android.pauseRecord();
			},
			resumeRecord:function() {
			    android.resumeRecord();
			},
			endRecord:function() {
				// this.callEndTime = formatTime(new Date());
				android.endRecord();
			},//获取通话记录
			callLog:function(){
				// plus.android.requestPermissions(['android.permission.READ_CALL_LOG', 'android.permission.WRITE_CALL_LOG', 'android.permission.CALL_PHONE']
				// 获取主Activity对象的实例 
				const main = plus.android.runtimeMainActivity();  
				var CallLog = plus.android.importClass("android.provider.CallLog");
				var ContentResolver = plus.android.importClass("android.content.ContentResolver");  
				var resolver = main.getContentResolver();  
				plus.android.importClass(resolver);  
				var String = plus.android.importClass("java.lang.String");
				var cursor = resolver.query(CallLog.Calls.CONTENT_URI, null, null, null, CallLog.Calls.DEFAULT_SORT_ORDER);  
				
				plus.android.invoke(cursor,"moveToFirst")
				let name = plus.android.invoke(cursor, "getString", plus.android.invoke(cursor, "getColumnIndex", CallLog.Calls.CACHED_NAME));
				let phone = plus.android.invoke(cursor, "getString", plus.android.invoke(cursor, "getColumnIndex", CallLog.Calls.NUMBER));
				let duration = plus.android.invoke(cursor, "getString", plus.android.invoke(cursor, "getColumnIndex", CallLog.Calls.DURATION));
				let date = plus.android.invoke(cursor, "getString", plus.android.invoke(cursor, "getColumnIndex", CallLog.Calls.DATE));
				let type = plus.android.invoke(cursor, "getString", plus.android.invoke(cursor, "getColumnIndex", CallLog.Calls.TYPE));
				// var talist = {
				// 	name:name,
				// 	phone:phone,
				// 	duration:duration,
				// 	date:date,
				// 	type:tpye
				// }
				this.duration = duration;
				this.date = date;
			}
		},
		components:{
			uniIcons,
			uniTag,
			tel
		}
		
	}
</script>

<style scoped lang="scss">
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 20rpx;
		font-size: 30rpx;
		.head{
			width: 100%;
			height: 300rpx;
			position: relative;
			background-image: linear-gradient(to bottom right, $dxb-theme-board-left, $dxb-theme-board-right);
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			border-radius: 10rpx;
			.input-phone{
				height: 20rpx;
				width: 60%;
				text-align: center;
				color: white;
				font-size: 60rpx;
				font-weight: 500;
				border-bottom: 2px solid white;
			}
			.call-number{
				font-size: $dxb-text-xs;
				color: white;
			}
			.call-button{
				position: absolute;
				bottom: -25px;
				height: 50px;
				background-color: white;
				color: $dxb-theme-color;
				box-shadow: 1px 1px 2px $dxb-theme-color;
				font-weight: bold;
				border-radius: 100px;
				width: 50%;
			}
		}
		.neck{
			width: 100%;
			margin-top: 50rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			.neck-item{
				width: 33%;
				.neck-img{
					width:30%;
				}
				.neck-name{
					font-size: $dxb-text-m;
				}
			}
		}
		.notice{
			width: 100%;
			display: flex;
			margin-top: 30rpx;
			align-items: center;
			justify-content: space-between;
			.notice-title{
				font-weight: 400;
				color: $dxb-theme-color;
				font-size: $dxb-text-m;
				border-bottom: 3px solid $dxb-theme-tint-color;
			}
			.notice-content{
				font-size: $dxb-text-s;
			}
		}
		.region{
			width: 100%;
			height: 200rpx;
			margin-top: 30rpx;
			.region-title{
				border-left: 3px solid $dxb-theme-color;
				padding-left: 20rpx;
				margin-bottom: 20rpx;
			}
			.region-content{
				width: inherit;
				height: 145rpx;
				display: flex;
				.region-content-block{
					width: 50%;
					height: inherit;
					border-radius: 10rpx;
					box-sizing:border-box;
					padding-top: 30rpx;
					padding-left: 20rpx;
					.block-title{
						font-weight: bold;
						font-size: $dxb-text-m;
						color: $dxb-theme-color;
						margin-bottom: 15rpx;
					}
					.block-describe{
						font-size: $dxb-text-s;
					}
				}
				.block-left{
					margin-right: 5px;
					background-color: #ebfdff;//$dxb-theme-thin-color;
				}
				.block-right{
					margin-left: 5px;
					background-color: #eafcf0;//$dxb-theme-tint-color;
				}
			}
			.region-tag{
				display: flex;
				font-size: $dxb-text-xs;
				.tag-list{
					margin: 5rpx;
				}
			}
		}
	}
</style>
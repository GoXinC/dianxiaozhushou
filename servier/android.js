const recorderManager = uni.getRecorderManager(); //录音管理对象
const innerAudioContext = uni.createInnerAudioContext(); //录音播放上下文
innerAudioContext.autoplay = true; //是否播放录音
const main = plus.android.runtimeMainActivity();
//监听用户电话拨出状态
// var dialOut = function(operation){
// 		// var main = plus.android.runtimeMainActivity(); //获取activity
// 		var receiver = plus.android.implements('io.dcloud.feature.internal.reflect.BroadcastReceiver', {
// 			onReceive: function(context, intent) { //实现onReceiver回调函数
// 				// plus.android.importClass(intent);
// 				operation();
// 				main.unregisterReceiver(receiver);//注销广播
// 				console.log("注销拨出广播");
				
// 			}
// 		});
// 		var IntentFilter = plus.android.importClass('android.content.IntentFilter');
// 		var Intent = plus.android.importClass('android.content.Intent');
// 		var filter = new IntentFilter();
// 		filter.addAction(Intent.ACTION_NEW_OUTGOING_CALL); //监听电话是否拨出
// 		main.registerReceiver(receiver, filter); //注册监听 
// 		console.log("注册拨出广播")
// 	};
// //监听用户挂断电话状态
// var hangUp = function(operation){
// 		var _t = this;
// 			// 
// 		try{
// 			if(uni.getSystemInfoSync().platform == 'android'){      //Android
// 			// var main = plus.android.runtimeMainActivity();  
// 			var Context = plus.android.importClass("android.content.Context");  
// 			var telephonyManager = plus.android.importClass("android.telephony.TelephonyManager");  
// 			var telephonyManager=plus.android.runtimeMainActivity().getSystemService(Context.TELEPHONY_SERVICE);  
// 			var receiver=plus.android.implements('io.dcloud.android.content.BroadcastReceiver', {  
// 					onReceive: function(context, intent) { 
// 						plus.android.importClass(intent);  
// 						console.log(intent.getAction());  
// 						var telephonyManager = plus.android.importClass("android.telephony.TelephonyManager");  
// 						var telephonyManager=plus.android.runtimeMainActivity().getSystemService(Context.TELEPHONY_SERVICE);  
// 						var phonetype=telephonyManager.getCallState();  
// 						var phoneNumber = intent.getStringExtra(telephonyManager.EXTRA_INCOMING_NUMBER);  
// 						console.log("phonetype:"+phonetype);  //电话状态 0->空闲状态  1->振铃状态  2->通话存在  
// 						console.log("phoneNumber:"+phoneNumber);  //电话号
// 						if(phonetype == 0){
// 							operation();
// 							main.unregisterReceiver(receiver);
// 							console.log("注销挂断广播");
// 						}
// 					}  
// 			});  
// 			var IntentFilter = plus.android.importClass('android.content.IntentFilter');  
// 			var filter = new IntentFilter();  
// 			filter.addAction(telephonyManager.ACTION_PHONE_STATE_CHANGED);   
// 			main.registerReceiver(receiver, filter);  
// 			console.log("注册挂断广播")
		
// 			}else if(uni.getSystemInfoSync().platform == 'ios'){              //ios
// 				var callstatus=false
// 				var CTCall = plus.ios.importClass('CTCall');  
// 				var CTCallCenter = plus.ios.importClass('CTCallCenter');  
// 				var center = new CTCallCenter();  
// 				center.init()  
// 				center.setCallEventHandler(function(){  
// 				    console.log('空闲状态->',callstatus)   
					
// 					callstatus=!callstatus
// 					_t.state.push({state:callstatus?'存在通话':'空闲状态',time:dateFormat('hh:mm:ss')})
// 					console.log(_t.state)
// 				})
// 			}
			
// 		}catch(err){console.log(err)}
// 			// 
// 	};
// var hangUpBack = function(){
// 	this.startRecord();
// 	hangUp(this.endRecord);
// };
// var insertRecords = function(){
// 	dialOut(this.hangUpBack);
// };
var startRecord = function() {
    this.recorderManager.start();
	var stateTime = formatTime(new Date());
	console.log(stateTime);
	console.log('开始录音');
};
var pauseRecord = function() {
	this.recorderManager.pause();
    console.log('暂停录音');
};
var resumeRecord = function() {
    this.recorderManager.resume();
    console.log('继续录音');
};
var endRecord = function() {
    this.recorderManager.stop();
	var endTime = foematTime(new Date());
	console.log(endTime);
	console.log('录音结束');
};
import API from "./dxb-ajax.js";
import {formatTime} from "../utils/utils.js"
export default {
	recorderManager:recorderManager,
	innerAudioContext:innerAudioContext,
	// insertRecords:insertRecords,
	//拨号
	callPhone:function(phone) {
		// 获取主Activity对象的实例 
		// const main = plus.android.runtimeMainActivity();
	    var Intent = plus.android.importClass("android.content.Intent");  
	    var Uri = plus.android.importClass("android.net.Uri");  
	    var uri = Uri.parse("tel:"+phone); 
	    var call = new Intent("android.intent.action.CALL",uri);  
	    // 调用startActivity方法拨打电话  
	    main.startActivity( call );
	},
	//监听用户电话拨出状态
	dialOut:function(operation){
		// var main = plus.android.runtimeMainActivity(); //获取activity
		var receiver = plus.android.implements('io.dcloud.feature.internal.reflect.BroadcastReceiver', {
			onReceive: function(context, intent) { //实现onReceiver回调函数
				// plus.android.importClass(intent);
				console.log("open")
				operation();
				main.unregisterReceiver(receiver);//注销广播
				console.log("注销拨出广播");
				
			}
		});
		var IntentFilter = plus.android.importClass('android.content.IntentFilter');
		var Intent = plus.android.importClass('android.content.Intent');
		var filter = new IntentFilter();
		filter.addAction(Intent.ACTION_NEW_OUTGOING_CALL); //监听电话是否拨出
		main.registerReceiver(receiver, filter); //注册监听 
		console.log("注册拨出广播")
	},
	//监听用户挂断电话状态
	hangUp:function(operation){
		var _t = this;
			// #ifdef APP-PLUS
		try{
			if(uni.getSystemInfoSync().platform == 'android'){      //Android
			// var main = plus.android.runtimeMainActivity();  
			var Context = plus.android.importClass("android.content.Context");  
			var telephonyManager = plus.android.importClass("android.telephony.TelephonyManager");  
			var telephonyManager=plus.android.runtimeMainActivity().getSystemService(Context.TELEPHONY_SERVICE);  
			var receiver=plus.android.implements('io.dcloud.android.content.BroadcastReceiver', {  
					onReceive: function(context, intent) { 
						plus.android.importClass(intent);  
						console.log(intent.getAction());  
						var telephonyManager = plus.android.importClass("android.telephony.TelephonyManager");  
						var telephonyManager=plus.android.runtimeMainActivity().getSystemService(Context.TELEPHONY_SERVICE);  
						var phonetype=telephonyManager.getCallState();  
						var phoneNumber = intent.getStringExtra(telephonyManager.EXTRA_INCOMING_NUMBER);  
						console.log("phonetype:"+phonetype);  //电话状态 0->空闲状态  1->振铃状态  2->通话存在  
						console.log("phoneNumber:"+phoneNumber);  //电话号
						if(phonetype == 0){
							operation();
							main.unregisterReceiver(receiver);
							console.log("注销挂断广播");
						}
					}  
			});  
			var IntentFilter = plus.android.importClass('android.content.IntentFilter');  
			var filter = new IntentFilter();  
			filter.addAction(telephonyManager.ACTION_PHONE_STATE_CHANGED);   
			main.registerReceiver(receiver, filter);  
			console.log("注册挂断广播")
		
			}else if(uni.getSystemInfoSync().platform == 'ios'){              //ios
				var callstatus=false
				var CTCall = plus.ios.importClass('CTCall');  
				var CTCallCenter = plus.ios.importClass('CTCallCenter');  
				var center = new CTCallCenter();  
				center.init()  
				center.setCallEventHandler(function(){  
				    console.log('空闲状态->',callstatus)   
					
					callstatus=!callstatus
					_t.state.push({state:callstatus?'存在通话':'空闲状态',time:dateFormat('hh:mm:ss')})
					console.log(_t.state)
				})
			}
			
		}catch(err){console.log(err)}
			// #endif
	},
	//获取通话记录
	callLog:function(){
		// plus.android.requestPermissions(['android.permission.READ_CALL_LOG', 'android.permission.WRITE_CALL_LOG', 'android.permission.CALL_PHONE']
		// 获取主Activity对象的实例 
		// const main = plus.android.runtimeMainActivity();  
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
		var talist = {
			name:name,
			phone:phone,
			duration:duration,
			date:date,
			type:tpye
		}
		return talist;
		// return client;
		// while(plus.android.invoke(cursor,"moveToNext")){
			
		// 	talist.push({
		// 		name:name,
		// 		phone:phone,
		// 		duration:duration,
		// 		date:date,
		// 		type:tpye
		// 	})
		// 	console.log("111")
		// 	console.log("Call Log:" + name + ",phone:" + phone + "时长:" + duration + "时间:" + date + ",类型:" + type);
		// }
		// return plus.android.invoke(cursor,"getColumnCount")
	},
	startRecord,
	pauseRecord,
	resumeRecord,
	endRecord,
}
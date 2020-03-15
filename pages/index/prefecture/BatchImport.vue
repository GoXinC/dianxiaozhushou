<template>
	<view class="content">
		<input v-if="contacts.length>0 || isSearch" class="search" type="text" placeholder="搜索联系人" @input="onSearchInput" />
		<view class="con-flex">
			<checkbox-group @change="changeAll">
				<checkbox value="all" :checked="check">全选</checkbox>
			</checkbox-group>
			<button @click="imports" class="con-btn" type="primary">导入</button>
		</view>
		<view v-if="contacts.length>0">
			<scroll-view class="contact-scroll" scroll-y :scroll-into-view="scrollViewId">
				<checkbox-group @change="change">
				<view class="box" v-for="(item,key) in contacts" :key="key">
					<view class="divider" :id="item.letter">
						<text class="divider-text">{{item.letter}}</text>
					</view>
						<view class="item" hover-class="hover" hover-start-time="20" v-for="(contact,index) in item.contacts" :key="index" @click='onSelectClick(contact)'>
								<checkbox :value="contact" :checked="checked" class="con-check"></checkbox>
								<image class="portrait" src="../../../static/touxiang.png" mode="aspectFill"></image>
								<view class="name">{{contact.name}}</view>
		
						</view>
				</view>
				</checkbox-group>
			</scroll-view>
			<view class="indexBar-bg">
				<view class="indexBar" catchtouchmove>
					<view class="indexBar-box" @touchstart="tStart" @touchend="tEnd" @touchmove="tMove">
						<view class="indexBar-item" v-for="(item,index) in contacts" :key="index" :id="item.letter" @touchstart="getCur"
						 @touchend="setCur">
							{{item.letter}}
						</view>
					</view>
				</view>
			</view>
			<view v-show="!hidden" class="indexToast">{{letter}}</view>
		</view>
		<text v-else class="no-contact">通讯录暂无联系人</text>
	</view>
</template>

<script>
	import pinyin from '../../../common/pinyin/pinyin3.js';
	import API from '../../../servier/dxb-ajax.js';
	var platform = uni.getSystemInfoSync().platform

	export default {
		data() {
			return {
				/* 侧边栏选择器 */
				scrollViewId: "wo",
				letter: "",
				boxTop: 0,
				barHeight: 0,
				minHeight: 0,
				hidden: true,
				/* 联系人 */
				contacts: [],
				contactItems: [],
				SelectionList:[],
				isSearch: false,
				isShow: false,
				check:false,
				checked:false
			}
		},
		onLoad() {
			const res = uni.getSystemInfoSync();
			this.barHeight = res.windowHeight / 27;
			//初始通讯录
			this.initContacts()
		},
		onReady() {
			var that = this
			uni.createSelectorQuery().select('.indexBar-box').boundingClientRect(function(e) {
				if (e != null) {
					that.boxTop = e.top
				}
			}).exec()
			/* uni.createSelectorQuery().select('.indexBar-item').boundingClientRect(function(e) {
				if(e != null){
					that.barHeight = e.height
				}
			}).exec() */
		},
		methods: {
			changeAll(e){
				this.checked = !this.checked
				if(e.detail.value=='all'){
					this.SelectionList = this.getClientlist(this.contacts);
				}else{
					this.SelectionList = [];
				}
				console.log(JSON.stringify(this.SelectionList.length))
			},
			getClientlist(contacts){
				var list = []
				contacts.forEach(item=>{
					item.contacts.forEach(it=>{
						list.push(it)
					})
				})
				// for(var item of contacts){
				// 	list.concat(item.contact)
				// }
				console.log(JSON.stringify(list));
				console.log(JSON.stringify(list.length));
				return list
			},
			change(e){
				this.SelectionList = e.detail.value;
				console.log(JSON.stringify(this.SelectionList.length))
			},
			// 导入
			imports(){
				console.log(JSON.stringify(this.SelectionList))
				var clientList = [];
				var userId = uni.getStorageSync("userInfo").userId + '';
				this.SelectionList.forEach(item =>{
					clientList.push({
						customerName:item.name,
						customerPhone:item.phone,
						userId:userId
					});
				})
				API.insertClients(clientList).then(function(res){
					uni.showToast({
					    title: '添加成功',
						icon: 'success',
					    duration: 2000
					});
					uni.navigateBack();
				})
			},
			/*
			 * 滑动的侧边选择器
			 */
			getCur(e) {
				this.hidden = false
				this.letter = e.target.id
			},
			setCur(e) {
				this.hidden = true;
				this.letter = e.target.id
			},
			tMove(e) {
				var y = e.touches[0].clientY
				var offsettop = this.boxTop
				//判断选择区域,只有在选择区才会生效
				if (y > offsettop) {
					var num = Math.floor((y - offsettop) / this.barHeight);
					if (num < this.contacts.length) {
						this.letter = this.contacts[num].letter
						this.scrollViewId = this.letter
					}
				}
			},
			tStart() {
				this.hidden = false
			},
			tEnd() {
				this.hidden = true;
			},
			/* 
			 * 初始化通讯录
			 */
			initContacts: function() {
				//获取手机通讯录
				plus.contacts.getAddressBook(plus.contacts.ADDRESSBOOK_PHONE, (addressbook) => {
					// 可通过addressbook进行通讯录操作
					addressbook.find(["displayName", "phoneNumbers"], (contacts) => {
						var items = [];
						for (var i = 0; i < contacts.length; i++) {
							if (contacts[i].phoneNumbers.length > 0) {
								var contact = {
									'name': contacts[i].displayName,
									'phone': contacts[i].phoneNumbers[0].value
								};
								items.push(contact);
							}
						}
						this.contacts = pinyin.paixu(items)
						this.contacts.sort(function(o1, o2) {
							return o1.letter.charCodeAt(0) - o2.letter.charCodeAt(0)
						})
						this.contactItems = JSON.parse(JSON.stringify(this.contacts))
					}, (e) => {
						this.onAddressBookSetting()
					});
				}, (e) => {
					this.onAddressBookSetting()
				});
			},
			/*
			 * 权限设置
			 */
			onAddressBookSetting: function() {
				if (this.isShow) {
					return
				}
				this.isShow = true
				uni.showModal({
					title: '提示',
					content: 'APP通讯录权限没有开启，是否开启？',
					success(res) {
						if (res.confirm) {
							if (platform == 'ios') {
								var UIApplication = plus.ios.import("UIApplication");
								var NSURL2 = plus.ios.import("NSURL");
								var setting2 = NSURL2.URLWithString("app-settings:");
								var application2 = UIApplication.sharedApplication();
								application2.openURL(setting2);
								plus.ios.deleteObject(setting2);
								plus.ios.deleteObject(NSURL2);
								plus.ios.deleteObject(application2);
							} else {
								var main = plus.android.runtimeMainActivity();
								var bulid = plus.android.importClass("android.os.Build");
								var Intent = plus.android.importClass('android.content.Intent');
								if (bulid.VERSION.SDK_INT >= 9) {
									var intent = new Intent('android.settings.APPLICATION_DETAILS_SETTINGS');
									var Uri = plus.android.importClass('android.net.Uri');
									var uri = Uri.fromParts("package", main.getPackageName(), null)
									intent.setData(uri);
									intent.putExtra('android.content.Intent.setFlags', Intent.FLAG_ACTIVITY_NEW_TASK);
								} else if (bulid.VERSION.SDK_INT <= 8) {
									var intent = new Intent(Intent.ACTION_VIEW);
									intent.setClassName("com.android.settings", "com.android.settings.InstalledAppDetails");
									intent.putExtra("com.android.settings.ApplicationPkgName", main.getPackageName());
									intent.putExtra('android.content.Intent.setFlags', Intent.FLAG_ACTIVITY_NEW_TASK);
								}
								main.startActivity(intent);
								this.isShow = false
							}
						} else {
							uni.navigateBack({
								delta: 1
							})
						}
					}
				})
			},
			/* 
			 * 点击联系人
			 */
			onSelectClick: function(contact) {
				// console.log(contact)
				// uni.showActionSheet({
				// 	itemList: ['电话联系'],
				// 	success: (e) => {
				// 		if (e.tapIndex == 0) {
				// 			uni.makePhoneCall({
				// 				phoneNumber: contact.phone
				// 			});
				// 		}
				// 	}
				// })
			},
			/* 
			 * 搜索
			 */
			onSearchInput: function(e) {
				var searchVal = e.detail.value
				console.log(searchVal)
				this.isSearch = true
				if (searchVal == '') {
					this.contacts = JSON.parse(JSON.stringify(this.contactItems))
					this.isSearch = false
				} else {
					var showList = []
					var list = []
					list = JSON.parse(JSON.stringify(this.contactItems))
					list.forEach((item, index1) => {
						var contacts = []
						item.contacts.forEach((contact, index2) => {
							for (var i = 0; i < searchVal.length; i++) {
								if (contact.name.indexOf(searchVal[i]) != -1) {
								// if (contact.name.includes(searchVal[i]) != false){
									var contain = false;
									contacts.find(function(val) {
										if (val.phone == contact.phone) {
											contain = true;
										}
									});
									if (!contain) {
										contacts.push(contact);
									}
								}
							}
						})
						if (contacts.length > 0) {
							var contacts = {
								letter: item.letter,
								contacts: contacts
							}
							showList = showList.concat(contacts)
						}
					})
					setTimeout(() => {
						this.contacts = JSON.parse(JSON.stringify(showList))
					}, 200)
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.content {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		width: 100%;
		height: 100%;
		.con-flex{
			display: flex;
			.con-btn{
				height: 32px;
				line-height: 32px;
				width: 80px;
			    background-color: #00d5c9;
				margin-left: 20px;
			}
		}
	}
	.con-check{
		margin-left: 10px;
	}
	.search {
		width: 80%;
		height: 70upx;
		display: flex;
		flex-flow: row nowrap;
		justify-content: center;
		align-content: center;
		text-align: center;
		font-size: 30upx;
		background-color: #f0f0f0;
		border-radius: 15upx;
		margin-top: 10upx;
		margin-bottom: 10upx;
	}

	.contact-scroll {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		width: 100vw;
		height: calc(100vh - 90upx);
	}

	.box {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		width: 100%;
	}

	.divider {
		width: 100%;
		background-color: #F0F0F0;
		padding: 5upx 0;
		color: #000;
	}
	
	.divider-text {
		margin-left: 20upx;
	}

	.item {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: flex-start;
		align-items: center;
		width: 100%;
		border-bottom: 1px solid #f0f0f0;
	}

	.portrait {
		width: 80upx;
		height: 80upx;
		padding: 15upx;
	}

	.name {
		font-size: 35upx;
	}

	.hover {
		background-color: #e7e7e7;
	}

	.indexBar-bg {
		height: 100vh;
		width: 60px;
		position: fixed;
		right: 0;
		top: 0;
		z-index: 1000;
	}

	.indexBar {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(0, -50%);
		display: flex;
		align-items: center;
		z-index: 1003;
	}

	.indexBar .indexBar-box {
		width: 60upx;
		height: auto;
		background: #fff;
		display: flex;
		flex-direction: column;
		box-shadow: 0 0 20upx rgba(0, 0, 0, 0.1);
		border-radius: 10upx;
		z-index: 1004;
	}

	.indexBar-item {
		flex: 1;
		width: 60upx;
		height: 60upx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24upx;
		color: #888;
		z-index: 1005;
	}

	.indexToast {
		position: fixed;
		top: 0;
		right: 80upx;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		width: 100upx;
		height: 100upx;
		border-radius: 10upx;
		margin: auto;
		color: #fff;
		line-height: 100upx;
		text-align: center;
		font-size: 48upx;
	}

	.no-contact {
		position: fixed;
		width: 100%;
		margin-top: 300upx;
		font-size: 35upx;
		color: #666666;
		text-align: center;
	}

	/* .search {
		position: fixed;
		width: 100vw;
		background-color: #FFFFFF;
		padding-top: 15upx;
	}

	.search .input {
		display: inline-block;
		width: 80vw;
		padding: 2px 0px 2px 0px;
		text-align: center;
		font-size: 30upx;
		background-color: #f0f0f0;
		margin-left: 10vw;
		border-radius: 15px;
	}

	.contact-scroll {
		position: fixed;
		margin-top: 90upx;
	}

	.contact-list {
		float: left;
		background-color: #FFFFFF;
		position: relative;
		width: 100%;
		display: flex;
		flex-direction: column;
	}

	.contact-list:after {
		position: absolute;
		z-index: 10;
		right: 0;
		bottom: 0;
		left: 0;
		height: 1upx;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #c8c7cc;
	}

	.contact-list:before {
		position: absolute;
		z-index: 10;
		right: 0;
		top: 0;
		left: 0;
		height: 1upx;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #c8c7cc;
	}

	.divider {
		background-color: #F0F0F0;
		padding: 5upx 0px 5upx 20upx;
		color: #000;
	}

	.item {
		position: relative;
		display: flex;
		flex-direction: row;
		align-items: center;
		width: 100%;
		float: right;
		border-bottom: 1px solid #f0f0f0;
	}

	.hover {
		background-color: #e7e7e7;
	}

	.portrait {
		display: inline-block;
		float: left;
		margin-left: 10upx;
		width: 80upx;
		height: 80upx;
		padding: 15upx;
	}

	.name {
		display: inline-block;
		float: left;
		margin: 0 0 0 10upx;
		font-size: 35upx;
	}

	.indexBar-bg {
		height: 100vh;
		width: 60px;
		position: fixed;
		right: 0px;
	}

	.indexBar {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(0, -50%);
		display: flex;
		align-items: center;
	}

	.indexBar .indexBar-box {
		width: 60upx;
		height: auto;
		background: #fff;
		display: flex;
		flex-direction: column;
		box-shadow: 0 0 20upx rgba(0, 0, 0, 0.1);
		border-radius: 10upx;
	}

	.indexBar-item {
		flex: 1;
		width: 60upx;
		height: 60upx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24upx;
		color: #888;
	}

	.indexToast {
		position: fixed;
		top: 0;
		right: 80upx;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		width: 100upx;
		height: 100upx;
		border-radius: 10upx;
		margin: auto;
		color: #fff;
		line-height: 100upx;
		text-align: center;
		font-size: 48upx;
	}

	.no-contact {
		position: fixed;
		width: 100%;
		margin-top: 300upx;
		font-size: 35upx;
		color: #666666;
		text-align: center;
	} */
</style>

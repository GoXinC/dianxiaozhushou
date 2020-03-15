<template>
	<view class="content">
		<block v-for="(item,index) in clientList" :key="index">
			<call :callList="item" @getPhone="quickCall"></call>
		</block>
	</view>
</template>

<script>
	import API from "../../servier/dxb-ajax.js";
	import call from "../../components/list-item/call-list.vue";
	export default {
		data() {
			return {
				clientList:[]
			}
		},
		components:{call},
		onLoad(){
			this.getClientList();
		},
		methods: {
			quickCall(phone){
				let pages = getCurrentPages();  //获取所有页面栈实例列表
				let nowPage = pages[ pages.length - 1];  //当前页页面实例
				let prevPage = pages[ pages.length - 2 ];  //上一页页面实例
				prevPage.$vm.phone = phone;   //修改上一页data里面的searchVal参数值为1211
				uni.navigateBack() //uni.navigateTo跳转的返回，默认1为返回上一级
			},
			async getClientList(){
				var clientList = await API.getClientList(1);
				console.log(JSON.stringify(clientList))
				this.clientList = clientList
			}
		}
	}
</script>

<style>

</style>

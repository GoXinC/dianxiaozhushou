<template>
	<view class="content">
		<ms-tabs :list="type" v-model="active" itemColor="#03A9F4" lineColor="#03A9F4" :lineAnimated="false"></ms-tabs>
		<text v-if="callLogList.length==0" class="no-contact">暂无通话记录</text>
		<block v-else v-for="(item,index) in callLogList" :key="index">
			<log :logList="item"></log>
		</block>
	</view>
</template>

<script>
	import API from "../../servier/dxb-ajax.js";
	import log from "../../components/list-item/log-list.vue";
	import msTabs from '../../components/list-item/ms-tabs.vue';
	export default {
		data() {
			return {
				callLogList:[],
				type: [{
						title: '全部'
					},{
						title: '未接通'
					},{
						title: '已接通'
					}
				],
				active: 0
			}
		},
		watch:{
			active() {
				var active = this.active-1
				this.getCalls(active,1,15);
				// console.log(this.active)  // 0
			}
		},
		onLoad(){
			// this.getCalls(this.callLogList);
			this.getCalls(-1,1,15);
		},
		methods: {
			async getCalls(option,pageIndex,pageSize){
				var calls = await API.getCalls(option,pageIndex,pageSize);
				this.callLogList = calls.list
			},
		},
		components:{log,msTabs}
	}
</script>

<style>
.no-contact {
		position: fixed;
		width: 100%;
		margin-top: 300upx;
		font-size: 35upx;
		color: #666666;
		text-align: center;
	}
</style>

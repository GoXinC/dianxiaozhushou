<template>
	<view class="content" @click="callPhone">
		<view class="list-one">
			<view>手机号码</view>
			<view class="tel-color">{{logList.phone}}</view>
		</view>
		<view class="list-two">
			<view>姓名</view>
			<view class="tel-color">{{logList.clientName ? logList.clientName : "非客户"}}</view>
		</view>
	</view>
</template>
	
<script>
	export default {
		props:['logList'],
		data(){
			return{
				
			}
		},
		methods:{
			callPhone(){
				this.$emit("getPhone",this.logList.phone);
			}
		}
	}
</script>

<style scoped lang="scss">
	.tel-color{
		color: $dxb-text-color-red;
	}
	.content{
		display: flex;
		justify-content: space-between;
		font-size: $uni-font-size-base;
		color: $uni-text-color-disable;
		padding: 15upx 30upx;
		.list-one{
		
		}
		.list-two{
			
		}
	}
</style>
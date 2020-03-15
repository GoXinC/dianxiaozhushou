<template>
	<view class="tel-list">
		<view class="list-one">
			<view>手机号码</view>
			<view class="tel-color">{{callLog.phone}}</view>
		</view>
		<view class="list-two">
			<view>姓名</view>
			<view class="tel-color">{{callLog.clientName ? callLog.clientName : "非客户"}}</view>
		</view>
		<view class="list-three" @click="callPeople">联系TA</view>
	</view>
</template>

<script>
	export default{
		props:['callLog'],
		data(){
			return{
				
			}
		},
		methods:{
			// 拨打电话
			callPeople(){
				this.$emit("callPhone",this.callLog.phone);
			}
		}
	}
</script>

<style scoped lang="scss">
	.tel-color{
		color: $dxb-text-color-red;
	}
	.tel-list{
		display: flex;
		justify-content: space-between;
		font-size: $uni-font-size-base;
		color: $uni-text-color-disable;
		padding: 15upx 30upx;
		.list-one{
		
		}
		.list-two{
			
		}
		.list-three{
			width: 100px;
			height: 35px;
			line-height: 35px;
			border-radius: 20px;
			background-color: #00d5c9;
			color: $uni-text-color-inverse;
			text-align: center;
			margin: auto 0;
		}
	}
</style>

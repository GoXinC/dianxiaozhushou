<template>
	<view class="center">
			<view class="center_top">
				<view class="mask">
					<view class="box">
						<image src="../../static/fumou-center-template/header.jpg"></image>
					</view>
					<view class="box-b">
						<view class="text-l">张三 (18270436554)</view>
					</view>
				</view>
				<view class="lask">
					<view class="lask-left">
						<view>通话时长</view>
						<view>03：32：00</view>
					</view>
					<view class="lask-right">
						<view>未接通次数</view>
						<view>3次 (当日)</view>
					</view>
				</view>
			</view>
			<view class="center_menu">
				<view class="menu_item" v-for="(item,index) in menus" :key="index" @click="share(index)">
					<image :src="item.icon" mode="aspectFill"></image>
					<text>{{item.name}}</text>
				</view>
			</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				menus: [{
						name: '客户提醒',
						icon: '../../static/fumou-center-template/1.png',
						key: 1,
					},
					{
						name: '通讯录',
						icon: '../../static/fumou-center-template/2.png',
						key: 2,
					},
					{
						name: '查询统计',
						icon: '../../static/fumou-center-template/3.png',
						key: 3,
					},
					{
						name: '购买激活码',
						icon: '../../static/fumou-center-template/4.png',
						key: 4,
					},
					{
						name: '设置',
						icon: '../../static/fumou-center-template/5.png',
						key: 5,
					},
					{
						name:'退出登入',
						icon:'../../static/fumou-center-template/6.png',
						key: 6,
					},
					

				]
			};
		},
		methods: {
			share(index){
				switch (index){
					// 客户提醒
					case 0:
						console.log(JSON.stringify(index));
						break;
					// 通讯录
					case 1:
						uni.switchTab({
						    url: '../address/index'
						});
						break;
					// 查询统计
					case 2:
						uni.switchTab({
						    url: '../statistics/index'
						});
						break;
					// 购买激活码
					case 3:
						console.log(JSON.stringify(index));
						break;
					// 设置
					case 4:
						console.log(JSON.stringify(index));
						break;
					// 退出登入
					case 5:
						console.log(JSON.stringify(index));
						uni.removeStorage({
						    key: 'userInfo',
						    success: function (res) {
								uni.redirectTo({
									url:"../login/login"
								})
						    }
						});
						break;
				}
			}
		},
		computed: {

		}
	}
</script>

<style lang="scss" scoped>
	page {
		height: 100%;
	}

	.center {
		height: 100%;
		&_top {
			height: 450upx;
			width: 100%;
			background-color:#00d5c9;
			color: $uni-text-color-inverse;
			position: relative;
			.mask {
				width: 50%;
				height: 50%;
				margin: auto;
				padding-top: 30upx;
				.box{
					width: 180upx;
					height: 180upx;
					background-color: $uni-text-color-inverse;
					border-radius: 50%;
					margin:auto;
					image{
						width: 100%;
						height: 100%;
						border-radius: 50%;
					}
				}
				.box-b{
					padding-top: 15upx;
					.text-l{
						// text-align: center;
					}
				}
			}
			.lask{
				display: flex;
				position: absolute;
				bottom: 20upx;
				left: 0;
				right: 0;
				font-size:$uni-font-size-lg;
				.lask-left{
					flex: 1;
					text-align: center;
					font-size:$uni-font-size-base;
					border-right: 1px solid #FFFFFF;
				}
				.lask-right{
					flex: 1;
					text-align: center;
					font-size:$uni-font-size-base;
				}
			}
		}

		&_box_bg {
			background: #00d5c9;
			position: relative;
			.profily {
				position: absolute;
				width: 90%;
				// border:1px solid #F7F7F7;
				margin: 0 auto;
				top: -100upx;
				left: 5%;
				background: #FEFEFE;
				padding: 35upx;
				box-sizing: border-box;
				box-shadow: 0px 2px 5px #EDEDED;
			}
		}
	}

	.base {
		display: flex;
		align-items: center;
		border-bottom: 2px solid #F6F6F6;
		padding-bottom: 35upx;
		position: relative;
		.profily_header {
			height: 120upx;
			width: 120upx;
			margin: auto;
			background-color: #00CEA5;
			// background-image: url('../../static/fumou-center-template/header.jpg');
			// background-size: 100%;
		}
		text {
			margin-left: 20px;
			font-size: 30upx;
		}
		
		image{
			position: absolute;
			height: 40upx;
			width: 40upx;
			right: 0px;
			top:0px;
		}
	}

	.order_status {
		display: flex;
		justify-content: space-between;
		margin-top: 35upx;
		background-color: #00d5c9;
		.status {
			width: 140upx;
			height: 100upx;;
			font-size: 24upx;
			text-align: center;
			letter-spacing: .5px;
			display: flex;
			flex-direction: column;
			.icon {
				width: 50upx;
				height: 50upx;
				margin: 0 auto;
				margin-bottom: 5px;
				
			}
		}
	}

	.baiban {
		background: #FEFEFE;
		// height: 300upx;
	}

	.center_menu {
		width: 100%;
		display: inline-block;

		.menu_item {
			font-size: 28upx;
			letter-spacing: 1px;
			padding: 14px 5%;
			background: #FEFEFE;
			overflow: hidden;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			position: relative;
			border-bottom: 1px solid #EFEFEF;

			&:hover {
				background: #F6F6F6 !important;
			}

			&::after {
				content: '';
				width: 30upx;
				height: 30upx;
				position: absolute;
				right: 5%;
				background: url('../../static/fumou-center-template/right.png') no-repeat;
				background-size: 100%;
			}

			text:nth-of-type(1) {
				margin-left: 10px;
			}

			image {
				width: 40upx;
				height: 40upx;
			}

			// &:nth-of-type(4) {
			// 	margin-top: 10px;
			// }
		}
	}
</style>

<template>
	<view class="content">
		<image class="login-img" src="../../static/logo.png" mode="widthFix"></image>
		<view class="login">
			<view class="input-box" >
				<uni-icons class="icon" type="person" size="20"></uni-icons>
				<input class="input" placeholder="用户名" v-model="username"/>
			</view>
			<view class="input-box" >
				<uni-icons class="icon" type="locked" size="20"></uni-icons>
				<input class="input" password="true" placeholder="密码" v-model="password"/>
			</view>
			<button @click="login" class="login-but">登录</button>
		</view>
	</view>
</template>

<script>
	import API from "../../servier/dxb-ajax.js";
	import uniIcons from "@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue";
	export default {
		data(){
			return{
				username:'',
				password:''
			}
		},
		methods:{
			login(){
				var data = {
					"username":this.username,
					"password":this.password
				}
				API.login(data).then(function(res){
					console.log(res)
					if(res.code==0){
						// userId和token存入缓存
						uni.setStorage({
							key:'userInfo',
							data:{
								userId:res.userId + '',
								token:res.token
							}
						})
						// 跳转首页
						uni.switchTab({
							url:"/pages/index/index"
						})
					}else{
						uni.showToast({
						    title: '登录失败',
						    duration: 1000
						});
					}
				})
			}
		},
		components:{
			uniIcons
		}
	}
</script>

<style scoped lang="scss">
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		.login-img{
			width: 100%;
		}
		.login{
			margin-top: 60rpx;
			.input-box{
				position: relative;
				border-bottom: 3rpx solid $dxb-theme-color;
				padding-left: 30rpx;
				.icon{
					position: absolute;
					left: 0px;
					top: 0px;
				}
				.input{
					margin: 20rpx;
				}
			}
			.login-but{
				width: 300rpx;
				height: 80rpx;
				margin-top: 80rpx;
				font-size: $dxb-text-m;
				background-color: #00aaff;
				color: #ffffff;
			}
		}
	}
</style>

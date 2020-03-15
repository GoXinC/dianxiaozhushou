<template>
	<view class="content">
		<view class="box">
			<text class="value">{{value}}</text>
		</view>
		<view class="btns">
			<button class="btn" @click="onOpenPromptClick()">打开提示框</button>
			<!-- #ifdef APP-PLUS -->
			<button class="btn" @click="onOpenContactClick()">打开通讯录</button>
			<!-- #endif -->
		</view>
		<yomol-prompt title="修改名称" :maxlength="500" defaultValue="yomol" ref="yomolPrompt" @onConfirm="onPromptConfirm"></yomol-prompt>
	</view>
</template>

<script>
	import yomolPrompt from '@/components/yomol-prompt/yomol-prompt.vue'
	
	export default {
		components: {
			yomolPrompt
		},
		data() {
			return {
				value: '这是一个示例'
			}
		},
		onLoad() {
			
		},
		onBackPress() {
			/* 
			 * 屏蔽返回键
			 */
			if (this.$refs.yomolPrompt.visible) {
				this.$refs.yomolPrompt.hide()
				return true
			}
		},
		methods: {
			/* 
			 * 打开提示框
			 */
			onOpenPromptClick() {
				this.$refs.yomolPrompt.show()
			},
			/* 
			 * 提示框输入的内容
			 */
			onPromptConfirm(e) {
				this.value = e
				console.log(this.value);
			},
			/* 
			 * 打开通讯录
			 */
			onOpenContactClick() {
				uni.navigateTo({
					url: '../template/yomol-contact/yomol-contact'
				})
			}
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		width: 100%;
		height: 100%;
		background-color: white;
	}

	.box{
		height: 27vh;
		width: 100%;
		display: flex;
		justify-content: center;
		align-content: center;
		padding-top: 50upx;
		border: 1px solid #888888;
	}
	
	.value {
		width: 100%;
		height: 100%;
		color: #C40000;
		font-size: 30upx;
		font-weight: 500;
		text-align: center;
	}

	.btns {
		width: 100%;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: flex-start;
		align-items: center;
		margin-top: 50upx;
	}

	.btn {
		width: 30vw;
		padding: 5upx 20upx;
		color: white;
		font-size: 30upx;
		background-color: #C40000;
		text-align: center;
		margin-top: 20upx;
	}
</style>

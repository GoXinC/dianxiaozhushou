## 说明

输入内容并返回内容的prompt组件
支持 title，默认值：defaultValue，输入最大长度：maxlength，主色：themeColor


## 用法

**父组件**

```html
<template>
	<view>
		<yomol-prompt title="修改名称" :maxlength="18" defaultValue="yomol" ref="yomolPrompt" @onConfirm="onPromptConfirm"></yomol-prompt>
	</view>
</template>
```

```js
<script>
	import yomolPrompt from '@/components/yomol/yomol-prompt.vue'
	export default {
		components:{
			yomolPrompt
		},
		data() {
			return {
				
			}
		},
		onBackPress() {
			/* 
			* 屏蔽返回键
			*/
			if(this.$refs.yomolPrompt.visible){
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
			* 输入内容
			*/
			onPromptConfirm(e){
				console.log(e);
			}
		}
	}
</script>
```
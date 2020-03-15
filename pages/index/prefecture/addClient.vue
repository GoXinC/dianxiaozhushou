<template>
	<view class="evan-form-show">
		<evan-form :hide-required-asterisk="hideRequiredAsterisk" ref="form" :model="info">
			<evan-form-item label="姓名：" prop="name">
				<input class="form-input" placeholder-class="form-input-placeholder" v-model="info.name" placeholder="请输入姓名" />
			</evan-form-item>
			<evan-form-item label="手机号：" prop="phone">
				<input class="form-input" placeholder-class="form-input-placeholder" v-model="info.phone" placeholder="请输入手机号" />
			</evan-form-item>
			<evan-form-item prop="source">
				<template slot="formItem">
					<view class="customize-form-item">
						<view class="customize-form-item__label">客户来源：</view>
						<radio-group @change="sourceChange">
							<label class="customize-form-item__radio" v-for="item in sources" :key="item.value">
								<view>
									<radio :value="item.value" :checked="item.value === info.source" />
								</view>
								<view class="customize-form-item__radio__text">{{item.name}}</view>
							</label>
						</radio-group>
					</view>
				</template>
			</evan-form-item>
			<evan-form-item prop="sex">
				<template slot="formItem">
					<view class="customize-form-item">
						<view class="customize-form-item__label">性别：</view>
						<radio-group @change="sexChange">
							<label class="customize-form-item__radio" v-for="item in sexes" :key="item.value">
								<view>
									<radio :value="item.value" :checked="item.value === info.sex" />
								</view>
								<view class="customize-form-item__radio__text">{{item.name}}</view>
							</label>
						</radio-group>
					</view>
				</template>
			</evan-form-item>
			<evan-form-item label="备注：" prop="desc">
				<textarea class="form-input textarea" placeholder-class="form-input-placeholder" v-model="info.desc" placeholder="请输入备注(0-30个字)" />
			</evan-form-item>
		</evan-form>
		<button @click="save" class="evan-form-show__button">保存</button>
	</view>
</template>

<script>
	import EvanForm from '@/components/evan-form/evan-form.vue'
	import EvanFormItem from '@/components/evan-form/evan-form-item.vue'
	import utils from '@/components/evan-form/utils.js'
	import API from '../../../servier/dxb-ajax.js'
	export default {
		components: {
			EvanForm,
			EvanFormItem
		},
		data() {
			return {
				hideRequiredAsterisk: false,
				sexes: [{
						name: '先生',
						value: '0'
					},
					{
						name: '女士',
						value: '1'
					}
				],
				sources:[{
					name: '电销',
					value: '0'
				},
				{
					name: '网络',
					value: '1'
				},
				{
					name: '人才',
					value: '2'
				},
				{
					name: '转介绍',
					value: '3'
				}],
				// 表单的内容必须初始化
				info: {
					name: '',
					desc: '',
					phone: '',
					sex: '',
					source:''
				},
				rules: {
					name: {
						required: true,
						message: '请输入姓名'
					},
					phone: [{
							required: true,
							message: '请输入手机号'
						},
						{
							validator: (rule, value, callback) => {
								// 注意这里如果用的是methods里的isMobilePhone将不生效
								if (this.$utils.isMobilePhone(value)) {
									callback()
								} else {
									callback(new Error('手机号格式不正确'))
								}
							}
						},
					],
					source:{
						required: true,
						message: '请选择来源'
					},
					sex: {
						required: true,
						message: '请选择性别'
					},
					desc: [{
							required: true,
							message: '请输入简介'
						},
						{
							min: 0,
							max: 30,
							message: '简介必须在0到30个字之间'
						}
					],
				}
			}
		},
		mounted() {
			// 这里必须放在mounted中，不然h5，支付宝小程序等会找不到this.$refs.form
			this.$refs.form.setRules(this.rules)
		},
		methods: {
			save() {
				this.$refs.form.validate((res) => {
					if (res) {
						var obj=this.info;
						console.log(obj);
						// uni.showToast({
						// 	title: '验证通过'
						// })
						var data = {
							userId:uni.getStorageSync("userInfo").userId,
							customerGender:obj.sex,
							customerName:obj.name,
							customerPhone:obj.phone,
							customerSource:obj.source,
							remark:obj.desc
						}
						API.addClient(data).then(function(res){
							console.log(res)
							uni.showToast({
							    title: '添加成功',
								icon: 'success',
							    duration: 2000
							});
							uni.navigateBack();
						})
					}
				})
			},
			hideReqired() {
				this.hideRequiredAsterisk = !this.hideRequiredAsterisk
			},
			isMobilePhone() {
				const reg = /^1\d{10}$/
				if (reg.test(value)) {
					return true
				}
				return false
			},
			isMobile(rule, value, callback) {
				if (this.$utils.isMobilePhone(value)) {
					callback()
				} else {
					callback(new Error('手机号格式不正确'))
				}
			},
			sexChange(e) {
				this.info.sex = e.detail.value
				// console.log(this.info.sex)
			},
			sourceChange(e){
				this.info.source = e.detail.value
				// console.log(this.info.source)
			}
		}
	}
</script>

<style lang="scss">
	.evan-form-show {
		padding: 0 30rpx;
		background-color: #fff;

		.form-input {
			font-size: 28rpx;
			color: #333;
			text-align: left;
			width: 100%;
			box-sizing: border-box;
			height: 60rpx;
			&.textarea{
				height: 240rpx;
				padding: 24rpx 0;
			}
		}

		.form-input-placeholder {
			font-size: 28rpx;
			color: #999
		}

		&__button {
			width: 100%;
			height: 88rpx;
			border-radius: 8rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 0;
			font-size: 36rpx;
			color: #fff;
			margin-top: 20rpx;
			background-color: #2D87D5;

			&::before,
			&::after {
				border: none;
			}
		}

		.customize-form-item {
			&__label {
				font-size: 28rpx;
				color: #333;
				margin-bottom: 16rpx;
			}

			&__radio {
				display: flex;
				align-items: center;
				margin-bottom: 16rpx;

				&__text {
					font-size: 28rpx;
					color: #333;
				}
			}
		}
	}
</style>

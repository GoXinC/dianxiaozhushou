<template>
	<view>
		<!-- <button @click="go">统计</button> -->
		<!-- Number柱状图Compent1 -->
		<view>
			<histogram-chart :dataAs="histogramData" canvasId="ht0" />
			<view style="text-align: center;line-height: 40px;">近一周接通数对比图</view>
		</view>
		<!-- 折线Line纯数字-->
		<view class="line">
			<line-chart canvasId="index_line_2" :dataAs="lineData2" />
			<view style="text-align: center;line-height: 40px;">近一周通话数折线图</view>
		</view>
	</view>
</template>

<script>
	import HistogramChart from '@/components/stan-ucharts/HistogramChart.vue';
	import LineChart from '@/components/stan-ucharts/LineChart.vue';
	import API from '../../servier/dxb-ajax.js';
	export default {
		name: 'Index',
		components: {
			HistogramChart,
			LineChart
		},
		data() {
			return {
				histogramData: {
					//总模板
					categories: [],
					series: [
						{
							name: '接通数', //数据名称
							data: [],
								// {
								// 	//(饼图、圆环图、玫瑰图为Number) 数据，如果传入null图表该处出现断点
								// 	value: 20, //	仅针对柱状图有效，主要作用为柱状图显示数值
								// 	color: '#f04864' //仅针对柱状图有效，主要作用为柱状图自定义颜色,可覆盖外框定义主题颜色
								// },
							show: true, //图形显示状态，配合点击图例显示状态，也可默认指定是否显示
							color: '#00aaff', //	图形颜色 不传入则使用系统默认配色方案 即统一柱状图颜色
							textSize: 12 //图形上方标注文字的字体大小
							//如涉及混合图表请看 http://doc.ucharts.cn/1172126
						},
						{
							name: '未接通数',
							data: [],
								// {
								// 	value: 40,
								// 	color: '#facc14'
								// },
							color:'#ff0000'
						}
					]
				},
				lineData2: {
					//数字的图--折线图数据
					categories: [],
					series: [
						{ name: '总通话数', data: [] },
						{ name: '已接通', data: [] },
						{ name: '未接通', data: [] }
					]
				},
			}
		},
		onLoad(){
			this.init();
		},
		onPullDownRefresh() { // 下拉监听事件
			console.log('refresh');
			this.init();
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		methods: {
			init(){
				var weekList = this.getWeekList();
				this.histogramData.categories = weekList;
				this.lineData2.categories = weekList;
				this.getStatisticsData();
			},
			go(){
				uni.navigateTo({
					url:"statistics"
				})
			},
			getStatisticsData(){
				var self = this
				API.getStatistics(7).then(function(res){
					var callNumber = [];
					var connect = [];
					var accessFailure = [];
					for(let i = 6;i >= 0; i--){
						self.lineData2.series[0].data.push(res[i].callNumber);
						self.lineData2.series[1].data.push(res[i].connect);
						self.lineData2.series[2].data.push(res[i].accessFailure);
						self.histogramData.series[0].data.push(res[i].connect);
						self.histogramData.series[1].data.push(res[i].accessFailure);
					}
						console.log(JSON.stringify(res))
				})
			},
			getWeekList(){
				var a = new Array("日", "一", "二", "三", "四", "五", "六");  
				var week = new Date().getDay()+1;
				var weekList = [];
				for(let i = 0; i < 5 ; i++){
					if(week+i>=7){
						week -= 7
					}
					// console.log(a[week + i]);
					weekList.push("星期" + a[week + i]);
				}
				weekList.push("昨天")
				weekList.push("今日")
				return weekList;
			}
		}
	}
</script>

<style scoped>

</style>

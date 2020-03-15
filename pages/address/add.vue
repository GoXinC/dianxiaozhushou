<template>
	<view class="client-list">
		<uniIndexedList :options="list" :showSelect="true" @click="selectClient"></uniIndexedList>
	</view>
</template>

<script>
	import uniIndexedList from "@dcloudio/uni-ui/lib/uni-indexed-list/uni-indexed-list.vue";
	import android from "../../servier/android.js";
	import cnchar from 'cnchar';
	export default {
		data(){
			return {
				clientList:[],
				list:[]
			}
		},
		onLoad(){
			this.sortList()
		},
		methods:{
			selectClient(e){
				console.log(JSON.stringify(e))
			},
			async sortList(){
				var clientList = await android.getContacts()
				var templist = [{
					"letter": "A",
					"data": []
				},{
					"letter": "B",
					"data": []
				},{
					"letter": "C",
					"data": []
				},{
					"letter": "D",
					"data": []
				},{
					"letter": "E",
					"data": []
				},{
					"letter": "F",
					"data": []
				},{
					"letter": "G",
					"data": []
				},{
					"letter": "H",
					"data": []
				},{
					"letter": "I",
					"data": []
				},{
					"letter": "J",
					"data": []
				},{
					"letter": "K",
					"data": []
				},{
					"letter": "L",
					"data": []
				},{
					"letter": "M",
					"data": []
				},{
					"letter": "N",
					"data": []
				},{
					"letter": "O",
					"data": []
				},{
					"letter": "P",
					"data": []
				},{
					"letter": "Q",
					"data": []
				},{
					"letter": "R",
					"data": []
				},{
					"letter": "S",
					"data": []
				},{
					"letter": "T",
					"data": []
				},{
					"letter": "U",
					"data": []
				},{
					"letter": "V",
					"data": []
				},{
					"letter": "W",
					"data": []
				},{
					"letter": "X",
					"data": []
				},{
					"letter": "Y",
					"data": []
				},{
					"letter": "Z",
					"data": []
				}]
				console.log(JSON.stringify(clientList))
				console.log("001")
				var map = [];
				for(let i = 0; i < clientList.length; i++){
					var name = clientList[i].displayName
					var initial = cnchar.spell(name)[0]
					var index = initial.charCodeAt()-65
					if(templist[index]){
						templist[index].data.push(name);
					}else{
						templist[index]={
							"letter": initial,
							"data": []
						}
					}
					// console.log(JSON.stringify(templist[index]))
				}
				this.list = templist
				// console.log(JSON.stringify(this.list))
			}
		},
		components:{
			uniIndexedList
		}
	}
</script>

<style scoped lang="scss">
	.client-list{
	}
</style>

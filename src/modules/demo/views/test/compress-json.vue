<template>
	<div class="page">
		<el-form>
			<el-form-item label="用户名" prop="username">
				<el-input
					v-model="textarea"
					:rows="10"
					type="textarea"
					placeholder="Please input"
				/>
			</el-form-item>

			<el-form-item>
				<el-button type="primary" @click="onSubmit">提交</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const textarea = ref('');

function onSubmit() {
	const data = JSON.stringify(JSON.parse(textarea.value));
	const str1 = `{"id":"maintenanceTipsForNeonSigns_04","style":{"padding":"0 0 1.25em","background-image":"url(https://static-oss.gs-souvenir.com/web/2024/other/20241021/2055538436bg.jpg)","background-size":"100%","background-repeat":"repeat-y"},"boxStyle":{"padding":"0 1em"},"cardStyle":{"padding":"0.75em","border-radius":"0.42em","flex-direction":"column"},"cardImgStyle":{"width":false,"border-radius":"0.42em"},"cardIndexStyle":{"left":0,"font-size":"1em"},"cardContentStyle":{"order":-1,"padding":"2.5em 2.125em 1.5em","grid-gap":false,"text-align":"center"},"cardTitleStyle":{"font-size":false},"cardSubTitleStyle":{"line-height":false}}`;

	console.log(data);
	console.log(data === str1);
}
</script>

<template>
	<div
		class="cl-image"
		:style="{
			height: style.h
		}"
	>
		<el-image
			:src="url"
			:fit="fit"
			:lazy="lazy"
			:preview-src-list="urls"
			:style="{
				height: style.h,
				width: style.w
			}"
			preview-teleported
		>
			<template #error>
				<div class="cl-image__slot">
					<el-icon :size="20"><picture-filled /></el-icon>
				</div>
			</template>
		</el-image>
	</div>
</template>

<script lang="ts">
import { type PropType, computed, defineComponent } from 'vue';
import { isArray, isNumber, isString } from 'lodash-es';
import { PictureFilled } from '@element-plus/icons-vue';
import { parsePx } from '/@/cool/utils';

export default defineComponent({
	name: 'cl-image',

	components: {
		PictureFilled
	},

	props: {
		modelValue: [String, Array],
		src: [String, Array],
		size: {
			type: [Number, Array],
			default: 100
		},
		lazy: Boolean,
		fit: {
			type: String as PropType<'' | 'contain' | 'cover' | 'none' | 'fill' | 'scale-down'>,
			default: 'cover'
		},
		compress: String as PropType<'oss' | 'none'>
	},

	setup(props) {
		const urls = computed(() => {
			const urls: any = props.modelValue || props.src;

			if (isArray(urls)) {
				return urls;
			}

			if (isString(urls)) {
				return (urls || '').split(',').filter(Boolean);
			}

			return [];
		});

		const style = computed(() => {
			const [h, w]: any = isNumber(props.size) ? [props.size, props.size] : props.size;

			return {
				h: parsePx(h),
				w: parsePx(w)
			};
		});

		const url = computed(() => {
			const v = urls.value[0];

			if (props.compress == 'oss') {
				return (
					v + `?x-oss-process=image/resize,m_fill,h_${style.value.h},w_${style.value.w}`
				);
			}

			return v;
		});

		return {
			url,
			urls,
			style
		};
	}
});
</script>

<style lang="scss" scoped>
.cl-image {
	&__slot {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		background-color: #f7f7f7;
		border-radius: 4px;
	}
}
</style>

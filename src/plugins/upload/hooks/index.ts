import { ElMessage } from 'element-plus';
import { module, service } from '/@/cool';
import { uuid } from '/@/cool/utils';
import { pathJoin, replaceSpacesWithSeparator } from '../utils';
import { useBase } from '/$/base';
import { type AxiosProgressEvent } from 'axios';
import type { Upload } from '../types';
import { merge } from 'lodash-es';

export function useUpload() {
	const { options } = module.get('upload');
	const { user } = useBase();

	// 上传
	async function toUpload(file: File, opts: Upload.Options = {}): Upload.Respose {
		return new Promise((resolve, reject) => {
			const executor = async () => {
				// 合并配置
				const { prefixPath, onProgress } = merge({}, options, opts);

				// 文件id
				const fileId = uuid('');

				try {
					const resp = await service.request({
						url: import.meta.env.VITE_OSS_CONFIG_URL,
						method: 'POST',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						data: {
							systemName: import.meta.env.VITE_OSS_SYSTEM_NAME,
							modelDir: prefixPath ?? import.meta.env.VITE_OSS_MODEL_DIR,
							isSSL: import.meta.env.VITE_OSS_IS_SSL
						}
					});

					// 文件名
					const fileName = fileId + '_' + replaceSpacesWithSeparator(file.name);

					// Key
					const key = pathJoin(resp.dir, fileName);

					// 多种上传请求
					const next = async ({ host, preview, data }: Upload.Request) => {
						const fd = new FormData();

						// key
						fd.append('key', key);

						// 签名数据
						for (const i in data) {
							if (!fd.has(i)) {
								fd.append(i, data[i]);
							}
						}

						// 文件
						fd.append('file', file);

						// 上传进度
						let progress = 0;

						// 上传
						await service
							.request({
								url: host,
								method: 'POST',
								headers: {
									'Content-Type': 'multipart/form-data'
									// Authorization: isLocal ? user.token : null
								},
								timeout: 600000,
								data: fd,
								onUploadProgress(e: AxiosProgressEvent) {
									progress = e.total ? Math.floor((e.loaded / e.total) * 100) : 0;
									onProgress?.(progress);
								},
								NProgress: false
							})
							.then(res => {
								if (progress != 100) {
									onProgress?.(100);
								}

								// key = encodeURIComponent(key);

								const url = pathJoin(preview || host, key);

								resolve({
									key,
									url,
									fileId
								});
							})
							.catch(err => {
								ElMessage.error(err.message);
								reject(err);
							});
					};

					next({
						host: resp.url,
						preview: resp.host,
						data: {
							OSSAccessKeyId: resp.accessid,
							policy: resp.policy,
							signature: resp.signature,
							success_action_status: '201'
						}
					});
				} catch (err) {
					ElMessage.error('文件上传失败');
					console.error('[upload]', err);
					reject(err);
				}
			};

			executor();
		});
	}

	return {
		options,
		toUpload
	};
}

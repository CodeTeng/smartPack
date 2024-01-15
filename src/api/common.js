import request from '@/utils/request'

/**
 * 上传图片
 * @param formData
 * @returns {*}
 */
export function uploadImgApi(formData) {
  return request({
    url: '/upload',
    method: 'post',
    data: formData
  })
}

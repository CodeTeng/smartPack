import request from '@/utils/request'

/**
 * 查看区域列表
 * @param params
 * @returns {*}
 */
export function getAreaListApi(params) {
  return request({
    url: '/parking/area/list',
    method: 'get',
    params
  })
}

/**
 * 区域删除
 * @param id
 * @returns {*}
 */
export function deleteAreaApi(id) {
  return request({
    url: `/parking/area/${id}`,
    method: 'delete'
  })
}

/**
 * 编辑区域
 * @param data
 * @returns {*}
 */
export function updateAreaApi(data) {
  return request({
    url: '/parking/area',
    method: 'put',
    data
  })
}

/**
 * 添加区域
 * @param data
 * @returns {*}
 */
export function addAreaApi(data) {
  return request({
    url: '/parking/area',
    method: 'post',
    data
  })
}

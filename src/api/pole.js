import request from '@/utils/request'

/**
 * 查看一体杆列表
 * @param params
 * @returns {*}
 */
export function getPoleListApi(params) {
  return request({
    url: '/pole/info/list',
    method: 'get',
    params
  })
}

/**
 * 添加一体杆
 * @param data
 * @returns {*}
 */
export function addPoleApi(data) {
  return request({
    url: '/pole/info',
    method: 'post',
    data
  })
}

/**
 * 编辑一体杆
 * @param data
 * @returns {*}
 */
export function updatePoleApi(data) {
  return request({
    url: '/pole/info',
    method: 'put',
    data
  })
}

/**
 * 删除一体杆
 * @param ids
 * @returns {*}
 */
export function deletePoleApi(ids) {
  return request({
    url: `/pole/info/${ids}`,
    method: 'delete'
  })
}

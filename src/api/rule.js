import request from '@/utils/request'

/**
 * 查看计费规则列表
 * @param params
 * @returns {*}
 */
export function getParkingRuleListApi(params) {
  return request({
    url: '/parking/rule/list',
    method: 'get',
    params
  })
}

/**
 * 删除计费规则
 * @param id
 * @returns {*}
 */
export function deleteParkingRuleApi(id) {
  return request({
    url: `/parking/rule/${id}`,
    method: 'delete'
  })
}

/**
 * 添加计费规则
 * @param data
 * @returns {*}
 */
export function addParkingRuleApi(data) {
  return request({
    url: '/parking/rule',
    method: 'post',
    data
  })
}

/**
 * 查看计费规则详情
 * @param id
 * @returns {*}
 */
export function getParkingRuleDetailApi(id) {
  return request({
    url: `/parking/rule/${id}`,
    method: 'get'
  })
}

/**
 * 编辑计费规则
 * @param data
 * @returns {*}
 */
export function updateParkingRuleApi(data) {
  return request({
    url: '/parking/rule',
    method: 'put',
    data
  })
}

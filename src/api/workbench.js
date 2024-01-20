import request from '@/utils/request'

/**
 * 工作台-基础信息查询
 * @returns {*}
 */
export function getWorkbenchInfoApi() {
  return request({
    url: '/home/workbench/info',
    method: 'get'
  })
}

/**
 * 临期合同查询
 * @returns {*}
 */
export function getWorkbenchRentInfoApi(params) {
  return request({
    url: '/home/workbench/rentInfo',
    method: 'get',
    params
  })
}

/**
 * 退租租赁合同
 * @param id
 * @returns {*}
 */
export function cancelRentApi(id) {
  return request({
    url: `/park/enterprise/rent/${id}`,
    method: 'put'
  })
}

import request from '@/utils/request'

/**
 * 查看停车缴费列表
 * @param params
 * @returns {*}
 */
export function getPayListApi(params) {
  return request({
    url: '/parking/payment/list',
    method: 'get',
    params
  })
}

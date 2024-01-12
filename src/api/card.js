import request from '@/utils/request'

/**
 * 获取月卡信息列表
 * @param params
 * @returns {*}
 */
export function getCardListApi(params) {
  return request({
    url: '/parking/card/list',
    method: 'get',
    params
  })
}

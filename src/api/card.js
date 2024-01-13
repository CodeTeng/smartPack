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

/**
 * 添加月卡
 * @param data
 * @returns {*}
 */
export function addCardApi(data) {
  return request({
    url: '/parking/card',
    method: 'post',
    data
  })
}

/**
 * 获取编辑月卡详情
 * @param id
 * @returns {*}
 */
export function getEditCardDetailApi(id) {
  return request({
    url: `/parking/card/detail/${id}`,
    method: 'get'
  })
}

/**
 * 修改月卡
 * @param data
 * @returns {*}
 */
export function updateCardApi(data) {
  return request({
    url: '/parking/card/edit',
    method: 'put',
    data
  })
}

/**
 * 删除月卡
 * @param ids
 * @returns {*}
 */
export function deleteCardApi(ids) {
  return request({
    url: `/parking/card/${ids}`,
    method: 'delete'
  })
}

/**
 * 月卡续费
 * @param data
 * @returns {*}
 */
export function rechargeCardApi(data) {
  return request({
    url: '/parking/card/recharge',
    method: 'post',
    data
  })
}

/**
 * 获取月卡详情
 * @param id
 * @returns {*}
 */
export function getCardDetailApi(id) {
  return request({
    url: `/parking/card/${id}`,
    method: 'get'
  })
}

/**
 * 获取月卡占有率
 * @returns {*}
 */
export function getCardProportionApi() {
  return request({
    url: '/parking/card/proportion',
    method: 'get'
  })
}

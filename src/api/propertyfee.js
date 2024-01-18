import request from '@/utils/request'

/**
 * 物业费列表
 * @param params
 * @returns {*}
 */
export function getPropertyFeeListApi(params) {
  return request({
    url: '/park/propertyfee',
    method: 'get',
    params
  })
}

/**
 * 添加账单
 * @param data
 * @returns {*}
 */
export function addPropertyFeeApi(data) {
  return request({
    url: '/park/propertyfee',
    method: 'post',
    data
  })
}

// 租户
export const getEnterpriseListApi = () => {
  return request({ url: '/park/all/enterprise' })
}
// 楼宇
export const getBuildingListApi = () => {
  return request({ url: '/park/rent/building' })
}

/**
 * 删除账单信息
 * @param id
 * @returns {*}
 */
export const deleteFeeApi = id => {
  return request({
    url: `/park/propertyfee/${id}`,
    method: 'delete'
  })
}

/**
 * 查看账单详情
 * @param id
 * @returns {*}
 */
export const getFeeDetailApi = id => {
  return request({
    url: `/park/propertyfee/${id}`,
    method: 'get'
  })
}

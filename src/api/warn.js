import request from '@/utils/request'

/**
 * 查看告警记录列表
 * @param params
 * @returns {*}
 */
export const getWarningListApi = params => {
  return request({
    url: '/pole/warning/list',
    method: 'get',
    params
  })
}

/**
 * 删除告警记录
 * @param id
 * @returns {*}
 */
export const deleteWarningApi = id => {
  return request({
    url: `/pole/warning/${id}`,
    method: 'delete'
  })
}

/**
 * 查看告警详情
 * @param id
 * @returns {*}
 */
export const getWarnDetailApi = id => {
  return request({
    url: `/pole/warning/${id}`,
    method: 'get'
  })
}

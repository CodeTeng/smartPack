import request from '@/utils/request'

/**
 * 查询可租赁楼宇列表
 * @returns {*}
 */
export function getRentBuildingApi() {
  return request({
    url: '/park/rent/building',
    method: 'get'
  })
}

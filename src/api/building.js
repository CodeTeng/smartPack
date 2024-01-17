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

/**
 * 楼宇列表查询
 * @param params
 * @returns {*}
 */
export function getBuildingListApi(params) {
  return request({
    url: '/park/building',
    method: 'get',
    params
  })
}

/**
 * 楼宇新增
 * @param data
 * @returns {*}
 */
export function addBuildingApi(data) {
  return request({
    url: '/park/building',
    method: 'post',
    data
  })
}

/**
 * 楼宇详情查询
 * @param id
 * @returns {*}
 */
export function getBuildingDetailApi(id) {
  return request({
    url: `/park/building/${id}`,
    method: 'get'
  })
}

/**
 * 楼宇修改
 * @param data
 * @returns {*}
 */
export function updateBuildingApi(data) {
  return request({
    url: '/park/building',
    method: 'put',
    data
  })
}

/**
 * 楼宇删除
 * @param id
 * @returns {*}
 */
export function deleteBuildingApi(id) {
  return request({
    url: `/park/building/${id}`,
    method: 'delete'
  })
}

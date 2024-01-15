import request from '@/utils/request'

/**
 * 获取企业列表
 * @param { page, pageSize } params
 * @returns {*}
 */
export function getEnterpriseListAPI(params) {
  return request({
    url: '/park/enterprise',
    method: 'get',
    params
  })
}

/**
 * 查询企业所属行业列表
 * @returns {*}
 */
export function getIndustryListApi() {
  return request({
    url: '/park/industry',
    method: 'get'
  })
}

/**
 * 添加企业
 * @param data
 * @returns {*}
 */
export function addIndustryApi(data) {
  return request({
    url: '/park/enterprise',
    method: 'post',
    data
  })
}

/**
 * 获取单个企业
 * @param id
 * @returns {*}
 */
export function getEnterpriseDetailApi(id) {
  return request({
    url: `/park/enterprise/${id}`,
    method: 'get'
  })
}

/**
 * 修改企业
 * @param data
 * @returns {*}
 */
export function updateEnterpriseApi(data) {
  return request({
    url: '/park/enterprise',
    method: 'put',
    data
  })
}

/**
 * 删除企业
 * @param id
 * @returns {*}
 */
export function deleteEnterpriseApi(id) {
  return request({
    url: `/park/enterprise/${id}`,
    method: 'delete'
  })
}

/**
 * -添加/续租企业的租赁合同
 * @param data
 * @returns {*}
 */
export function addEnterpriseRentApi(data) {
  return request({
    url: '/park/enterprise/rent',
    method: 'post',
    data
  })
}

/**
 * 企业租赁信息列表-展开查看
 * @param id
 * @returns {*}
 */
export function getEnterpriseRentListApi(id) {
  return request({
    url: `/park/enterprise/rent/${id}`,
    method: 'get'
  })
}

/**
 * 退租租赁合同
 * @param id
 * @returns {*}
 */
export function rentOutApi(id) {
  return request({
    url: `/park/enterprise/rent/${id}`,
    method: 'put'
  })
}

/**
 * 删除企业的租赁合同
 * @param id
 * @returns {*}
 */
export function deleteEnterpriseRentApi(id) {
  return request({
    url: `/park/enterprise/rent/${id}`,
    method: 'delete'
  })
}

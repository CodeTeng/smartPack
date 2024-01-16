import request from '@/utils/request'

/**
 * 查询所有角色
 * @returns {*}
 */
export function getSysRoleListApi() {
  return request({
    url: '/park/sys/role',
    method: 'get'
  })
}

/**
 * 查询所有功能权限(树形)
 * @returns {*}
 */
export function getSysPermissionTreeApi() {
  return request({
    url: '/park/sys/permision/all/tree'
  })
}

/**
 * 查询当前角色详情-权限和分配人数
 * @param roleId
 * @returns {*}
 */
export function getSysRoleDetailApi(roleId) {
  return request({
    url: `/park/sys/role/${roleId}`
  })
}

/**
 * 角色关联的用户列表
 * @param roleId
 * @param params
 * @returns {*}
 */
export function getSysRoleUserListApi(roleId, params) {
  return request({
    url: `/park/sys/roleUser/${roleId}`,
    params
  })
}


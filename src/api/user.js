import request from '@/utils/request'

/**
 * @description: 登录函数
 * @param {*} data { mobile,password}
 * @return {*} promise
 */
export function loginAPI(data) {
  return request({
    url: '/park/login',
    method: 'POST',
    data
  })
}

/**
 * 查询登录人用户、角色和权限信息
 * @returns {*}
 */
export function getUserProfileApi() {
  return request({
    url: '/park/user/profile',
    method: 'get'
  })
}

/**
 * 用户列表
 * @returns {*}
 */
export function getUserListApi(params) {
  return request({
    url: '/park/sys/user',
    method: 'get',
    params
  })
}

/**
 * 删除用户
 * @param id
 * @returns {*}
 */
export function deleteUserApi(id) {
  return request({
    url: `/park/sys/user/${id}`,
    method: 'delete'
  })
}

/**
 * 添加用户
 * @param data
 * @returns {*}
 */
export function addUserApi(data) {
  return request({
    url: '/park/sys/user',
    method: 'post',
    data
  })
}

/**
 * 用户详情
 * @param id
 * @returns {*}
 */
export function getUserDetailApi(id) {
  return request({
    url: `/park/sys/user/${id}`,
    method: 'get'
  })
}

/**
 * 编辑用户
 * @param data
 * @returns {*}
 */
export function updateUserApi(data) {
  return request({
    url: '/park/sys/user',
    method: 'put',
    data
  })
}

/**
 * 重置密码
 * @param id
 * @returns {*}
 */
export function resetPwdApi(id) {
  return request({
    url: '/park/sys/user/resetPwd',
    method: 'put',
    data: {
      id
    }
  })
}

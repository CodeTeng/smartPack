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

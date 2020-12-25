/**
 * 用户信息接口
 */

import request from '@/utils/request'

/**
 * 获取用户信息列表
 */
export function getList(query) {
  return request({
    url: '/api/userinfos',
    method: 'get',
    params: query
  })
}

/**
 * 新增或更新用户信息
 */

export function saveOrUpdate(data, method = 'post') {
  return request({
    url: '/api/userinfos',
    method,
    data
  })
}

/**
 * 获取计算机列表
 */
export function getSearchList(query) {
  return request({
    url: '/api/_search/userinfos',
    method: 'get',
    params: query
  })
}

/**
 * 删除用户信息
 */
export function deleteById(login) {
  return request({
    url: `/api/userinfos/${login}`,
    method: 'delete'
  })
}

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
  // mehod 默认为post，如果指定了put ,则路径中需要把id拼接上
  const rurl = method === 'put' ? `/api/userinfos/${data.id}` : '/api/userinfos'
  return request({
    url: rurl,
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

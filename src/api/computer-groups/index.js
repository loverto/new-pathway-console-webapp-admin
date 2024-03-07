/**
 * 计算机分组接口
 */

import request from '@/utils/request'

/**
 * 获取计算机分组列表
 */
export function getList(query) {
  return request({
    url: '/api/computer-groups',
    method: 'get',
    params: query
  })
}

/**
 * 新增或更新计算机分组
 */

export function saveOrUpdate(data, method = 'post') {
  // mehod 默认为post，如果指定了put ,则路径中需要把id拼接上
  const rurl = method === 'put' ? `/api/computer-groups/${data.id}` : '/api/computer-groups'
  return request({
    url: rurl,
    method,
    data
  })
}

/**
 * 搜索计算机分组
 */
export function getSearchList(query) {
  return request({
    url: '/api/_search/computer-groups',
    method: 'get',
    params: query
  })
}

/**
 * 根据分组ID获取计算机分组及计算机信息
 */
export function getById(id) {
  return request({
    url: `/api/computer-groups/${id}`,
    method: 'get'
  })
}

/**
 * 更新计算机分组信息
 * @param data
 */
export function updateAudits(data) {
  return request({
    url: '/api/v3/application-infos',
    method: 'put',
    data
  })
}

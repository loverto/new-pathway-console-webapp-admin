/**
 * 品牌接口
 */

import request from '@/utils/request'

/**
 * 获取品牌列表
 */
export function getList(query) {
  return request({
    url: '/api/computer-types',
    method: 'get',
    params: query
  })
}

/**
 * 新增或更新品牌
 */

export function saveOrUpdate(data, method = 'post') {
  return request({
    url: '/api/computer-types',
    method,
    data
  })
}

/**
 * 获取审核列表
 */
export function getAudits(query) {
  return request({
    url: '/api/v3/application-infos',
    method: 'get',
    params: query
  })
}

/**
 * 更新审核信息
 * @param data
 */
export function updateAudits(data) {
  return request({
    url: '/api/v3/application-infos',
    method: 'put',
    data
  })
}

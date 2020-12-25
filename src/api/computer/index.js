/**
 * 计算机名称接口
 */

import request from '@/utils/request'

/**
 * 获取计算机名称列表
 */
export function getList(query) {
  return request({
    url: '/api/computers',
    method: 'get',
    params: query
  })
}

/**
 * 新增或更新计算机名称
 */

export function saveOrUpdate(data, method = 'post') {
  return request({
    url: '/api/computers',
    method,
    data
  })
}

/**
 * 获取计算机列表
 */
export function getSearchList(query) {
  return request({
    url: '/api/_search/computers',
    method: 'get',
    params: query
  })
}

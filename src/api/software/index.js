/**
 * 软件接口
 */

import request from '@/utils/request'

/**
 * 获取软件列表
 */
export function getList(query) {
  return request({
    url: '/api/software',
    method: 'get',
    params: query
  })
}

/**
 * 新增或更新软件
 */

export function saveOrUpdate(data, method = 'post') {
  return request({
    url: '/api/software',
    method,
    data
  })
}

/**
 * 获取审核列表
 */
export function getSearchList(query) {
  return request({
    url: '/api/_search/software',
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

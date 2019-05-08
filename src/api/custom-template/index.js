/**
 * 定制模板接口
 */

import request from '@/utils/request'

/**
 * 获取定制模板列表
 */
export function getList(query) {
  return request({
    url: '/api/custom-templates',
    method: 'get',
    params: query
  })
}

/**
 * 新增或更新定制模板
 */

export function saveOrUpdate(data, method = 'post') {
  return request({
    url: '/api/custom-templates',
    method,
    data
  })
}

/**
 * 字体名称接口
 */

import request from '@/utils/request'

/**
 * 获取字体名称列表
 */
export function getList(query) {
  return request({
    url: '/api/font-types',
    method: 'get',
    params: query
  })
}

/**
 * 新增或更新字体名称
 */

export function saveOrUpdate(data, method = 'post') {
  return request({
    url: '/api/font-types',
    method,
    data
  })
}

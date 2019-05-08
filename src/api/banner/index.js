/**
 * 刀模图接口
 */

import request from '@/utils/request'

/**
 * 获取刀模图列表
 */
export function getList(query) {
  return request({
    url: '/api/die-patterns',
    method: 'get',
    params: query
  })
}

/**
 * 添加刀模图
 */

export function add(data) {
  return request({
    url: '/api/die-patterns',
    method: 'post',
    data
  })
}

/**
 * 修改刀模图
 */

export function update(data) {
  return request({
    url: '/api/die-patterns',
    method: 'put',
    data
  })
}

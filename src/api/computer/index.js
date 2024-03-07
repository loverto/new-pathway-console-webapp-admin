/**
 * 计算机名称接口
 */

import request from '@/utils/request'
import qs from 'qs'

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
 * 获取计算机名称列表
 */
export function getListByFilter(query) {
  return request({
    url: '/api/computers',
    method: 'get',
    params: query,
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat', allowDots: true })
  })
}

/**
 * 新增或更新计算机名称
 */

export function saveOrUpdate(data, method = 'post') {
  // mehod 默认为post，如果指定了put ,则路径中需要把id拼接上
  const rurl = method === 'put' ? `/api/computers/${data.id}` : '/api/computers'
  return request({
    url: rurl,
    method,
    data
  })
}

export function deleteCompute(data, method = 'post') {
  return request({
    url: `/api/computers/${data.id}`,
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

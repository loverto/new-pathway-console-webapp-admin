/**
 * 日志信息名称接口
 */

import request from '@/utils/request'
import qs from 'qs'

/**
 * 获取日志信息名称列表
 */
export function getList(query) {
  return request({
    url: '/api/loginfos',
    method: 'get',
    params: query
  })
}

/**
 * 新增或更新日志信息名称
 */

export function saveOrUpdate(data, method = 'post') {
  return request({
    url: '/api/loginfos',
    method,
    data
  })
}

/**
 * 获取日志信息列表
 */
export function getSearchList(query) {
  return request({
    url: '/api/_search/loginfos',
    method: 'get',
    params: query
  })
}
/**
 * 获取日志信息列表
 */
export function getListByFilter(query) {
  return request({
    url: '/api/loginfos',
    method: 'get',
    params: query,
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat', allowDots: true })
  })
}

/**
 * 授权接口
 */

import request from '@/utils/request'
import qs from 'qs'

/**
 * 获取授权列表
 */
export function getList(query) {
  return request({
    url: '/api/authorization-infos',
    method: 'get',
    params: query
  })
}
/**
 * 获取授权列表
 */
export function getListByFilter(query) {
  return request({
    url: '/api/authorization-infos',
    method: 'get',
    params: query,
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat', allowDots: true })
  })
}

/**
 * 新增或更新授权
 */

export function saveOrUpdate(data, method = 'post') {
  // mehod 默认为post，如果指定了put ,则路径中需要把id拼接上
  const rurl = method === 'put' ? `/api/authorization-infos/${data.id}` : '/api/authorization-infos'
  return request({
    url: rurl,
    method,
    data
  })
}

/**
 * 获取审核列表
 */
export function getSearchList(query) {
  return request({
    url: '/api/_search/authorization-infos',
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

/**
 * 删除授权信息
 */
export function deleteById(login) {
  return request({
    url: `/api/authorization-infos/${login}`,
    method: 'delete'
  })
}

/**
 * 获取用户列表
 */
export function getUserinfoList(query) {
  return request({
    url: '/api/userinfos',
    method: 'get',
    params: query
  })
}

/**
 * 获取软件列表
 */
export function getSoftwareList(query) {
  return request({
    url: '/api/software',
    method: 'get',
    params: query
  })
}

/**
 * 获取计算机列表
 */
export function getComputerList(query) {
  return request({
    url: '/api/computers',
    method: 'get',
    params: query
  })
}

/**
 * 获取计算机列表
 */
export function getGroupComputerList(query) {
  return request({
    url: '/api/computer-groups',
    method: 'get',
    params: query
  })
}


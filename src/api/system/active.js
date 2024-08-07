import request from '@/utils/request'

// 查询小程序活动列表
export function listActive(query) {
  return request({
    url: '/system/active/list',
    method: 'get',
    params: query
  })
}

// 查询小程序活动详细
export function getActive(id) {
  return request({
    url: '/system/active/' + id,
    method: 'get'
  })
}

// 新增小程序活动
export function addActive(data) {
  return request({
    url: '/system/active',
    method: 'post',
    data: data
  })
}

// 修改小程序活动
export function updateActive(data) {
  return request({
    url: '/system/active/edit',
    method: 'put',
    data: data
  })
}

// 删除小程序活动
export function delActive(id) {
  return request({
    url: '/system/active/' + id,
    method: 'delete'
  })
}

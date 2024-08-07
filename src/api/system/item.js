import request from '@/utils/request'

// 查询机构报标准列表
export function listItem(query) {
  return request({
    url: '/system/item/list',
    method: 'get',
    params: query
  })
}
// 查询机构报标准列表
export function listNotPage(query) {
  return request({
    url: '/system/item/listNotPage',
    method: 'get',
    params: query
  })
}

// 查询机构报标准详细
export function getItem(id) {
  return request({
    url: '/system/item/' + id,
    method: 'get'
  })
}

// 新增机构报标准
export function addItem(data) {
  return request({
    url: '/system/item',
    method: 'post',
    data: data
  })
}

// 修改机构报标准
export function updateItem(data) {
  return request({
    url: '/system/item',
    method: 'put',
    data: data
  })
}

// 删除机构报标准
export function delItem(id) {
  return request({
    url: '/system/item/' + id,
    method: 'delete'
  })
}

import request from '@/utils/request'

// 查询机构报列表
export function listReport(query) {
  return request({
    url: '/system/report/list',
    method: 'get',
    params: query
  })
}

// 查询机构报详细
export function getReport(id) {
  return request({
    url: '/system/report/getInfo/' + id,
    method: 'get'
  })
}

// 新增机构报
export function addReport(data) {
  return request({
    url: '/system/report/add',
    method: 'post',
    data: data
  })
}

// 修改机构报
export function updateReport(data) {
  return request({
    url: '/system/report',
    method: 'put',
    data: data
  })
}

// 删除机构报
export function delReport(id) {
  return request({
    url: '/system/report/' + id,
    method: 'delete'
  })
}

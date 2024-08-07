import request from '@/utils/request'

// 查询活动申请列表
export function listApply(query) {
  return request({
    url: '/system/apply/list',
    method: 'get',
    params: query
  })
}

// 查询活动申请详细
export function getApply(id) {
  return request({
    url: '/system/apply/' + id,
    method: 'get'
  })
}

// 新增内推用户
export function addApply(data) {
  return request({
    url: '/system/apply/pushIn',
    method: 'post',
    data: data
  })
}

// 修改活动申请
export function updateApply(data) {
  return request({
    url: '/system/apply',
    method: 'put',
    data: data
  })
}

// 删除活动申请
export function delApply(id) {
  return request({
    url: '/system/apply/' + id,
    method: 'delete'
  })
}
//审核申请
export function examine(data) {
  return request({
    url: '/system/apply/examine',
    method: 'put',
    data: data
  })
}

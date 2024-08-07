import request from '@/utils/request'

// 查询专家建议列表
export function listAdvice(query) {
  return request({
    url: '/system/advice/list',
    method: 'get',
    params: query
  })
}

// 查询专家建议详细
export function getAdvice(id) {
  return request({
    url: '/system/advice/getInfo/' + id,
    method: 'get'
  })
}

// 新增专家建议
export function addAdvice(data) {
  return request({
    url: '/system/advice/add',
    method: 'post',
    data: data
  })
}

// 修改专家建议
export function updateAdvice(data) {
  return request({
    url: '/system/advice',
    method: 'put',
    data: data
  })
}

// 删除专家建议
export function delAdvice(id) {
  return request({
    url: '/system/advice/' + id,
    method: 'delete'
  })
}

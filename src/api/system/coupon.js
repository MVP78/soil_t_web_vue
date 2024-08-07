import request from '@/utils/request'

// 查询优惠券管理列表
export function listCoupon(query) {
  return request({
    url: '/system/coupon/list',
    method: 'get',
    params: query
  })
}

// 查询优惠券管理详细
export function getCoupon(id) {
  return request({
    url: '/system/coupon/' + id,
    method: 'get'
  })
}

// 新增优惠券管理
export function addCoupon(data) {
  return request({
    url: '/system/coupon/add',
    method: 'post',
    data: data
  })
}

// 修改优惠券管理
export function updateCoupon(data) {
  return request({
    url: '/system/coupon/edit',
    method: 'put',
    data: data
  })
}

// 删除优惠券管理
export function delCoupon(id) {
  return request({
    url: '/system/coupon/' + id,
    method: 'delete'
  })
}

// 发放优惠券管理
export function grantCoupon(data) {
  return request({
    url: '/system/coupon/distributeCoupon',
    method: 'post',
    data: data
  })
}
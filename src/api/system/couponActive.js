import request from '@/utils/request'

// 查询优惠券活动列表
export function listCouponActive(query) {
  return request({
    url: '/system/couponActive/couponList',
    method: 'get',
    params: query
  })
}

// 查询优惠券活动详细
export function getCouponActive(id) {
  return request({
    url: '/system/couponActive/couponGetInfo/' + id,
    method: 'get'
  })
}

// 新增优惠券活动
export function addCouponActive(data) {
  return request({
    url: '/system/couponActive/couponAdd',
    method: 'post',
    data: data
  })
}

// 修改优惠券活动
export function updateCouponActive(data) {
  return request({
    url: '/system/couponActive/couponEdit',
    method: 'put',
    data: data
  })
}

// 删除优惠券活动
export function delCouponActive(id) {
  return request({
    url: '/system/couponActive/couponRemove/' + id,
    method: 'delete'
  })
}

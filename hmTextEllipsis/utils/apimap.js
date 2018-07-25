'use strict'

let remoteApis = {
  queryWhiteList: '/white/list',
  addWhite: '/white/add', // 添加白名单
  removeWhite: '/white/remove', // 移除白名单
  updateStatus: '/white/updateStatus', // 移除白名单
  queryDockCodeData: '/hr/delivererManager/getDeliveryDocksBySession' // 配送站点
}

const addPrefix = (prefix, apis) => {
  let res = {}
  for (let k in apis) {
    res[k] = `${prefix}${apis[k]}`
  }

  return res
}

export default {
  base: {
  },
  local: {
    ...addPrefix('//capacity.hemaos.com', remoteApis),
    deliveryDocks: '//ums.hemaos.com/base/distributionManager/getOptionalDeliveryDocks.json' // 配送站
  },
  development: {
    ...addPrefix('//capacity.hemaos.com', remoteApis),
    deliveryDocks: '//ums.hemaos.com/base/distributionManager/getOptionalDeliveryDocks.json' // 配送站
  },
  pre: {
    ...addPrefix('//capacity.hemaos.com', remoteApis),
    deliveryDocks: '//ums.hemaos.com/base/distributionManager/getOptionalDeliveryDocks.json' // 配送站
  },
  production: {
    ...addPrefix('//capacity.hemaos.com', remoteApis),
    deliveryDocks: '//ums.hemaos.com/base/distributionManager/getOptionalDeliveryDocks.json' // 配送站
  }
}

'use strict'

import { ajax as _ajax } from 'utils/index'
import apimap from './apimap'
import { Feedback } from '@alife/next'
const { toast: Toast } = Feedback

// 注意handleSuc和handleFailed是调用成功的if／else处理，
// 不是原ajax的两个函数！！
export default function ajax (param, handleSuc, handleFailed) {
  param.apimap = apimap

  // 包装响应处理函数
  let sucProcessor = suc => {
      if (suc.success) {  // handleSuc
        handleSuc && handleSuc(suc)
      } else {    // handleFailed
        handleFailed && handleFailed(suc)
      }
    }, errProcessor = err => {
        // 可根据需求修改
      Toast.prompt('服务器有问题，请稍后再试')
    }

  _ajax(param).then(res => sucProcessor(res)).catch(err => errProcessor(err))
}

export function getURL (shortName) {
  return apimap[window._APIMAP_ENV][shortName]
}

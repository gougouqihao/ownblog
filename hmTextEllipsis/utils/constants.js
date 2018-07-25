'use strict'

import _ from 'lodash'
import ConstantList from 'utils/constant_list'

const values = {
  isTypes: [{
    label: '未启用',
    value: -1
  }, {
    label: '启用',
    value: 1
  }],
  errDate: [
    {
      label: '已完成',
      value: '3'
    }
  ]
}

export default _.mapValues(values, function (list) {
  return ConstantList.create(list)
})

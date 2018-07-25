'use strict'

import dva from 'dva'
import React from 'react'
import './index.scss'
import Searcher from './view/searcher'

// 1. Initialize
const app = dva()

// 2. Model
app.model({
  namespace: 'hmTextEllipsis',
  state: {
    searcher: {
    }
  },
  reducers: {
    updataWhiteList (state, payload) {
      return {
        ...state,
        ...state.searcher,
        ...payload
      }
    }
  },
  effects: {}
})

// 3. Router
app.router(() => <div>
  <Searcher />
</div>)

// 4. Start
app.start('#container')

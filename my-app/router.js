/**
 * 前端路由配置
 */

import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRedirect } from 'react-router'
import { createHistory } from 'history'
import auth from 'public/auth'
import App from './functions/App'

// 用户登录验证

function requireAuth(nextState, replaceState) {
  const path = nextState.location.pathname
  const loginPath = '/login'
  //const loginPath='/overview/todos'
  if (!auth.loggedIn()) {
    path !== loginPath && replaceState({referrer: path}, '/login')
    //path !== loginPath && replaceState({referrer: path}, '/overview/todos')
  }
}

export default render((
  <Router history={createHistory()} onUpdate={() => window.scrollTo(0, 0)}>
    <Route path="/" component={App} onEnter={requireAuth}>
      <IndexRedirect to="/overview/todos" />
      <Route path="overview">
        <Route path="todos" getComponent={(location, cb) => {
          require.ensure([], require => {
          cb(null, require('./functions/Overview/Todos').default)
          })
        }} />
      </Route>
      <Route path="Cmdb">
        <Route path="group" getComponent={(location, cb) => {
          require.ensure([], require => {
          cb(null, require('./functions/Cmdb/group').default)
          })
        }} />
        <Route path="idc" getComponent={(location, cb) => {
          require.ensure([], require => {
          cb(null, require('./functions/Cmdb/idc').default)
          })
        }} />
        <Route path="asset" getComponent={(location, cb) => {
          require.ensure([], require => {
          cb(null, require('./functions/Cmdb/asset').default)
          })
        }} />
        <Route path="details">
          <Route path=":id" getComponent={(location, cb) => {
          require.ensure([], require => {
          cb(null, require('./functions/Cmdb/details').default)
          })
          }} />
        </Route>
      </Route>
      <Route path="Service">
        <Route path="register" getComponent={(location, cb) => {
          require.ensure([], require => {
          cb(null, require('./functions/service/register').default)
          })
        }} />
      </Route>
      <Route path="automation">
        <Route path="modules" getComponent={(location, cb) => {
          require.ensure([], require => {
          cb(null, require('./functions/automation/modules').default)
          })
        }} />
      </Route>
      <Route path="login" getComponent={(location, cb) => {
        require.ensure([], require => {
          cb(null, require('./functions/Login').default)
        })
      }} />
      <Route path="*" getComponent={(location, cb) => {
        require.ensure([], require => {
          cb(null, require('./functions/NotFound').default)
        })
      }}/>
    </Route>
  </Router>
), document.getElementById('app'))
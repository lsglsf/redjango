/**
 * 全局配置
 */

import xhr from 'bfd/xhr'
import message from 'bfd/message'
import auth from 'public/auth'
import router from './router'

// AJAX 全局配置
if (__DEV__) {
  xhr.baseUrl = 'http://192.168.2.224:8080'
} else {
 // xhr.baseUrl = '/api'
  xhr.baseUrl=''
}



xhr.success = (res, option) => {
  if (typeof res !== 'object') {
    message.danger(option.url + ': response data should be JSON')
    return
  }
  switch (res.code) {
    case 200:
      option.success && option.success(res.data)
      break
    case 401:
      auth.destroy()
      router.history.replaceState({
        referrer: router.state.location.pathname
      }, '/login')
      break
    default:
      message.danger(res.message || 'unknown error')
  }
}

/**
 * 当前用户状态
 */

import xhr from 'bfd/xhr'

function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}


const auth = {

  loggedIn() {
    const user = JSON.parse(localStorage.getItem('user'))
    // 用户处于登录状态的条件：本地存储以及 cookie 同时存在
    if (user && auth.isUserInCookie()) {
      auth.register(user)
     // auth.register({
      //name: 'DEMO'
      //})

      return true
    } else {
      return false
    }
  },

  isUserInCookie() {
    return document.cookie.match(/(^|; )user=/)
    //return document.cookie = 'user=0FAC6FBASDS3213AX'
  },

  register(user) {
    xhr.header = {
     // "X-CSRFToken": getCookie('csrftoken')
    } 
    auth.user = user
    // 用户信息（基本信息、权限等存放 localStorage，减少前后端通信）
    localStorage.setItem('user', JSON.stringify(user))
  },

  destroy() {
    auth.user = null
    localStorage.removeItem('user')
  }
}

if (__DEV__) {
  // 开发环境登录状态写死，方便开发
  document.cookie = 'user=0FAC6FBASDS3213AX'
  auth.register({
    name: 'DEMO'
  })
}

export default auth
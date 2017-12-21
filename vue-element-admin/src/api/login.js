import fetch from '@/utils/fetch'

export function loginByUsername(username, password, captcha) {
  const data = {
    username,
    password,
    captcha
  }
  return fetch({
    url: '/login',
    method: 'post',
    data
  })
}

export function logout() {
  return fetch({
    url: '/logout',
    method: 'get'
  })
}

export function getUserInfo(token) {
  return fetch({
    url: '/user/info',
    method: 'get',
    params: {token}
  })
}

export function getUserMenus(roleId) {
  return fetch({
    url: '/menu',
    method: 'get',
    params: {roleId}
  })
}

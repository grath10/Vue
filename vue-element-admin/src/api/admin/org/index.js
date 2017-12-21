import fetch from 'utils/fetch'

export function orgTree(query) {
  return fetch({
    url: '/api/admin/org/orgTree',
    method: 'get',
    params: query
  })
}

export function getObj(id) {
  return fetch({
    url: '/api/admin/org/get/' + id,
    method: 'get'
  })
}

export function addObj(obj) {
  return fetch({
    url: '/api/admin/org/add',
    method: 'post',
    data: obj
  })
}

export function putObj(id, obj) {
  return fetch({
    url: '/api/admin/org/put/' + id,
    method: 'put',
    data: obj
  })
}

export function getNextCode(id) {
  return fetch({
    url: '/api/admin/org/getNextCode',
    method: 'get',
    params: id
  })
}

export function checkCode(id, code) {
  return fetch({
    url: '/api/admin/org/checkCode',
    method: 'get',
    params: id, code
  })
}

export function delObj(id) {
  return fetch({
    url: '/api/admin/org/deleted',
    method: 'delete',
    params: id
  })
}

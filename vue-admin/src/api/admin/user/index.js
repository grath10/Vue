import fetch from 'utils/fetch'

export function page(query) {
  return fetch({
    url: '/user/query',
    method: 'get',
    params: query
  })
}

export function addUser(obj) {
  return fetch({
    url: '/user/add',
    method: 'post',
    data: obj
  })
}

export function getUser(id) {
  return fetch({
    url: '/user/querySingle',
    method: 'get',
    params:{
      id: id
    }
  })
}

export function delUser(id) {
  return fetch({
    url: '/user/delete',
    params: {
      id: id
    }
  })
}

export function saveUser(user, operation){
  const { username, password, roleId} = user
  return fetch({
    url: '/user/save',
    data: {
      type: operation,
      username: username,
      password: password,
      roleId: roleId
    },
    method: 'post'
  })
}
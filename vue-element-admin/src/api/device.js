import fetch from 'utils/fetch'

export function pageDevice(query, sort) {
  const params = Object.assign({}, query, sort)
  return fetch({
    url: '/device/query',
    method: 'get',
    params: params
  })
}

export function getDevice(id) {
  return fetch({
    url: '/device/findOne',
    method: 'get',
    params:{
      id: id
    }
  })
}

export function getAllDevices(){
  return fetch({
    url: '/device/list',
    method: 'get'
  })
}

export function getDeviceByFuzzy(id) {
  return fetch({
    url: '/device/findByFuzzy',
    method: 'get',
    params:{
      id: id
    }
  })
}

export function delDevice(id) {
  return fetch({
    url: '/device/delete',
    params: {
      id: id
    }
  })
}

export function saveDevice(device, mode){
  const params = Object.assign({}, device);
  params['type'] = mode;
  return fetch({
    url: '/device/save',
    data: params,
    method: 'post'
  })
}
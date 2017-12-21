import fetch from 'utils/fetch'

export function pageEntity(query, bean, sort) {
  const { limit, page } = query
  const { order, prop } = sort
  return fetch({
    url: '/' + bean + '/query',
    method: 'get',
    params: {
      limit: limit,
      page: page,
      entity: bean,
      order: order,
      prop: prop
    }
  })
}

export function getEntityByName(name, bean) {
  return fetch({
    url: '/' + bean + '/findOne',
    method: 'get',
    params:{
      name: name,
      entity: bean
    }
  })
}

export function delEntity(id, bean) {
  return fetch({
    url: '/'+ bean + '/delete',
    params: {
      id: id,
      entity: bean
    }
  })
}

export function saveEntity(entity, mode, bean){
  const params = Object.assign({}, entity)
  params['type'] = mode
  params['entity'] = bean
  return fetch({
    url: '/' + bean + '/save',
    data: params,
    method: 'post'
  })
}
import fetch from 'utils/fetch'

export function searchWithCondition(bean, category, query) {
  const { limit, page } = query
  var params = Object.assign({}, bean)
  params['category'] = category
  params['limit'] = limit
  params['page'] = page
  return fetch({
    url: '/history/queryDetails',
    method: 'get',
    params: params
  })
}

export function searchLatestRecord(){
  return fetch({
    url: '/history/record',
    method: 'get'
  })
}
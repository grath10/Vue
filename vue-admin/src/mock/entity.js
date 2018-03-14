import Mock from 'mockjs'
import { param2Obj } from '@/utils'

let List = []
const count = 25
const paramsMap = {
  device: ['id', 'number', 'location', 'comment'],
  user: ['id', 'username', 'role'],
  parameter: ['id', 'type', 'low', 'high']
}

let deviceList = []
let userList = []
let parameterList = []

function threshold(type){
  var value = ''
  if(type == '温度'){
    value = Mock.mock('@float(30, 40, 2, 2)')
  }else if(type == '湿度'){
    value = Mock.mock('@float(60, 90, 2, 2)')
  }else{
    value = Mock.mock('@float(0, 0, 2, 2)')
  }
  return value
}

function thresholdHigh(type, low){
  var value = ''
  if(type == '温度'){
    value = (low + Mock.mock('@float(30, 40, 2, 2)') * 0.1).toFixed(2)
  }else if(type == '湿度'){
    value = (low + Mock.mock('@float(60, 90, 2, 2)') * 0.1).toFixed(2)
  }else{
    value = (low + Mock.mock('@float(0, 0, 2, 2)') * 0.1).toFixed(2)
  }
  return value
}

for (let i = 0; i < count; i++) {
  deviceList.push(Mock.mock({
    id: '@increment(1)',
    number: '@ip',
    location: '@ctitle(5)',
    comment: '@cword(4, 8)'
  }))
}

for (let i = 0; i < count; i++) {
  userList.push(Mock.mock({
    id: '@increment(1)',
    number: '@ip',
    location: '@ctitle(5)',
    comment: '@cword(4, 8)'
  }))
}

for (let i = 0; i < count; i++) {
  parameterList.push(Mock.mock({
    id: '@increment(1)',
    'type|1': ['温度', '湿度', '氨气浓度'],
    low: function(){
      return threshold(this.type) 
    },
    high: function(){
      return thresholdHigh(this.type, this.low) 
    }
  }))
}

function selectiveCopy(source){
  var dest = {}
  for(var key in source){
    if(key !== 'type'){
      dest[key] = source[key]
    }
  }
  return dest
}

function getListByEntity(entity){
  if(entity == 'device'){
    List = deviceList
  }else if(entity == 'parameter'){
    List = parameterList
  }else{
    List = userList
  }
  return List
}

export default {
  getList: config => {
    const { page = 1, limit = 10, sort, entity } = param2Obj(config.url)
    let mockList = getListByEntity(entity)
    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
    let currentList = []
    for (let i = 0; i < pageList.length; i++) {
      let item = pageList[i]
      item['index'] = i + 1
      currentList.push(item)
    }
    return {
      total: mockList.length,
      list: currentList
    }
  },
  deleteEntity: config => {
    const { id, entity } = param2Obj(config.url)
    let List = getListByEntity(entity)
    let mockList = List.filter((item) => item.id !== +id)
    List = mockList
  },
  getEntity: config => {
    const { id, entity } = param2Obj(config.url)
    let List = getListByEntity(entity)
    const entityList = List.filter((item) => item.id === +id)
    if(entityList.length > 0){
      return entityList[0]
    }else{
      return null
    }
  },
  saveEntity: config => {
    let params = JSON.parse(config.body)
    const type = params['type']
    const entity = params['entity']
    let bean = selectiveCopy(params)
    if(type == 'create'){
      const id = Mock.mock('@increment(1)') + List.length
      bean['id'] = id
      List.push(bean)
    }else{
      let id = bean['id']
      let filterList = List.filter((item) => item.id !== +id)
      List = filterList.concat(bean)
    }
  }
}

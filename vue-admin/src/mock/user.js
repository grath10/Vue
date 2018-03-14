import Mock from 'mockjs'
import { param2Obj } from '@/utils'

let List = []
const count = 25
const relationMap = function(roleId){
  if(roleId == 1){
    return '系统管理员'
  }else{
    return '普通用户'
  }
}

const nameMap = function(abbr){
  if(abbr == 'ROLE_ADMIN'){
    return '系统管理员'
  }else{
    return '普通用户'
  }
}

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment(100)',
    username: '@name',
    'roleId|1': [1, 2],
    desc: relationMap('@roleId')
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

export default {
  getList: config => {
    const { page = 1, limit = 10, sort } = param2Obj(config.url)
    let mockList = List
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
  deleteUser: config => {
    const { id } = param2Obj(config.url)
    let mockList = List.filter((item) => item.id !== +id)
    List = mockList
  },
  getSingleUser: config => {
    const { id } = param2Obj(config.url)
    const user = List.filter((item) => item.id === +id)
    return user[0]
  },
  saveUser: config => {
    const id = Mock.mock('@increment(100)') + List.length
    let user = JSON.parse(config.body)
    let desc = nameMap(user['desc'])
    user['id'] = id
    user['desc'] = desc
    List.push(user)
  },
  updateUser: config => {
    let user = JSON.parse(config.body)
    let id = user['id']
    let filterList = List.filter((item) => item.id !== +id)
    List = filterList.concat(user)
  },
  conserveUser: config => {
    let params = JSON.parse(config.body)
    const { username, password, roleId, type} = params
    let bean = {
      username: username,
      roleId: roleId
    }
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

import Mock from 'mockjs'
import { param2Obj } from '@/utils'

var List = []
const count = 25

// for (let i = 0; i < count; i++) {
//   List.push(Mock.mock({
//     id: '@increment(1)',
//     number: '@ip',
//     location: '@ctitle(5)',
//     comment: '@cword(4, 8)'
//   }))
// }

function selectiveCopy(source){
  var dest = {}
  for(var key in source){
    if(key !== 'type'){
      dest[key] = source[key]
    }
  }
  return dest
}

function createMockDevices(){
  var list = []
  for (let i = 0; i < count; i++) {
    list.push({
      id: i * 2,
      number: '2017-12-13' + i,
      location: 'asdf' + i,
      comment: 'qwer'+ i
    })
  }
  return list
}

export default {
  findAllDevices: () => {
    const deviceList = createMockDevices()
    return deviceList
  },
  getList: config => {
    const { page = 1, limit = 10, sort } = param2Obj(config.url)
    let mockList = createMockDevices()
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
  deleteDevice: config => {
    const { id } = param2Obj(config.url)
    let mockList = List.filter((item) => item.id !== +id)
    List = mockList
  },
  getDevice: config => {
    const { id } = param2Obj(config.url)
    const List = createMockDevices()
    const devices = List.filter((item) => item.id === +id)
    if(devices.length > 0){
      return devices[0]
    }else{
      return null
    }
  },
  saveDevice: config => {
    let params = JSON.parse(config.body)
    const type = params['type']
    let device = selectiveCopy(params)
    let id = device['id']
    if(type == 'create'){
      const id = Mock.mock('@increment(1)') + List.length
      device['id'] = id
      List.push(device)
    }else{
      let filterList = List.filter((item) => item.id !== +id)
      List = filterList.concat(device)
    }
  },
  findByFuzzy: config => {
    const { id } = param2Obj(config.url)
    const List = createMockDevices()
    const devices = List.filter((item) => (item.id + "").indexOf(id) > -1)
    return devices
  }
}

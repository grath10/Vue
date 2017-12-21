import Mock from 'mockjs'
import { param2Obj } from '@/utils'
import Layout from '../views/layout/Layout'
const _import = require('../router/_import_' + process.env.NODE_ENV)

const List = []
const count = 10

const menus = [
  {
    "id": 1,
    "name": "permission",
    "text": "数据展示",
    "path": "history",
    "parent": -1,
    "childMenus": [
      {
        "id": 2,
        "name": "charts/index",
        "text": "按设备查看",
        "path": "device",
        "parent": 1,
        "childMenus": null,
        "leaf": true
      },
      {
        "id": 3,
        "name": "example/table/dynamictable/index",
        "text": "按类型查看",
        "path": "type",
        "parent": 1,
        "childMenus": null,
        "leaf": true
      }
    ],
    "leaf": false
  },
  {
    "id": 4,
    "name": "management",
    "text": "系统配置",
    "path": "",
    "parent": -1,
    "childMenus": [
      {
        "id": 5,
        "name": "components/user",
        "text": "用户管理",
        "path": "user",
        "parent": 4,
        "childMenus": null,
        "leaf": true
      },
      {
        "id": 6,
        "name": "example/form",
        "text": "设备管理",
        "path": "hardware",
        "parent": 4,
        "childMenus": null,
        "leaf": true
      },
      {
        "id": 7,
        "name": "charts/mixChart",
        "text": "阈值管理",
        "path": "parameter",
        "parent": 4,
        "childMenus": null,
        "leaf": true
      }
    ],
    "leaf": false
  }
]

export default {
  getOwnMenus: config => {
    const params = param2Obj(config.url)
    const roleId = params.roleId
    const menus = [{
      path: '/management',
      name: '系统配置',
      leaf: false,
      childMenus: [{ 
        name: '用户管理',
        path: 'pages/user',
        childMenus: null,
        leaf: true
      }, {
        name: '设备管理',
        path: 'pages/device',
        childMenus: null,
        leaf: true
      }, {
        name: '参数设置',
        path: 'pages/parameter',
        childMenus: null,
        leaf: true
      }]
    }, {
      path: '/history',
      name: '数据分析',
      leaf: false,
      childMenus: [{ 
        name: '按类型查看',
        path: 'pages/history-by-type',
        childMenus: null,
        leaf: true
      }, {
        name: '按设备查看',
        path: 'pages/history-by-device',
        childMenus: null,
        leaf: true
      }]
    }]
    return menus
  },
  getList: config => {
    const { importance, type, title, page = 1, limit = 20, sort } = param2Obj(config.url)
    let mockList = List.filter(item => {
      if (importance && item.importance !== +importance) return false
      if (type && item.type !== type) return false
      if (title && item.title.indexOf(title) < 0) return false
      return true
    })
    if (sort === '-id') {
      mockList = mockList.reverse()
    }
    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
    return {
      total: mockList.length,
      items: pageList
    }
  }
}

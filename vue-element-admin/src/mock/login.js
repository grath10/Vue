import { param2Obj } from '@/utils'

const userMap = {
  admin: {
    user: {
      role: 'admin',
      roleId: 1,
      token: 'admin',
      introduction: '我是超级管理员',
      avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      name: 'Super Admin'
    },
    flag: true
  },
  editor: {
    user:{
      role: 'editor',
      roleId: 2,
      token: 'editor',
      introduction: '我是编辑',
      avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      name: 'Normal Editor'
    },
    flag: true
  },
  developer: {
    user: {
      role: 'develop',
      roleId: 2,
      token: 'develop',
      introduction: '我是开发',
      avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      name: '工程师小王'
    },
    flag: true
  }
}

export default {
  loginByUsername: config => {
    const { username } = JSON.parse(config.body)
    return userMap[username]
  },
  getUserInfo: config => {
    const { token } = param2Obj(config.url)
    if (userMap[token]) {
      return userMap[token]['user']
    } else {
      return false
    }
  },
  logout: () => 'success'
}

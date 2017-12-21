import Mock from 'mockjs'
import loginAPI from './login'
import articleAPI from './article'
import menuAPI from './menu'
import userAPI from './user'
import deviceAPI from './device'
import entityAPI from './entity'
import remoteSearchAPI from './remoteSearch'
import historyAPI from './history'

Mock.setup({
  timeout: '350-600'
})

// 登录相关
Mock.mock(/\/login/, 'post', loginAPI.loginByUsername)
Mock.mock(/\/logout/, 'get', loginAPI.logout)
Mock.mock(/\/user\/info\.*/, 'get', loginAPI.getUserInfo)
Mock.mock(/\/menu/, 'get', menuAPI.getOwnMenus)

// 用户相关
Mock.mock(/\/user\/query\?/, 'get', userAPI.getList)
Mock.mock(/\/user\/delete/, userAPI.deleteUser)
Mock.mock(/\/user\/querySingle/, 'get', userAPI.getSingleUser)
Mock.mock(/\/user\/save/, 'post', userAPI.conserveUser)

// 设备相关
Mock.mock(/\/device\/query/, 'get', deviceAPI.getList)
Mock.mock(/\/device\/findOne/, 'get', deviceAPI.getDevice)
Mock.mock(/\/device\/list/, deviceAPI.findAllDevices)
Mock.mock(/\/device\/delete/, deviceAPI.deleteDevice)
Mock.mock(/\/device\/save/, deviceAPI.saveDevice)
Mock.mock(/\/device\/findByFuzzy/, deviceAPI.findByFuzzy)

// 采集相关
Mock.mock(/\/history\/queryDetails/, historyAPI.queryDetails)
Mock.mock(/\/history\/record/, historyAPI.searchLatestRecord)

// 参数相关
Mock.mock(/\/parameter\/query/, 'get', entityAPI.getList)
Mock.mock(/\/parameter\/findOne/, 'get', entityAPI.getEntity)
Mock.mock(/\/parameter\/save/, entityAPI.saveEntity)

export default Mock

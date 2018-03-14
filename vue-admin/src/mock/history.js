import Mock from 'mockjs'
import { param2Obj } from '@/utils'

const count = 24

function getAvgVal(type){
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

function getExtremeVal(type, low, sign){
  var value = ''
  if(type == '温度'){
    value = (low + sign * Mock.mock('@float(30, 40, 2, 2)') * 0.1).toFixed(2)
  }else if(type == '湿度'){
    value = (low + sign * Mock.mock('@float(60, 90, 2, 2)') * 0.1).toFixed(2)
  }else{
    value = (low + sign * Mock.mock('@float(0, 0, 2, 2)') * 0.1).toFixed(2)
  }
  return parseFloat(value)
}

function getRandomVal(type){
  var value = ''
  switch(type){
    case '温度':
      value = Mock.mock('@float(30, 40, 2, 2)')
      break
    case '湿度':
      value = Mock.mock('@float(60, 90, 2, 2)')
      break
    case '氨气浓度':
      value = parseFloat(Mock.mock('@float(0, 0, 2, 2)'))
      break
    default:
      break
  }
  return value
}

function createRandomRecord() {
  var list = []
  for (let i = 0; i < count; i++) {
      list.push(Mock.mock({
        id: '@increment(1)',
        collecttime: '@datetime',
        device: 2 * i,
        level: i % 3,
        'type|1': ['温度', '湿度', '氨气浓度', '上线', '下线'],
        remark: function(){
          return getRandomVal(this.type)
        }
      }))
    }
  return list
}

function generateResults(category){
  var list = []
  if(category == 'device'){
    for (let i = 0; i < count; i++) {
      list.push(Mock.mock({
        id: '@increment(1)',
        collecttime: '@date',
        device: 2 * i,
        avgTemp: getAvgVal('温度'),
        minTemp: function(){
          return getExtremeVal('温度', this.avgTemp, -1)
        },
        maxTemp: function(){
          return getExtremeVal('温度', this.avgTemp, 1)
        },
        avgHumid: getAvgVal('湿度'),
        minHumid: function(){
          return getExtremeVal('湿度', this.avgHumid, -1)
        },
        maxHumid: function(){
          return getExtremeVal('湿度', this.avgHumid, 1)
        },
        avgGas: getAvgVal('氨气浓度'),
        minGas: function(){
          return getExtremeVal('氨气浓度', this.avgGas, -1)
        },
        maxGas: function(){
          return getExtremeVal('氨气浓度', this.avgGas, 1)
        }
      }))
    }
  }else{
    for(let j = 0; j < 5; j++){
      for (let i = 0; i < Math.ceil(Math.random() * 3); i++) {
        list.push(Mock.mock({
          id: '@increment(1)',
          collecttime: '@date',
          device: 2 * j,
          avgTemp: getAvgVal('温度'),
          minTemp: function(){
            return getExtremeVal('温度', this.avgTemp, -1)
          },
          maxTemp: function(){
            return getExtremeVal('温度', this.avgTemp, 1)
          },
          avgHumid: getAvgVal('湿度'),
          minHumid: function(){
            return getExtremeVal('湿度', this.avgHumid, -1)
          },
          maxHumid: function(){
            return getExtremeVal('湿度', this.avgHumid, 1)
          },
          avgGas: getAvgVal('氨气浓度'),
          minGas: function(){
            return getExtremeVal('氨气浓度', this.avgGas, -1)
          },
          maxGas: function(){
            return getExtremeVal('氨气浓度', this.avgGas, 1)
          }
        }))
      }
    }
  }
  return list
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

function getList(config){
    const { page = 1, limit = 10, sort, category, perf, device } = param2Obj(config.url)
    let mockList = generateResults(category)
    const devices = device.split(',')
    if(category == 'device'){
      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
      let currentList = []
      for (let i = 0; i < pageList.length; i++) {
        let item = pageList[i]
        item['index'] = i + 1
        currentList.push(item)
      }
      return {
        table:{
          total: mockList.length,
          list: currentList
        },
        chart: mockList
      }
    }else{
      // 折线图  同一设备历史数据
      // 表格  同一时间不同设备
      const filterList = []
      const processMap = {}
      const processTimeMap = {}
      const timeArr = []
      for (var i = mockList.length - 1; i >= 0; i--) {
        for(var j = 0; j < devices.length; j++){
          var oneDevice = devices[j]
          if(mockList[i].device == devices[j]){
            let timepoint = mockList[i].collecttime
            if(timeArr.indexOf(timepoint) == -1){
              timeArr.push(timepoint)
            }
            let timeData = processTimeMap[timepoint]
            if(!timeData){
              timeData = []
            }
            timeData.push(mockList[i])
            processTimeMap[timepoint] = timeData
            let deviceData = processMap[oneDevice]
            if(!deviceData){
              deviceData = []
            }
            deviceData.push(mockList[i])
            processMap[oneDevice] = deviceData
          }
        }
      }
      for(var i = 0; i < timeArr.length; i++){
        var timeLine = []
        var date = timeArr[i]
        var dateData = processTimeMap[date]
        timeLine.push(date)
        for(var j = 0; j < devices.length; j++){
          var oneDevice = devices[j]
          for(var k = 0; k < dateData.length; k++){
            var value = '--'
            if(dateData[k]['device'] == oneDevice){
              value = dateData[k][perf]
            }
            timeLine.push(value)
          }
        }
        filterList.push(timeLine)
      }
      const pageList = filterList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
      return {
        table:{
          total: filterList.length,
          list: pageList
        },
        chart: {
          map: processMap,
          timeArr: timeArr
        }
      }
    }
  }

export default {
  queryDetails: config => {
    return getList(config)
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
  },
  searchLatestRecord: () => {
    const list = createRandomRecord()
    return list.slice(0, 10)
  }
}

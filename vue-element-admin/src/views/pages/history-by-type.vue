<template>
  <div class="app-container calendar-list-container">
    <!-- 可折叠面板 -->
    <el-collapse v-model="activeNames">
      <el-collapse-item name="condition">
        <template slot="title">
          <i class="header-icon el-icon-info"></i>统计条件
        </template>
        <el-form :model="form" :inline="true" ref="form" label-width="80px">
          <el-form-item label="时间">
            <el-date-picker v-model="form.selectedTime" type="date" placeholder="请选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="参数类型">
            <el-select v-model="form.perf" placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="指标类型">
            <el-select v-model="form.arg" placeholder="请选择">
              <el-option v-for="item in argOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备">
            <el-select v-model="form.device" filterable remote multiple :multiple-limit="maxInputs" placeholder="请选择" :remote-method="searchDeviceByRemote" :loading="loading">
              <el-option v-for="item in deviceOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-button type="primary" @click="getQueryResults">查询</el-button>
          <el-button type="primary">导出</el-button>
        </el-form>
      </el-collapse-item>
      <el-collapse-item name="chart">
        <template slot="title">
          <i class="header-icon el-icon-info"></i>曲线图
        </template>
        <high-chart v-if="!isFirst" id="deviceChart" :option="chartOptions" style="min-height:250px"></high-chart>
      </el-collapse-item>
      <el-collapse-item name="table">
        <template slot="title">
          <i class="header-icon el-icon-info"></i>数据
        </template>
        <!--表格-->
        <el-table v-if="!isFirst" :key="tableKey" :data="list" stripe border v-loading.body="listLoading" fit highlight-current-row height="250"
                  style="width: 100%">
          <el-table-column align="center" fixed label="序号" type="index" :index="initialIndex">
          </el-table-column>
          <el-table-column v-for="(item,index) in columns" :key="item" align="center" :label="item + ''">
            <template slot-scope="scope">
              <span>{{scope.row[index]}}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
  import {getDeviceByFuzzy} from 'api/device'
  import {searchWithCondition} from 'api/history'
  import {formatDate} from '@/utils/index'
  import {mapGetters} from 'vuex'
  import highChart from '@/components/Charts/highChart'

  export default {
    components: {highChart},
    name: 'history-by-type',
    data() {
      return {
        initialIndex: 1,
        activeNames: ['condition', 'chart', 'table'],
        form: this.init(),
        options: [{
          value: 'Temp',
          label: '温度'
        }, {
          value: 'Humid',
          label: '湿度'
        }, {
          value: 'Gas',
          label: '氨气浓度'
        }],
        argOptions: [{
          value: 'min',
          label: '最小值'
        }, {
          value: 'max',
          label: '最大值'
        }, {
          value: 'avg',
          label: '平均值'
        }],
        maxInputs: 4,
        deviceOptions: [],
        chartOptions: {},
        isFirst: true,
        loading: false,
        list: null,
        listLoading: true,  // 表格加载效果
        listQuery: {
          page: 1,
          limit: 24
        },
        category: 'type',
        tableKey: 5
      }
    },
    created() {

    },
    /*watch: {
      form: {
        handler: function(newForm){
          this.getQueryResults()
        },
        deep: true
      }
    },*/
    computed: {
      ...mapGetters([
        'elements'
      ]),
      indicator: function(){
        return this.form.arg + this.form.perf
      },
      columns: function(){
        return ['采集时间'].concat(this.form.device)
      }
    },
    methods: {
      init() {
        return {
          selectedTime: (function(){
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            return date
          })(),
          perf: 'Temp',
          arg: 'avg',
          device: undefined
        }
      },
      getQueryResults() {
        this.$refs.form.validate(valid => {
          if (valid) {
            const selectedTime = formatDate(this.form.selectedTime, 'yyyy-mm-dd')
            const type = this.indicator
            let queryParams = {
              selectedTime: selectedTime,
              perf: type,
              device: typeof(this.form.device) === 'string' ? this.form.device : this.form.device.join(',')
            }
            this.listLoading = true
            searchWithCondition(queryParams, this.category, this.listQuery).then(response => {
              this.isFirst = false
              const structure = response.data
              const tableData = structure.table
              this.list = tableData.list
              this.total = tableData.total
              this.listLoading = false
              const chartData = structure.chart.map
              const timeArr = structure.chart.timeArr
              this.chartOptions = this.createChartOption(chartData, type, timeArr)
            }).catch(() => {
              this.isFirst = false
            })
          } else {
            console.error('......')
            return false
          }
        })
      },
      getYAxisName(type){
        var val
        switch(type){
          case 'avgTemp':
            val = '温度平均值'
            break
          case 'minTemp':
            val = '温度最小值'
            break
          case 'maxTemp':
            val = '温度最大值'
            break
          case 'avgHumid':
            val = '湿度平均值'
            break
          case 'minHumid':
            val = '湿度最小值'
            break
          case 'maxHumid':
            val = '湿度最大值'
            break
          case 'avgGas':
            val = '温度平均值'
            break
          case 'minGas':
            val = '温度最小值'
            break
          case 'maxGas':
            val = '温度最大值'
            break
        }
        return val
      },
      createChartOption(chartData, type, timeArr){
        var values = []
        for(var key in chartData){
          var chartBean = chartData[i]
          var rawData = chartData[key]
          var lineData = []
          for(var i = 0; i < timeArr.length; i++){
            var value = '--'
            for(var j = 0; j < rawData.length; j++){
              var rawPerf = rawData[j]
              if(rawPerf['collecttime'] == timeArr[i]){
                value = rawPerf[type]
                break
              }
            }
            lineData.push(value)
          }
          values.push({
            name: key,
            type: 'line',
            data: lineData
          })
        }
        const yLabelName = this.getYAxisName(type)
        const option = {
          title: {
            text: ''
          },
          backgroundColor: '#fff',
          tooltip: {
            shared: true
          },
          // 是否显示'打印'、'导出'等功能按钮，不设置时默认为显示
          exporting:{
              enabled: false  
          },
          plotOptions: {
            series: {
              animation: false,
              connectNulls: true
            }
          },
          xAxis: {
            categories : timeArr
          },
          yAxis: {
            title: {
              text: yLabelName
            }
          },
          series: values
        }
        return option
      },
      searchDeviceByRemote(query) {
        if(query !== ''){
          this.loading = true
          getDeviceByFuzzy(query).then(response => {
              this.loading = false
              const devices = response.data
              const newOptions = []
              for(var i = 0; i < devices.length; i++){
                const oneDevice = devices[i]
                newOptions.push({
                  value: oneDevice.id,
                  label: oneDevice.comment
                })
              }
              this.deviceOptions = newOptions
            }).catch(() => {
              this.loading = false
            })
        }
      }
    }
  }
</script>

<style>
.el-dialog--small{
  width: 40% !important;
}
</style>
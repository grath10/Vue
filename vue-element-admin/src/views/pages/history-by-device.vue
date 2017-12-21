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
            <el-select v-model="form.type" placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备">
            <el-select v-model="form.device" filterable remote placeholder="请选择" :remote-method="searchDeviceByRemote" :loading="loading">
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
        <el-table v-if="!isFirst" :key="tableKey" :data="list" stripe border v-loading.body="listLoading" fit highlight-current-row height="250" style="width: 100%">
          <el-table-column align="center" fixed label="序号" type="index" width="70" :index="start"></el-table-column>
          <el-table-column align="center" label="采集时间" sortable width="200">
            <template scope="scope">
              <span>{{scope.row.collecttime}}</span>
            </template>
          </el-table-column>
          <el-table-column label="温度" align="center">
            <el-table-column align="center" label="平均值" sortable width="110">
              <template scope="scope">
                <span>{{scope.row.avgTemp}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="最大值" sortable width="110">
              <template scope="scope">
                <span>{{scope.row.maxTemp}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="最小值" sortable width="110">
              <template scope="scope">
                <span>{{scope.row.minTemp}}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="湿度" align="center">
            <el-table-column align="center" label="平均值" sortable width="110">
              <template scope="scope">
                <span>{{scope.row.avgHumid}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="最大值" sortable width="110">
              <template scope="scope">
                <span>{{scope.row.maxHumid}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="最小值" sortable width="110">
              <template scope="scope">
                <span>{{scope.row.minHumid}}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="氨气浓度" align="center">
            <el-table-column align="center" label="平均值" sortable width="110">
              <template scope="scope">
                <span>{{scope.row.avgGas}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="最大值" sortable width="110">
              <template scope="scope">
                <span>{{scope.row.maxGas}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" fixed="right" label="最小值" sortable width="110">
              <template scope="scope">
                <span>{{scope.row.minGas}}</span>
              </template>
            </el-table-column>
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
    components: { highChart },
    name: 'history-by-device',
    data() {
      return {
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
        category: 'device',
        tableKey: 4,
        start: 1
      }
    },
    created() {

    },
    watch: {
      form: {
        handler: function(newForm){
          this.getQueryResults()
        },
        deep: true
      }
    },
    computed: {
      ...mapGetters([
        'elements'
      ])
    },
    methods: {
      init() {
        return {
          selectedTime: (function(){
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            return date
          })(),
          type: 'Temp',
          device: undefined
        }
      },
      getQueryResults() {
        this.$refs.form.validate(valid => {
          if (valid) {
            const selectedTime = formatDate(this.form.selectedTime, 'yyyy-mm-dd')
            let queryParams = {
              selectedTime: selectedTime,
              type: this.form.type,
              device: this.form.device
            }
            this.listLoading = true
            var type = this.form.type
            searchWithCondition(queryParams, this.category, this.listQuery).then(response => {
              this.isFirst = false
              const structure = response.data
              const tableData = structure.table
              this.list = tableData.list
              this.total = tableData.total
              this.listLoading = false
              const chartData = structure.chart
              this.chartOptions = this.createChartOption(chartData, type)
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
        if(type == 'Temp'){
          val = '温度'
        }else if(type == 'Humid'){
          val = '湿度'
        }else{
          val = '氨气浓度'
        }
        return val
      },
      createChartOption(chartData, type){
        var xAxisArr = []
        var deltaData = []
        var avgArr = []
        for(var i = 0; i < chartData.length; i++){
          var chartBean = chartData[i]
          xAxisArr.push(chartBean['collecttime'])
          avgArr.push(chartBean['avg' + type])
          deltaData.push([chartBean['min' + type], chartBean['max' + type]])
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
            categories : xAxisArr
          },
          yAxis: {
            title: {
              text: yLabelName
            }
          },
          series: [{
            name: yLabelName + '波动范围',
            type: 'columnrange',
            data: deltaData
          }, {
            name: yLabelName + '平均值',
            type: 'line',
            data: avgArr
          }]
        }
        return option
      },
      searchDeviceByRemote(query) {
        if(query && query !== ''){
          this.loading = true
          getDeviceByFuzzy(query).then(response => {
              this.loading = false
              const devices = response.data
              var candidates = []
              for(var i = 0; i < devices.length; i++){
                const oneDevice = devices[i]
                candidates.push({
                  value: oneDevice.number,
                  label: oneDevice.comment
                })
              }
              this.deviceOptions = candidates
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
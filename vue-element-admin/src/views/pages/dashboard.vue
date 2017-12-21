<template>
  <div class="app-container calendar-list-container">
    <div>
      <el-row>
        <el-col :span="6" class="el-col-padding">
          <info-box cssClass="bg-aqua" iconClass="fa fa-thermometer" perf="温度" :value="temp" :firstMsg="tempFirst" :secondMsg="tempSecond"></info-box>
        </el-col>
        <el-col :span="6" class="el-col-padding">
          <info-box cssClass="bg-aqua" iconClass="fa fa-tint" perf="湿度" :value="humid" :firstMsg="humidFirst" :secondMsg="humidSecond"></info-box>
        </el-col>
        <el-col :span="6" class="el-col-padding">
          <info-box cssClass="bg-aqua" iconClass="fa fa-shower" perf="氨气浓度" :value="gas" :firstMsg="gasFirst" :secondMsg="gasSecond"></info-box>
        </el-col>
        <el-col :span="6" class="el-col-padding">
          <info-box cssClass="bg-aqua" iconClass="fa fa-tablet" perf="设备" :firstMsg="deviceFirst" :secondMsg="deviceSecond"></info-box>
        </el-col>
      </el-row>
    </div>
    <el-row>
      <el-col :span="12" class="el-col-padding">
        <!-- 可折叠面板 -->
        <el-collapse v-model="midActiveNames" accordion>
          <el-collapse-item name="condition">
            <template slot="title">
              <i class="header-icon el-icon-info"></i>实时播报
            </template>
            <el-form :model="form" :inline="true" ref="form" label-width="65px">
              <el-form-item label="类型">
                <el-select v-model="form.type" placeholder="请选择" class="input-selects-width">
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="">
                <el-select v-model="form.device" filterable placeholder="请选择设备">
                  <el-option v-for="item in deviceOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <high-chart v-if="!isFirst" id="deviceChart" :option="chartOptions" style="min-height:250px"></high-chart>
          </el-collapse-item>
        </el-collapse>
      </el-col>

      <el-col :span="12" class="el-col-padding">
        <el-collapse v-model="rightActiveNames" accordion>
          <el-collapse-item name="chart">
            <template slot="title">
              <i class="header-icon el-icon-info"></i>系统日志
            </template>
            <!--表格-->
            <el-table v-if="!isFirst" :key="rightTableKey" :data="logList" v-loading.body="listLoading" fit style="width: 100%">
              <el-table-column align="center" fixed label="状态" width="100">
                <template scope="scope">
                  <el-tag :type="formatLevel(scope.row.level)">{{showTip(scope.row.level)}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column align="center" label="设备" prop="device" width="120"></el-table-column>
              <el-table-column align="center" label="内容" width="100" prop="type"></el-table-column>
              <el-table-column align="center" label="信息" prop="remark"></el-table-column>
              <el-table-column align="center" label="时间" width="190" fixed="right" prop="collecttime"></el-table-column>
            </el-table>
          </el-collapse-item>
        </el-collapse>  
      </el-col>
    </el-row>
    
    <el-row style="margin-top:10px">
      <el-collapse v-model="bottomActiveNames" accordion>
        <el-collapse-item name="table">
          <template slot="title">
            <i class="header-icon el-icon-info"></i>历史数据
          </template>
          <!--表格-->
          <el-table v-if="!isFirst" :key="tableKey" :data="list" stripe border v-loading.body="listLoading" fit highlight-current-row height="250"
                    style="width: 100%">
            <el-table-column align="center" fixed label="序号" type="index" width="70" :index="startIndex"></el-table-column>
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
    </el-row>
  </div>
</template>

<script>
  import {getAllDevices} from 'api/device'
  import {searchWithCondition, searchLatestRecord} from 'api/history'
  import {formatDate} from '@/utils/index'
  import {mapGetters} from 'vuex'
  import HighChart from '@/components/Charts/highChart'
  import InfoBox from '@/components/InfoBox'

  export default {
    components: { HighChart, InfoBox },
    name: 'dashboard',
    data() {
      return {
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
        temp: '',
        humid: '',
        gas: '',
        tempFirst: '',
        tempSecond: '',
        humidFirst: '',
        humidSecond: '',
        gasFirst: '',
        gasSecond: '',
        deviceFirst: '',
        deviceSecond: '',
        deviceOptions: [],
        chartOptions: {},
        isFirst: true,
        loading: false,
        list: null,
        logList: null,
        listLoading: true,  // 表格加载效果
        listQuery: {
          page: 1,
          limit: 24
        },
        tableKey: 5,
        rightTableKey: 6,
        midActiveNames: ['condition'],
        bottomActiveNames: ['table'],
        rightActiveNames: ['chart'],
        startIndex: 1
      }
    },
    mounted() {
      this.loadingMask()
      this.getContentForBox()
      this.searchDeviceByRemote()
      this.getInfo()
    },
    watch: {
      form: {
        handler: function(newForm){
          this.getQueryResults()
        },
        deep: true
      }
    },
    methods: {
      init() {
        return {
          type: 'Temp',
          device: undefined
        }
      },
      loadingMask() {
        const maskLoading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        setTimeout(() => {
          maskLoading.close();
        }, 2000);
      },
      getContentForBox(){
        this.temp = '25.8℃'
        this.humid = '56.7%'
        this.gas = '0.07%'
        this.tempFirst = '<i class="fa fa-long-arrow-up max"></i> 一号设备<span>  74.2℃</span></span>'
        this.tempSecond = '<i class="fa fa-long-arrow-down min"></i> 二号设备<span>  78.2℃</span></span>'
        this.humidFirst = '<i class="fa fa-long-arrow-up max"></i> 一号设备<span>  56.8%</span></span>'
        this.humidSecond = '<i class="fa fa-long-arrow-down min"></i> 三号设备<span>  67.2%</span></span>'
        this.gasFirst = '<i class="fa fa-long-arrow-up max"></i> 一号设备<span>  0.09%</span></span>'
        this.gasSecond = '<i class="fa fa-long-arrow-down min"></i> 二号设备<span>  0.08%</span></span>'
        this.deviceFirst = '预警<span>  3起</span>'
        this.deviceSecond = '在线<span>  20台</span>'
      },
      formatLevel(level){
        if(level == 0){
          return 'success'
        }else if(level == 1){
          return 'warning'
        }else{
          return 'danger'
        }
      },
      showTip(level){
        if(level == 0){
          return '正常'
        }else if(level == 1){
          return '预警'
        }else{
          return '告警'
        }
      },
      getQueryResults() {
        this.$refs.form.validate(valid => {
          if (valid) {
            const date = new Date()
            const selectedTime = formatDate(date, 'yyyy-mm-dd')
            let queryParams = {
              selectedTime: selectedTime,
              type: this.form.type,
              device: this.form.device
            }
            this.listLoading = true
            var type = this.form.type
            searchWithCondition(queryParams, 'device', this.listQuery).then(response => {
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
      getInfo(){
        this.loading = true
        searchLatestRecord().then(response => {
          this.loading = false
          const tableData = response.data
          this.logList = tableData
        }).catch(() => {
          this.loading = false
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
      searchDeviceByRemote() {
        getAllDevices().then(response => {
          const devices = response.data
          for(var i = 0; i < devices.length; i++){
            const oneDevice = devices[i]
            this.deviceOptions.push({
              value: oneDevice.number,
              label: oneDevice.comment
            })
          }
          const selectedDevice = this.deviceOptions.length > 0 ? this.deviceOptions[0]['value'] : undefined
          this.form.device = selectedDevice
        }).catch(() => {
      })
    }
  }
}
</script>

<style>
.el-dialog--small{
  width: 40% !important;
}

.el-col-padding{
  padding-right: 15px;
}

.input-selects-width{
  width: 120px
}

.max {
  color: red
}

.min {
  color: green
}
</style>
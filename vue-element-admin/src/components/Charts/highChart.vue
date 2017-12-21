<template>
  <div class="chart">
    <div :id="id" :option="option"></div>
  </div>
</template>

<script>
  // import HighCharts from 'highcharts'
  // import HighchartsMore from '../../../node_modules/highcharts/highcharts-more.js'
  import HighCharts from 'highcharts/highstock'
  import HighchartsMore from 'highcharts/highcharts-more'
  HighchartsMore(HighCharts)

  export default {
    props: {
      id: {
        type: String
      },
      option: {
        type: Object
      }
    },
    mounted() {
      HighCharts.chart(this.id, this.option)
    },
    updated() {
      HighCharts.chart(this.id, this.option)
    }
  }
</script>

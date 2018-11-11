<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'

const animationDuration = 6000

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart()
    this.__resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100)
    window.addEventListener('resize', this.__resizeHandler)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    window.removeEventListener('resize', this.__resizeHandler)
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
       title: {
       text: "群体主体处在靶心区间时间",
       x:'center'
       },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 10,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: ['未达到靶心区间', '达到靶心区间', '超过靶心区间'],
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          // name:'time',
          // nameLocation:'middle',
          type: 'value',
          axisTick: {
            show: false
          }
        }],
        series: [{
          name: '人群主体达到靶心率的时间分布',
          type: 'bar',
          itemStyle:{
            normal:{
              color:function(params){
                var colorList=['#FAD860','#9BCA63','#C1232B'];
                return colorList[params.dataIndex]
              }
              ,
                    label: {
                        show: true,
                        position: 'top',
                        formatter: '{c}min'
                    }
            }
          },
          stack: 'vistors',
          barWidth: '60%',
          data: [20, 35, 5],
          animationDuration
        }
        // , {
        //   name: 'pageC',
        //   type: 'bar',
        //   stack: 'vistors',
        //   barWidth: '60%',
        //   data: [30, 52, 200, 334, 390, 330, 220],
        //   animationDuration
        // }
        ]
      })
    }
  }
}
</script>

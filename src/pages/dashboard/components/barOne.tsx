import React, { Component, useRef } from 'react'

import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/bar';  //折线图是line,饼图改为pie,柱形图改为bar
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/dataZoom';

function calcTotalDay(arr1: any, arr2: any[], index: number) {
  if(arr1.length && arr2.length) {
    return arr1[index] + arr2[index]
  } else {
    if(arr1.length && !arr2.length) {
      return arr1[index]
    } else if(!arr1.length && arr2.length) {
      return arr2[index]
    }
  }
}

interface IProps {
  id: string,
  // datas: any,
  totalCount: any,
  data1: any,
  data2: any,
  xAxisDatas: any
}

class ChartBar extends Component<IProps> {
  // const chartBar: any;
  state = {
    chartBar: {}
  }
  componentDidMount() {
    let { chartBar } = this.state
    const { id, data1, data2, xAxisDatas, legend } = this.props
    let chartDom: any;
    chartDom = document.getElementById(id)
    let bar = echarts.init(chartDom)

    let option = {}
    option = {
      color: ['#34BA91', '#FFA80C'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
      },
      grid: {
        left: '0',
        right: '0',
        top: '40',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: xAxisDatas,
        axisTick: { 
          alignWithLabel: true,
          lineStyle: {
            color: '#D9D9D9'
          }
        },
        axisLabel: {
          textStyle: {
            color: '#262626'
          }
        },
        axisLine: {
          lineStyle: { color: '#D9D9D9' }
        }
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false,
          lineStyle: { color: 'rgba(0,0,0,.65)' }
        },
        axisTick: {
          lineStyle: {
            color: '#ffffff'
          }
        },
        nameTextStyle: {
          color: '#FF0000'
        },
        splitLine: {
          lineStyle: {
            color: ['#E8E8E8'],
            type: 'dashed'
          }
        }
      },
      series: [
        {
          name: legend[0],
          type: 'bar',
          barWidth: '30%',
          barMinWidth: '22',
          stack: '总量',
          data: data1,
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                offset: 0,
                color: "#39D079"
              }, 
              {
                offset: 1,
                color: "#9FDD7E"
              }], false)
            }
          },
          label: { 
            show: true,
            position: 'top',
          },
        },
      ],
      dataZoom: [
        {
          type: 'slider',
          show: true,
          height: 25,
          bottom: 10,
          left: 30,
          right: 40,
          minValueSpan: 7,
          maxValueSpan: 30,
          dataBackground: {
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                    offset: 0, color: '#34BA91' // 0% 处的颜色
                }, {
                    offset: 1, color: '#34BA91' // 100% 处的颜色
                }],
                global: false // 缺省为 false
            }
            }
          }
        },
      ]
    }
    bar.setOption(option, true)
    this.setState({ chartBar: bar })
  }

  UNSAFE_componentWillReceiveProps({ data1, data2, xAxisDatas }: any) {
    const { chartBar } = this.state
    if(JSON.stringify(data1) !== JSON.stringify(this.props.data1) || JSON.stringify(data2) !== JSON.stringify(this.props.data2)) {
      let option = chartBar.getOption()
      option.xAxis[0].data = xAxisDatas
      option.series[0].data = data1
      // option.series[1].data = data2
      // option.series[1].label.formatter = ({ dataIndex }: any) => {
      //   return calcTotalDay(data1, data2, dataIndex) || ''
      // },
      chartBar.setOption(option)
    }
  }

  render() {
    const { id } = this.props
    return (
      <div id={id} style={{ width: '100%', height: 350 }}></div>
    )
  }
}

export default ChartBar
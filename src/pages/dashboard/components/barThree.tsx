import React, { Component, useRef } from 'react'

import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/bar';  //折线图是line,饼图改为pie,柱形图改为bar
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/dataZoom';

function calcTotalDay(arr1: any, arr2: any[], arr3: any[], index: number) {
  if(arr1.length && arr2.length && arr3.length) {
    return arr1[index] + arr2[index] + arr3[index]
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
    const { id, data1, data2, data3, xAxisDatas, legend } = this.props
    let chartDom: any;
    chartDom = document.getElementById(id)
    let bar = echarts.init(chartDom)

    let option = {}
    option = {
      color: ['#34BA91', '#FFA80C', '#FEA84B'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
      },
      legend: {
        itemWidth: 16,
        itemHeight: 16,
        itemGap: 20,
        top: 10,
        textStyle: {
          fontSize: 14
        },
        icon: 'rect',
        data: legend,
        selectedMode: false
      },
      grid: {
        left: '0',
        right: '0',
        top: '60',
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
          // barWidth: '30%',
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
          }
        },
        {
          name: legend[1],
          type: 'bar',
          barWidth: '30%',
          barMinWidth: '22',
          stack: '总量',
          data: data2,
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                offset: 0,
                color: "#F7DE16"
              }, 
              {
                offset: 1,
                color: "#FFE77A"
              }], false)
            }
          }
        },
        {
          name: legend[2],
          type: 'bar',
          barWidth: '30%',
          barMinWidth: '22',
          stack: '总量',
          label: { 
            show: true,
            position: 'top',
            formatter: ({ dataIndex }: any) => {
              return calcTotalDay(data1, data2, data3, dataIndex)
            },
          },
          data: data3,
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                offset: 0,
                color: "#FEA84B"
              }, 
              {
                offset: 1,
                color: "#FFC450"
              }], false)
            }
          }
        },
      ],
      dataZoom: [
        {
          type: 'slider',
          show: true,
          height: 20,
          bottom: 10,
          right: 5,
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

  UNSAFE_componentWillReceiveProps({ data1, data2, data3, xAxisDatas }: any) {
    const { chartBar } = this.state
    if(JSON.stringify(data1) !== JSON.stringify(this.props.data1) || JSON.stringify(data2) !== JSON.stringify(this.props.data2)) {
      let option = chartBar.getOption()
      option.xAxis[0].data = xAxisDatas

      option.series[0].data = data1

      option.series[1].data = data2

      option.series[2].data = data3
      option.series[2].label.formatter = ({ dataIndex }: any) => {
        return calcTotalDay(data1, data2, data3, dataIndex) || ''
      }

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
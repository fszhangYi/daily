import './index.less';
import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { removeDuplicate } from '../../utils';

const PieChart = ({ data }: any) => {
  let _data = removeDuplicate(data);
  const renderData = (_data || [])?.map((d: any) => ({ name: d?.name, value: d?.content.length }));
  console.log('renderData', renderData)
  const chartRef = useRef(null);
  let myChart: any = null;

  const renderChart = () => {
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)',
      },
      legend: {
        top: '0%',
        left: 'center',
        textStyle: {
          color: 'rgba(255,255,255,0.45)'
        }
      },
      series: [
        {
          name: '访问来源',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '60%'], // 调整饼图的位置
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              color: 'red',
              fontSize: '40',
              fontWeight: 'bold',
              position: 'outside', // 将标签显示在扇区外部
            }
          },
          labelLine: {
            show: false
          },
          data: renderData
        }
      ]
    };

    // 基于准备好的dom，初始化echarts实例
    const chartDom = chartRef.current as any;
    myChart = echarts.init(chartDom);
    // 调整图表容器的偏移位置
    if(chartDom) chartDom.style.marginTop = '0px';
    // 绘制图表
    myChart.setOption(option);
  };

  useEffect(() => {
    renderChart();
    return () => {
      // 组件卸载时清理资源
      myChart && myChart.dispose();
    };
  }, []);

  return <div ref={chartRef} style={{ width: '100%', height: '300px' }}></div>;
};

export default PieChart;

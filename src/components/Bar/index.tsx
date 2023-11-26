import './index.less';
import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { removeDuplicate } from '../../utils';


const BarChart = ({data}:any) => {
  let _data = removeDuplicate(data);
  const renderData = (_data || [])?.map((d: any) => ({ name: d?.name, value: d?.content.length }));
  const chartRef = useRef(null);
  let myChart: any = null;

  const renderChart = () => {
    const option = {
      tooltip: {},
      xAxis: {
        type: 'category',
        data: renderData.map((r:any)=>r?.name)
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'risks',
          type: 'bar',
          data: renderData.map((r:any)=>r?.content?.length)
        }
      ]
    };

    const chartDom = chartRef.current;
    myChart = echarts.init(chartDom);
    myChart.setOption(option);
  };

  useEffect(() => {
    renderChart();
    return () => {
      myChart && myChart.dispose();
    };
  }, []);

  return <div ref={chartRef} style={{ width: '100%', height: '260px' }}></div>;
};

export default BarChart;


import './index.less';
import React from 'react';
import Preview from '../../components/Preview';
import PieChart from '../../components/Pie';
import BarChart from '../../components/Bar';
import Already from '../../components/Already';
import StatisticTitle from '../../components/StatisticTitle';
import { Row, Spin } from 'antd';


const Satistics = ({
    spinning,
    todayData,
    visible2,
    setVisible2,
    todayPreData,
    setTodayPreData,
}: any) => {
    return (
        <div className='daily-form section' style={{ boxSizing: 'border-box', height: window.innerHeight }}>
        <Spin
          delay={500}
          spinning={spinning}
          tip={'waiting...'}
        >
          <Row justify={'center'} style={{
            position: 'fixed',
            top: 'calc(100vh + 10px)',
            width: 'calc(100% - 60px)',
            color: 'rgba(255, 255, 255, 0.7)',
          }}><span>-- Previous Page --</span></Row>
          <StatisticTitle />
          <PieChart data={todayData} />
          <Row justify={'center'}><span style={{ color: 'rgba(255,255,255,.45)' }}>日报内容统计结果</span></Row>
          <BarChart data={todayData} />
          <Row justify={'center'}><span style={{ color: 'rgba(255,255,255,.45)' }}>进度风险统计结果</span></Row>

          <Already showPreview={() => void setVisible2(true)} updateContent={setTodayPreData} data={todayData} />
          <Preview visible={visible2} data={todayPreData} onCancel={() => setVisible2(false)} />
        </Spin>
      </div>
    )
};

export default Satistics;
//@ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import Preview from './components/Preview';
import PieChart from './components/Pie';
import BarChart from './components/Bar';
import Already from './components/Already';
import DemoForm from './components/DemoForm';
import DailyTitle from './components/DailyTitle';
import Weather from './components/Weather';
import StatisticTitle from './components/StatisticTitle';
import Page1 from './pages/SubmitForm';
import Page2 from './pages/Satistics';
import { Row, Spin, message } from 'antd';
import { getWeather, getTodayData } from './utils';
import './App.less';
import axios from 'axios';
import fullpage from 'fullpage.js';
import 'fullpage.js/dist/fullpage.css';

const App = () => {
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [todayPreData, setTodayPreData] = useState('');
  const [weather, setWeather] = useState(null);
  const [todayData, setTodayData] = useState(null);
  const [content, setContent] = useState('');
  const [name, setName] = useState('');
  const [spinning, setSpinning] = useState(false);

  const handleFinish = () => {
    setSpinning(true);
    axios.post(process.env.REACT_APP_API_URL, { content, person: name })
      .then(response => {
        console.log(response.data);
        message.success(response.data);
        setSpinning(false);
        getTodayData().then(
          (rst) => void setTodayData(rst)
        );
      })
      .catch(error => {
        console.error(error);
        message.error('提交失败！');
        setSpinning(false);
      });
  };

  useEffect(() => {
    new fullpage('#fullpage', {
      credits: { enabled: false, label: '', position: 'right' },
      // fullpage.js的配置选项
      // 例如：sectionsColor, navigation等
    });
  }, [todayData]);

  useEffect(() => {
    getWeather().then(
      (rst) => void setWeather(rst)
    );
  }, [])

  useEffect(() => {
    getTodayData().then(
      (rst) => void setTodayData(rst)
    );
  }, [])

  return (
    <div id="fullpage">
      <Page1
        spinning={spinning}
        weather={weather}
        content={content}
        setContent={setContent}
        name={name}
        setName={setName}
        visible={visible}
        setVisible={setVisible}
        setSpinning={setSpinning}
        handleFinish={handleFinish}
      />


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
    </div>
  )
}

export default App;

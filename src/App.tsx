import React, { useState, useEffect } from 'react';
import Page1 from './pages/SubmitForm';
import Page2 from './pages/Satistics';
import { message } from 'antd';
import { getWeather, getTodayData } from './utils';
import './App.less';
import axios from 'axios';
// @ts-ignore
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
    axios.post(process.env.REACT_APP_API_URL as string, { content, person: name })
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
      <Page2
        spinning={spinning}
        todayData={todayData}
        visible2={visible2}
        setVisible2={setVisible2}
        todayPreData={todayPreData}
        setTodayPreData={setTodayPreData}
      />
    </div>
  )
}

export default App;

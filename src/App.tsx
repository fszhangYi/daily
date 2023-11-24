//@ts-nocheck
import React, { useState, useEffect } from 'react';
import Preview from './components/index';
import { Form, Select, Input, Button, Row, Col } from 'antd';
import { getWeather } from './utils/api';
import './App.less';

const { Option } = Select;

const DailyTitle = () => {
  // 创建一个日期对象
  const date = new Date();
  // 配置时区
  const options = { timeZone: 'Asia/Shanghai' };
  // 使用配置的时区将时间戳转化成时间字符串
  const formattedDate = date.toLocaleString('zh-CN', options);
  // 解析得到当前时间
  const today = formattedDate.split(" ")[0];
  return (
    <Row justify={'center'}>
      <h1>{`${today}日报填写`}</h1>
    </Row>
  )
}

const Weather = ({data}) => {
  if(!data) return <></>;
  const {high, low} = data;
  return (
    <Row justify={'center'}>
      <span>{`${low}-${high}`}</span>
    </Row>
  )
}

const options = [
  '陈驰',
  '达琦',
  '李新宇',
  '黄湘绯',
  '孙萌',
  '王桂颖',
  '徐志文',
  '姚治盟',
  '周莹',
  '张婷',
];

const DemoForm = ({ showPreview }) => {
  const onFinish = (values) => {
    console.log('Form values:', values);
  };

  return (
    <Form layout="vertical" onFinish={onFinish}>
      <Row>
        <Col span={24}>
          <Form.Item name="person" label="填写人" labelCol={3} wrapperCol={21}>
            <Select placeholder="请选择填写人">
              {options.map((option) => (
                <Option key={option} value={option}>
                  {option}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item name="content" label="文字输入框">
            <Input.TextArea placeholder="请输入内容" autoSize={{ minRows: 3, maxRows: 6 }} showCount={true} maxLength={1000}/>
          </Form.Item>
        </Col>
      </Row>
      <Row justify={'center'}>
        <Form.Item>
          <Button
            type="default"
            onClick={showPreview}
          >预览</Button>
          <Button type="primary" htmlType="submit" style={{ marginLeft: 10 }}>提交</Button>
        </Form.Item>

      </Row>
    </Form>
  );
};

const App = () => {
  const [visible, setVisible] = useState(false);
  const [weather, setWeather] = useState(null);

  useEffect(()=>{
    getWeather().then(
      (rst) => void setWeather(rst)
    );
  }, [])

  return (
    <div className='daily-form' style={{height: window.innerHeight}}>
      <DailyTitle />
      <Weather data={weather} />
      <DemoForm showPreview={() => setVisible(true)} />
      <Preview visible={visible} onCancel={() => setVisible(false)} />
    </div>
  )
}

export default App;

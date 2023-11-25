//@ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import Preview from './components/index';
import { Form, Select, Input, Button, Row, Col, Spin, Alert } from 'antd';
import { getWeather, formatContent } from './utils/api';
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

const Weather = ({ data, className }) => {
  if (!data) return <></>;
  console.log('data:', data)
  const { high, low, text_night, wc_day } = data;
  return (
    <Row justify={'space-between'} className={className} style={{ padding: '0 10px', margin: '0 0 10px 0' }}>
      <span>{`滨江区天气：${low}~ ${high}℃ `}</span>
      <span>{`${text_night}`}</span>
      <span>{`风况：${wc_day}`}</span>
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

const DemoForm = ({ showPreview, handleLoad, updateContent = () => { } }) => {
  const formRef = useRef();
  const onFinish = (values) => {
    console.log('Form values:', values);
  };

  return (
    <Form layout="vertical" onFinish={onFinish} ref={formRef}>
      <Row>
        <Col span={24}>
          <Form.Item name="person" label="填写人" labelCol={3} wrapperCol={21}>
            <Select size={'large'}>
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
          <Form.Item name="content" label="日报内容">
            <Input.TextArea autoSize={{ minRows: 3, maxRows: 6 }} showCount={true} maxLength={1000} onChange={
              (e) => {
                const val = e?.target.value ?? '';
                updateContent(val);
              }
            } />
          </Form.Item>
        </Col>
      </Row>
      <Row justify={'center'}>
        <Form.Item>
          <Button
            type="default"
            onClick={() => {
              handleLoad(true);
              const values = formRef.current?.getFieldsValue();
              if (!values) return;
              const { content } = values;
              if (!content) return;
              formatContent(content).then(data => {
                const { message: { content } } = data;
                console.log(content);
                const _c = content.replace(/^```(.*?)/, '').replace(/(.*?)```$/, '').trim();
                console.log(_c);
                formRef.current?.setFieldsValue({
                  content: _c,
                });
                handleLoad(false);
                updateContent(_c);
              });
            }}
            ghost
          >格式化</Button>
          <Button
            type="default"
            onClick={showPreview}
            style={{ marginLeft: 10 }}
          >预览</Button>
          <Button
            type="primary"
            htmlType="submit"
            style={{ marginLeft: 10 }}
          >提交</Button>
        </Form.Item>

      </Row>
    </Form>
  );
};

const App = () => {
  const [visible, setVisible] = useState(false);
  const [weather, setWeather] = useState(null);
  const [content, setContent] = useState('');
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    getWeather().then(
      (rst) => void setWeather(rst)
    );
  }, [])

  return (


    <div className='daily-form' style={{ height: window.innerHeight }}>
      <Spin 
        delay={500}
        spinning={spinning}
        tip={'formatting...'}
      >
        <DailyTitle />
        <Weather className={'weather'} data={weather} />
        <DemoForm 
          updateContent={setContent}
          showPreview={() => setVisible(true)} 
          handleLoad={setSpinning}
        />
        <Preview visible={visible} data={content} onCancel={() => setVisible(false)} />
      </Spin>

    </div>
  )
}

export default App;

//@ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import Preview from './components/index';
import { Form, Select, Input, Button, Row, Col, Spin, Avatar, message } from 'antd';
import { getWeather, formatContent, getTodayData } from './utils/api';
import './App.less';
import axios from 'axios';

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

const DemoForm = ({ showPreview, handleLoad, updateName, updateContent = () => { }, handleFinish }) => {
  const formRef = useRef();
  const onFinish = (values) => {
    handleFinish();
  };

  return (
    <Form layout="vertical" onFinish={onFinish} ref={formRef}>
      <Row>
        <Col span={24}>
          <Form.Item name="person" label="填写人" labelCol={3} wrapperCol={21}>
            <Select size={'large'} onSelect={
              (val) => {
                updateName(val ?? '')
              }
            }>
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
      <Row justify={'center'} style={{ marginTop: 24 }}>
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

const Already = ({ data, updateContent, showPreview }) => {
  return (
    <Row>
      {
        data?.map(
          d => {
            if (d?.name) {
              return (
                <>
                  <Avatar
                    style={{
                      backgroundColor: '#1677ff',
                      color: '#fff',
                      marginRight: 5
                    }}

                    onClick={() => {
                      updateContent(d?.content);
                      showPreview();
                    }}
                  >
                    {d?.name[0]}
                  </Avatar>
                </>

              )
            } else {
              return <></>;
            }
          }
        )
      }
    </Row>
  )
}

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
    <div className='daily-form' style={{ height: window.innerHeight }}>
      <Spin
        delay={500}
        spinning={spinning}
        tip={'waiting...'}
      >
        <DailyTitle />
        <Weather className={'weather'} data={weather} />
        <DemoForm
          updateContent={setContent}
          updateName={setName}
          showPreview={() => setVisible(true)}
          handleLoad={setSpinning}
          handleFinish={handleFinish}
        />
        <Already showPreview={()=>void setVisible2(true)} updateContent={setTodayPreData}  data={todayData} />
        <Preview visible={visible} data={`# ${name}日报内容\n${content}`} onCancel={() => setVisible(false)} />
        <Preview visible={visible2} data={todayPreData} onCancel={() => setVisible2(false)} />
      </Spin>

    </div>
  )
}

export default App;

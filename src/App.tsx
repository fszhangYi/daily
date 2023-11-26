//@ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import Preview from './components/index';
import { Form, Select, Input, Button, Row, Col, Spin, Avatar, message, Layout } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { getWeather, formatContent, getTodayData, removeDuplicate } from './utils';
import './App.less';
import axios from 'axios';
import fullpage from 'fullpage.js';
import 'fullpage.js/dist/fullpage.css';

const { Option } = Select;
const { Content } = Layout;

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

const StatisticTitle = () => {
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
      <h1>{`${today}日报统计`}</h1>
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

const men = ['陈驰', '达琦', '李新宇', '黄湘绯', '孙萌', '徐志文', '姚治盟'];
const women = ['王桂颖', '周莹', '张婷'];

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
            <Input.TextArea
              // autoSize={{ minRows: 3, maxRows: 6 }} 
              showCount={true}
              maxLength={1000}
              styles={{ textarea: { height: `calc(100vh - 415px)` } }}
              onChange={
                (e) => {
                  const val = e?.target.value ?? '';
                  updateContent(val);
                }
              }
            />
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
  let _data = removeDuplicate(data);
  // 消除重复
  // 没有填写的使用default占位，就像颜色历史一样
  const left = Math.max(0, 10 - (_data?.length || 0));
  if (left) {
    _data = _data?.concat(Array(left).fill({}));
  }

  const bgName = (name) => {
    return men.includes(name) ? 'rgb(200, 110, 165)' : '#fde3cf';
  }

  return (
    <Row className="already-submit">
      {
        _data?.map(
          d => {
            if (d?.name) {
              return (
                <>
                  <Avatar
                    size={45}
                    style={{
                      backgroundColor: bgName(d?.name),
                      // backgroundColor: '#fde3cf',
                      color: '#203a43',
                      marginRight: 10,
                      marginTop: 5,
                      fontFamily: 'DaoLiTi',
                    }}

                    onClick={() => {
                      updateContent(d?.content);
                      showPreview();
                    }}
                  >
                    <span style={{ fontFamily: 'DaoLiTi' }}>{d?.name[0]}</span>
                  </Avatar>
                </>
              )
            } else {
              return (
                <Avatar
                  size={45}
                  style={{
                    // backgroundColor: '#1677ff',
                    // color: '#fff',
                    marginRight: 10,
                    marginTop: 5,
                  }}
                  icon={<UserOutlined />}
                >
                </Avatar>
              );
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
    new fullpage('#fullpage', {
      credits: { enabled: false, label: '', position: 'right' },
      // fullpage.js的配置选项
      // 例如：sectionsColor, navigation等
    });
  }, []);

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
      <div className='daily-form section' style={{ boxSizing: 'border-box', height: window.innerHeight }}>
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
          <Row justify={'center'} style={{
            position: 'fixed',
            bottom: 10,
            width: 'calc(100% - 60px)',
            color: 'rgba(255, 255, 255, 0.7)',
          }}><span>-- Next Page --</span></Row>
          <Preview visible={visible} data={`# ${name}日报内容\n${content}`} onCancel={() => setVisible(false)} />
        </Spin>

      </div>
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
          <Already showPreview={() => void setVisible2(true)} updateContent={setTodayPreData} data={todayData} />
          <Preview visible={visible2} data={todayPreData} onCancel={() => setVisible2(false)} />

        </Spin>

      </div>
    </div>



  )
}

export default App;

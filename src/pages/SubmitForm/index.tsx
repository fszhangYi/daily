import React from 'react';
import { Row, Spin, message } from 'antd';
import { getWeather, getTodayData } from '../../utils';
import Preview from '../../components/Preview';
import DemoForm from '../../components/DemoForm';
import DailyTitle from '../../components/DailyTitle';
import Weather from '../../components/Weather';


const SubmitForm = ({
    spinning,
    weather,
    content,
    setContent,
    name,
    setName,
    visible,
    setVisible,
    setSpinning,
    handleFinish,
}: any) => {
    return (
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
    )
}

export default SubmitForm;
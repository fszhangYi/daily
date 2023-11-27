import './index.less';
import React from 'react';
import { Row } from 'antd';
// @ts-ignore
import { DotLoading } from 'antd-mobile'


const Weather = ({ data, className }: any) => {
    if (!data) return (
      <span style={{ fontSize: 14, padding: '0 10px', margin: '0 0 10px 0' }}>
        <DotLoading />
      </span>
    );
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

export default Weather;
import './index.less';
import React from 'react';
import { Row } from 'antd';

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

export default DailyTitle;
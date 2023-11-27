import './index.less';
import React, { useState, useEffect, useRef } from 'react';
import { Form, Select, Input, Button, Row, Col, Spin, Avatar, message, Layout } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { getWeather, formatContent, getTodayData, removeDuplicate } from '../../utils';

const { Option } = Select;

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

const DemoForm = ({ showPreview, handleLoad, updateName, updateContent = () => { }, handleFinish }: any) => {
    const formRef = useRef<any>();
    const onFinish = (values: any) => {
        handleFinish();
    };

    return (
        <Form layout="vertical" onFinish={onFinish} ref={formRef}>
            <Row>
                <Col span={24}>
                    <Form.Item 
                        name="person" 
                        label="填写人" 
                        // @ts-ignore
                        labelCol={3} 
                        // @ts-ignore
                        wrapperCol={21}
                    >
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
                            formatContent(content).then((data:any) => {
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

export default DemoForm;
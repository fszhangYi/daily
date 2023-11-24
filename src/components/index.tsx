//@ts-nocheck
import React from 'react';
import { Image, Col, Modal, Flex } from 'antd';
import showdown from 'showdown';
import './index.less';

const converter = new showdown.Converter();

function MarkdownComponent({ html }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

const Preview = ({ data, visible, onCancel }) => {
  const html = converter.makeHtml(data);
  console.log(html);
  return (
    <Modal
      className="poll-previw-modal"
      open={visible}
      title={<div style={{ height: 36 }}>Preview</div>}
      onCancel={onCancel}
      onOk={onCancel}
      cancelText="Return"
      okText={''}
      width={423}
      destroyOnClose={true}
      centered={true}
      footer={(_, { CancelBtn }) => (
        <>
          <CancelBtn />
        </>
      )}
      // 860
    >
      <div className="poll-modal-content">
        <Col span={24}>
          <MarkdownComponent html={html} />
        </Col>
      </div>
    </Modal>
  );
};

export default Preview;

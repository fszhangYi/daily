import './index.less';
import { Row, Avatar } from 'antd';
import { removeDuplicate } from '../../utils';
import { UserOutlined } from '@ant-design/icons';

const men = ['陈驰', '达琦', '李新宇', '黄湘绯', '孙萌', '徐志文', '姚治盟'];
const women = ['王桂颖', '周莹', '张婷'];

const Already = ({ data, updateContent, showPreview }: any) => {
    let _data = removeDuplicate(data);
    // 消除重复
    // 没有填写的使用default占位，就像颜色历史一样
    const left = Math.max(0, 10 - (_data?.length || 0));
    if (left) {
      _data = _data?.concat(Array(left).fill({}));
    }
  
    const bgName = (name: any) => {
      return men.includes(name) ? 'rgb(200, 110, 165)' : '#fde3cf';
    }
  
    return (
      <Row justify="center" className="already-submit">
        {
          _data?.map(
            (d: any) => {
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


  export default Already;
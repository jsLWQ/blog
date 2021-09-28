import { Avatar, Divider } from 'antd'
import '../static/style/components/author.css'

import {
  GithubFilled,
  QqCircleFilled,
  WechatFilled
} from '@ant-design/icons';

const Author = () => {

  return (
    <div className="author-div comm-box">
      <div> <Avatar size={100} src="https://avatars.githubusercontent.com/u/49663358?v=4" /></div>
      <div className="author-introduction">
        光头程序员，专注于WEB和移动前端开发。要录1000集免费前端视频的傻X。此地维权无门，此时无能为力，此心随波逐流。
        <Divider>社交账号</Divider>
        <Avatar size={28} icon={ <GithubFilled /> } className="account" />
        <Avatar size={28} icon={ <QqCircleFilled /> } className="account" />
        <Avatar size={28} icon={ <WechatFilled /> } className="account" />
      </div>
    </div>
  )

}

export default Author
import React, { Component, useState, useEffect } from 'react';
import '../static/style/components/header.css'
import Link from 'next/link';
import Router from 'next/router';
import { Row, Col, Menu } from 'antd'
import  * as Icon from '@ant-design/icons';

import { getTypeInfo } from '../apis/apiUrl'

const Header = () => {

  const [ navArray, setNavArray ] = useState([])

  useEffect(async () => {
    const res = await getTypeInfo()
    console.log('res',res)
    setNavArray(res.data.data)
  }, [])
  
  
  const hadnleClick = (e) => {
    console.log('e',e)
    if(e.key == 1) {
      Router.push('/')
    }else {
      Router.push(`/list?id=${ e.key }`)
    }
  }
    // const { HomeFilled, PlayCircleFilled, CameraFilled } = ICON
  return (
    <div className="header">
      <Row type="flex" justify="center">
        <Col xs={24} sm={24} md={10} lg={13} xl={11}>
          <span className="header-logo">
            <Link href={{ pathname: '/' }}>
              XX
            </Link>
          </span>
          <span className="header-txt">专注前端开发</span>
        </Col>

        <Col className="memu-div" xs={0} sm={0} md={14} lg={10} xl={7}>
          <Menu mode="horizontal" onClick={ hadnleClick }>
            {
              navArray.map(item => {
                return (
                  <Menu.Item key={ item.id }>
                    {
                      React.createElement(Icon[item.icon])
                    }
                    { item.typeName }
                  </Menu.Item>
                )
              })
            }
          </Menu>
        </Col>
      </Row>
    </div>
  )
}

export default Header;
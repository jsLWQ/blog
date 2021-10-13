import React, { Component, Fragment, useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head'
import { Row, Col, List, Breadcrumb } from 'antd'

import {
  CalendarFilled,
  FolderFilled,
  FireFilled
} from '@ant-design/icons';

import Header from '../components/Header.js';
import Author from '../components/Author.js';
import Advert from '../components/Advert.js';
import Footer from '../components/Footer.js';

import { getListById } from '../apis/apiUrl'
import { formatTimeToMonthDay } from '../utils/formatTime'
import { sessionStorageSetItem, sessionStorageGetItem } from '../utils/tool'

const Lists = (list) => {

  const [ mylist , setMylist ] = useState(list.data)

  useEffect(()=>{
    setMylist(list.data)
  })

  return (
    <Fragment>
      <Head>
        <title>List</title>
      </Head>
      <Header />

      <Row className="comm-main" type="flex" justify="center">
        <Col className="comm-left" xs={24} sm={24} md={16} lg={18} xl={14}>
          <div>

            <div className="bread-div">
              <Breadcrumb>
                <Breadcrumb.Item><a href="/">首页</a></Breadcrumb.Item>
                <Breadcrumb.Item>视频列表</Breadcrumb.Item>
              </Breadcrumb>
            </div>


            <List
              itemLayout="vertical"
              dataSource={mylist}
              renderItem={item => (
                <List.Item>
                  <div className="list-title">
                  <Link href={{pathname:'/detailed',query:{id:item.id}}}>
                    <a>{item.title}</a>
                  </Link>
                  </div>
                  <div className="list-icon">
                    <span><CalendarFilled /> { formatTimeToMonthDay(item.addTime, 'YYYY-MM-DD') }</span>
                    <span><FolderFilled /> { item.typeName }</span>
                    <span><FireFilled /> { item.view_count }人</span>
                  </div>
                  <div className="list-context">{item.introduce}</div>  
                </List.Item>
              )}
            />
          </div>
        </Col>
        <Col className="comm-right" xs={0} sm={0} md={7} lg={5} xl={4}>
          {/* 个人简介 */}
          <Author />
          <Advert />
        </Col>
      </Row>
      <Footer />
    </Fragment>
  )
}

Lists.getInitialProps = (context) => {
  let id = context.query.id

  // if (id) {
  //   sessionStorageSetItem('listId', id)
  // } else {
  //   id = sessionStorageGetItem('listId')
  // }

  const promise = new Promise((resolve,reject) => {
    
    getListById(id).then(res => {
      console.log('res',res)
      resolve(res.data)
    })
  })
  return promise
}

export default Lists;
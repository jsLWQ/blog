import React, { Component, Fragment, useState } from 'react';
import Link from 'next/link';

import Head from 'next/head'
import Router from 'next/router'
import { Row, Col,  List } from 'antd'
import axios from 'axios'

import {
  CalendarFilled,
  FolderFilled,
  FireFilled
} from '@ant-design/icons';

import Header from '../components/Header.js';
import Author from '../components/Author.js';
import Advert from '../components/Advert.js';
import Footer from '../components/Footer.js';

import '../static/style/pages/index.css'
import { formatTimeToMonthDay } from '../utils/formatTime'
import { getArticleList } from '../apis/apiUrl'

import marked from 'marked'
import hljs from "highlight.js";
import 'highlight.js/styles/monokai-sublime.css';

const Home = (list) => {

  const [ mylist , setMylist ] = useState(list.data)

  const renderer = new marked.Renderer();
  marked.setOptions({
    renderer: renderer,
    gfm: true,
    pedantic: false,
    sanitize: false,
    tables: true,
    breaks: false,
    smartLists: true,
    smartypants: false,
    sanitize:false,
    xhtml: false,
    highlight: function (code) {
      return hljs.highlightAuto(code).value;
    }
  }); 


  let goDetailed = (item) => {
    Router.push({
      pathname: 'detailed',
      query: {
        id: item.id
      }
    })
  }

    return (
      <Fragment>
        <Head>
          <title>Home</title>
        </Head>
        <Header />
        <Row className="comm-main" type="flex" justify="center">
          <Col className="comm-left" xs={24} sm={24} md={16} lg={18} xl={14}>
            <div>    
              <List
                header={<div>最新日志</div>}
                itemLayout="vertical"
                dataSource={mylist}
                renderItem={item => (
                  <List.Item>
                    <Link href={{pathname:'/detailed',query:{ id: item.id }}}>
                      {/* <a>{item.title}</a> */}
                      <div className="list-title">{item.title}</div>
                    </Link>
                    
                    <div className="list-icon">
                      <span><CalendarFilled /> { formatTimeToMonthDay(item.addTime, 'YYYY-MM-DD') }</span>
                      <span><FolderFilled /> { item.typeName }</span>
                      <span><FireFilled /> { item.view_count }人</span>
                    </div>
                    <div className="list-context" dangerouslySetInnerHTML={{__html:marked(item.introduce)}}></div>  
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

Home.getInitialProps = async () => {
  const promise = new Promise((resolve,reject) => {
    // axios('http://127.0.0.1:7001/default/getArticleList').then(res => {
    //   resolve(res.data)
    // })
    getArticleList().then(res => {
      resolve(res.data)
    })
  })
  return await promise
}

export default Home;
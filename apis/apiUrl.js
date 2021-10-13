import { baseUrl } from '../config/config'
import request from '../utils/request'

// let servicePath = {
//   getArticleList: baseUrl + 'getArticleList' ,  //  首页文章列表接口
//   getArticleById: baseUrl + 'getArticleById/',  // 文章详细页内容接口 ,需要接收参数
//   getTypeInfo: baseUrl + 'getTypeInfo' // 类型
// }

export function getArticleList (data) {
  return request({
    url: 'getArticleList',
    method: 'get',
    data: data
  })
}

export function getArticleById (data) {
  return request({
    url: `getArticleById/${ data.id }`,
    method: 'get'
  })
}

export function getTypeInfo (data) {
  return request({
    url: `getTypeInfo`,
    method: 'get',
    data
  })
}

export function getListById (data) {
  console.log('data',data)
  return request({
    url: `getListById/${ data }`,
    method: 'get',
    data
  })
}

// export default servicePath;
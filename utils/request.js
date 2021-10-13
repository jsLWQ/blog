import axios from 'axios'
import { baseUrl as baseURL } from '../config/config'

// 创建axios实例
const service = axios.create({
  baseURL: baseURL, // process.env.BASE_API, // api 的 base_url
  timeout: 15000, // 请求超时时间
  withCredentials: true
})

// request拦截器
service.interceptors.request.use(
  config => {
    config.url = baseURL + config.url
    // console.log('config---',config)
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    if (!config.data) config.data = {};
    config.method = config.method || 'post';

    // 默认需要登录的接口 强制登录；若未登录静默 则需在接口单独配置forceLogin 参数
    // if (config.forceLogin !== false) {
    //   config.forceLogin = true;
    // }
    return config
  },
  error => {
    console.warn('request error', error)
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    // console.log('res24',response)
    const res = response;
    // console.log(response, 'response-----=-=---=--=-=-=-==-')
    // 1006 登录失效
    // 1008 网关检验失败：cookie里通过token解出来的租户Id和入参里的不一致
    // if (!res) {
    //   Toast(!netWork ? ABNORMAL_MSG.NETWORK_OFFLINE : ABNORMAL_MSG.SERVER_ERROR)
    //   return Promise.reject(res)
    // }
    // if (res.code === 1008) {
    //   loginService.kickOut();
    //   // toLogin();
    //   return;
    // }
    // if (res.code === 1006) {
    //   console.warn('用户鉴权失败:', res)
    //   loginService.kickOut();
    //   if (response.config.forceLogin) {
    //     // toLogin();
    //     return;
    //   }
    // }

    // // 微信未绑定手机号
    // if (res.code === 2352) {
    //   return Promise.reject(res)
    // }
    return Promise.resolve(res);
  },
  error => {
    const netWork = window.navigator.onLine;
    console.warn('response error2:', error);
    // Toast(!netWork ? ABNORMAL_MSG.NETWORK_OFFLINE : ABNORMAL_MSG.SERVER_ERROR)
    return Promise.reject(error)
  }
)

function toLogin() {
  // 正在登陆 避免重复跳登录
  if (window.logining) return;
  window.logining = true;
  // 开发环境
  if (process.env.NODE_ENV === 'development') {
    if (isWeiXin()) {
      const openId = prompt('开发模式，请手动输入openId进行登录：', '987654321012456');
      if (openId) {
        const toast = Toast.$create({
          txt: '正在登录',
          mask: true,
          time: 120 * 1000
        });
        toast.show();
        service({
          url: '/m/v1/passenger/user/wx/login',
          method: 'post',
          data: { openid: openId }
        }).then(r => {
          if (r.code === 1) {
            // todo: 存储信息要按cp 存储
            const loginData = {
              ...res.data,
              openId: this.getOpenIdData.openId
            };
            loginService.onLogin(loginData);
            // localStorage.setItem('openId', openId)
            // localStorage.setItem('passenger', JSON.stringify(r.data.passenger || {}))
            // 本地域名微信授权校验不通过
            location.reload();
          }
          setTimeout(() => {
            toast.hide()
            window.logining = false
          }, 200)
        }).catch(e => {
          toast.hide()
          window.logining = false
        })

      } else {
        window.logining = false;
      }
    } else {
      console.log('development 非微信')
      const currentQuery = router.history.current && router.history.current.query || {}
      router.push({
        name: 'Login',
        query: {
          ...currentQuery
        }
      });
    }
    return
  }

  // 线上环境
  if (isWeiXin()) { //微信环境走微信授权登录
    window.logining = false;
    globalMethos.getAppConfig().then((res) => {
      const weChatAppId = res.weChatAppId;
      if (!weChatAppId) {
        console.warn('无weChatAppId');
      }
      let query = router.history.current.query;
      let queryConfig = {
        ...query,
        // cid: tenantId,
        t_c: query.t_c || tenantId
      };
      const urlParam = setUrlParam(queryConfig);
      wxSDK.authorize(location.href.replace(location.hash, '#/login?' + urlParam), weChatAppId)
    }).catch((err) => {
      console.warn('获取weChatAppId失败', err);
    });
  } else {
    console.log('production 非微信')
    const currentQuery = router.history.current && router.history.current.query || {}
    router.push({
      name: 'Login',
      query: {
        ...currentQuery
      }
    });
  }
}

export default service
export {
  toLogin
}

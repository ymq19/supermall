import axios from 'axios'

export function request(config) {
  // 1. 创建axios的实例
  const instance = axios.create({
    baseURL: 'http://152.136.185.210:8000/api/h8',
    timeout: 5000,
    headers: {

    }
  })

  // axios的拦截器
  instance.interceptors.request.use(config => {
    // 配置config中一些信息
    // 比如在每次发送网络请求时，都希望在界面中显示一个请求的图标
    // 某些网络请求（比如登录），必须携带一些特殊的信息
    return config
  }, err => {
    console.log(err)
  })
  // 响应拦截
  instance.interceptors.response.use(res => {
    return res
  }, err => {
    console.log(err)
  })

  // 发送真正的网络请求(这本身就是Promise)
  return instance(config)
}
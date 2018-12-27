import api from 'axios'
const service = api.create({})
service.interceptors.request.use(
  config => {
    // if (store.state.token) {
    //   config.headers.Authorization = store.state.token
    // } else {
    //   window.location.href = 'http://localhost:8088/#' + '/login'
    // }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
service.interceptors.response.use(
  res => {
    if (res.data.ERR_MSG === 1001 || res.data.ERR_MSG === '1001') {
      console.log('用户登录失效')
      window.location.href = res.request.responseURL.substr(0,res.request.responseURL.lastIndexOf('/RKDC') + 1)
    }
    return res
  },
  res => {
    return Promise.reject(res)
  }
)
export default service

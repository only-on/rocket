import axios from './index'
let base = '/RKDC'
// 区域选择
export const getRegion = params => { return axios.post(`${base}/station`, params) }
// 登录
export const Login = params => { return axios.post(`${base}/login`, params) }
// 注销
export const Logout = params => { return axios.post(`${base}/logout`, params) }
// 发送验证码
export const sendCode = params => { return axios.post(`${base}/send_code`, params) }
// 找回密码
export const resetCode = params => { return axios.post(`${base}/reset_pw`, params) }
// 个人信息
export const personInfor = params => { return axios.post(`${base}/user`, params) }
// 个人信息修改
export const UserEdit = params => { return axios.post(`${base}/update_user`, params) }
// 用户
export const User = params => { return axios.post(`${base}/user`, params) }
// 站点
export const Station = params => { return axios.post(`${base}/station`, params) }
// 厂商
export const Vendor = params => { return axios.post(`${base}/vendor`, params) }
// 炮弹类型型号
export const shells = params => { return axios.post(`${base}/product`, params) }
// 炮弹库存
export const shellsStock = params => { return axios.post(`${base}/stock`, params) }
// 禁射区管理
export const stationRule = params => { return axios.post(`${base}/station_rule`, params) }
//发射数量统计
export const Launch = params => { return axios.post(`${base}/launch`, params) }
//告警规则
export const alarms = params => { return axios.post(`${base}/stock_alarm`, params) }
//位置信息
export const Location = params => { return axios.post(`${base}/location`, params) }
//作业问题记录
export const workLog = params => { return axios.post(`${base}/work_log`, params) }
// 获取终端状态
export const Operate = params => { return axios.post(`${base}/operate`, params) }

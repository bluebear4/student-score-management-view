import axios from 'axios'

// 创建 axios 实例
const request = axios.create({
    // API 请求的默认前缀
    baseURL: window.location.protocol + '//' + window.location.hostname + '/api/',
    timeout: 3000 // 请求超时时间
})


export default request

export function requestFailed(vue, err) {
    vue.$notification['error']({
        message: '错误',
        description: ((err.response || {}).data || {}).message || '请求出现错误，请稍后再试',
        duration: 4
    })
}
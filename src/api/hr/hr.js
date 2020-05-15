import axios from 'axios'
//不懂axios可以看看官网
/*https://www.kancloud.cn/yunye/axios/234845*/
let base = '/hr'

// 带参数的post请求
function postRequest(url, params) {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params,
    })
}

//  没有baseURL的不带参数的post请求
function postRequest0(url) {
    return axios({
        method: 'post',
        url: `${url}`
    })
}

// 不带参数的post请求
function postRequest1(url) {
    return axios({
        method: 'post',
        url: `${base}${url}`
    })
}

// 不带参数的get请求
function getRequest(url) {
    return axios({
        method: 'get',
        url: `${base}${url}`
    })
}

export default {
    postRequest0,
    postRequest,
    postRequest1,
    getRequest,
}

/*url为路径，data作为请求主体被发送的数据*/
// export const postRequst = (url, params) => {
//     return axios({
//         method: 'post',
//         url: `${base}${url}`,
//         data: params,
//     })
// }
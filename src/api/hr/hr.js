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

// 带参数的get请求
function getRequest1(url, params) {
    let page = params.page
    let limit = params.limit
    return axios({
        method: 'get',
        url: `${base}${url}`,
        params: {
            page: page,
            // 默认是6条可以选择不带参数
            limit: limit
        }
    })
}

function getRequest2(url, params) {
    let page = params.page
    let limit = params.limit
    let state = params.state
    return axios({
        method: 'get',
        url: `${base}${url}`,
        params: {
            state: state,
            page: page,
            // 默认是6条可以选择不带参数
            limit: limit
        }
    })
}

function getRequest3(url, params) {
    let title = params
    return axios({
        method: 'get',
        url: `${base}${url}`,
        params: {
            title: title
        }
    })
}

// 不带参数的put请求
function putRequest(url) {
    return axios({
        method: 'put',
        url: `${base}${url}`,
    })
}

// 带参数的put请求
function putRequest1(url, params) {
    return axios({
        method: 'put',
        url: `${base}${url}`,
        data: params
    })
}

export default {
    postRequest0,
    postRequest,
    postRequest1,
    getRequest,
    getRequest1,
    getRequest2,
    getRequest3,
    putRequest,
    putRequest1
}

/*url为路径，data作为请求主体被发送的数据*/
// export const postRequst = (url, params) => {
//     return axios({
//         method: 'post',
//         url: `${base}${url}`,
//         data: params,
//     })
// }
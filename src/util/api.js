import axios from 'axios'
//不懂axios可以看看官网
/*https://www.kancloud.cn/yunye/axios/234845*/
let base = '/hr'

// 登陆请求
function postRequst(url, params) {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params,
    })
}

/*url为路径，data作为请求主体被发送的数据*/
// export const postRequst = (url, params) => {
//     return axios({
//         method: 'post',
//         url: `${base}${url}`,
//         data: params,
//     })
// }

//  退出登陆请求
function logoutRequest(url) {
    return axios({
        method: 'post',
        url: `${url}`
    })
}

// 请求hr个人信息
function hrInfoRequest(url) {
    return axios({
        method: 'post',
        url: `${base}${url}`
    })
}

// 请求所有简历信息
function getAllResumeInfo(url) {
    return axios({
        method: 'get',
        url: `${base}${url}`
    })
}

export default {
    postRequst,
    logoutRequest,
    hrInfoRequest,
    getAllResumeInfo
}
import axios from 'axios'
//不懂axios可以看看官网
/*https://www.kancloud.cn/yunye/axios/234845*/
let base='/hr'
/*url为路径，data作为请求主体被发送的数据*/
export const postRequst=(url,params)=>{
    return axios({
        method:'post',
        url:`${base}${url}`,
        data:params,
    })
}





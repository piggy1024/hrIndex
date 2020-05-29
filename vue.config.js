// let proxyObj = {};

/*changOrign是改变请求头的意思，把它改成target*/
// proxyObj['/'] = {
//     ws: false,
//     target: 'http://localhost:8080',
//     changeOrigin: true,
//     pathRewrite: {
//         '^/': '',
//     }
// }



module.exports = {
    //配置端口转发，开发时这样做可以解决前后端跨域问题，部署可以打包放在后端，和后端同一个端口不会出现跨域问题
    // devServer: {
    //     host: 'localhost',
    //     port: 8081,
    //     proxy: proxyObj,
    // },
    //配置打包路径,详情可以看官网vue-cli
    //https://cli.vuejs.org/zh/config/#publicpath
    outputDir: 'dist', //默认，可写可不写
    assetsDir: './',
    publicPath: './',
}
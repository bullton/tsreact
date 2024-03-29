const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
    app.use(
        createProxyMiddleware('/api', {
            target: "http://localhost:3001", // 后台服务地址以及端口号
            changeOrigin: true, // 是否开启代理,
            secure: false,
            pathRewrite: { '^/api1': '' }
            // pathRewrite: {
            //     "^/api": "", // 代理名称
            // },
        })
    );
};
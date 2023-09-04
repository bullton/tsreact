const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
    app.use(
        "/api",
        createProxyMiddleware({
            target: "http://107.174.247.111:3001", // 后台服务地址以及端口号
            changeOrigin: true, // 是否开启代理
            pathRewrite: {
                "^/api": "/api", // 代理名称
            },
        })
    );
};
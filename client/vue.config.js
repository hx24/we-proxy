module.exports = {
    devServer: {
        port: 4000,     // 端口
    },
    chainWebpack: config => {
        config.plugin('define').tap(args => {
            args[0]['process.env'].NODE_ENV = JSON.stringify(process.env.NODE_ENV)
            return args
        })
    },
    lintOnSave: false
}
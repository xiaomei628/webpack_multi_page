const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const notifier = require('node-notifier')
const common = require('./webpack.common.js')
const config = require('./config')

devWebpackConfig = merge(common, {
    mode: 'development',
    output: {
        path: config.dev.assetsRoot,
        filename: '[name].js',
        chunkFilename: '[name].min.js',
        publicPath: config.dev.assetsPublicPath
    },
    devtool: "inline-source-map", // development environment
    devServer: { // local server
        contentBase: "./dist",
        host: config.dev.host,
        port: config.dev.port,
        inline: true,
        historyApiFallback: true,
        hot: true,
        proxy: {
            '/api': {
                target: '', // environment;
                changeOrigin: true,
                secure: false,
            },
        }
    },
})

devWebpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin())
devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
    compilationSuccessInfo:{
        message:[`请打开：http://${config.dev.host}:${config.dev.port}`],
    },
    onErrors:function(severity,errors){
        if (severity !== 'error') {
            return;
          }
          const error = errors[0];
          notifier.notify({
            title: "Webpack error",
            message: severity + ': ' + error.name,
            subtitle: error.file || '',
          });
    },
    // clean console
    // default true
    clearConsole:true,
}))

module.exports = devWebpackConfig
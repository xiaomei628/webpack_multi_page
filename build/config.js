const path = require('path')

module.exports = {
    build: {
        assetsRoot: path.join(__dirname, '..', 'dist'),
        assetsSubDirectory: 'static',
        assetsPublicPath: '../',
        bundleAnalyzer: false,
        gzip: true
    },
    dev: {
        assetsRoot: path.join(__dirname, '..', 'dist'),
        assetsSubDirectory: 'static',
        assetsPublicPath: 'http://localhost:8888/',
        host: 'localhost',
        port: 8888
    }
}
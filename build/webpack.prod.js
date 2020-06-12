const path = require('path')
const merge = require('webpack-merge')
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin")
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const PurifyCSS = require("purifycss-webpack")
const glob = require("glob-all")
const common = require('./webpack.common.js')
const config = require('./config')

prodWebconfig = merge(common, {
    mode: 'production',
    output: {
        path: config.build.assetsRoot,
        filename: 'js/[name].[chunkhash].[contenthash:8].js',
        chunkFilename: 'js/[name]_[chunkhash].[contenthash:8].min.js',
        publicPath: config.build.assetsPublicPath
    },
    devtool: "source-map", // production
    optimization: { // code segmentation, and pack public module
        splitChunks: {
            cacheGroups: {
                // pack public code in business
                common: {
                    name: "common",
                    chunks: "initial",
                    minSize: 1,
                    priority: 0,
                    minChunks: 2, // it is packed after 2 references
                },
                // pack files for third-party libraries
                vendor: {
                    name: "vendor",
                    test: /[\\/]node_modules[\\/]/,
                    chunks: "initial",
                    priority: 10,
                    minChunks: 2, // it is packed after 2 references
                }
            }
        },
        runtimeChunk: { name: 'manifest' },
        minimizer: [
            new OptimizeCssAssetsWebpackPlugin(),
            new UglifyJsPlugin({
                test: /\.js(\?.*)?$/i
            }),
        ]
    }
})

prodWebconfig.plugins.push(new HardSourceWebpackPlugin())
// copy custom static assets
prodWebconfig.plugins.push(new CopyWebpackPlugin({
    patterns: [
        {
            from: path.resolve(__dirname, '../static'),
            to: config.build.assetsSubDirectory,
            globOptions: {
                ignore: ['.*']
            }
        }
    ]
}))
// css tree-shaking
prodWebconfig.plugins.push(new PurifyCSS({
    paths: glob.sync([
        path.join(__dirname, '..', 'dist/*.html'),
        path.join(__dirname, '..', 'dist/css/*.css'),
        path.join(__dirname, '..', 'dist/js/*.js'),
    ])
}))
// gzip compression
if (config.build.gzip) {
    prodWebconfig.plugins.push(new CompressionWebpackPlugin({
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: /(\.js$|\.css$)/,
        threshold: 10240,
        minRatio: 0.8
    }))
}
// bundle analyzer
if (config.build.bundleAnalyzer) {
    prodWebconfig.plugins.push(new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        openAnalyzer: true,
        analyzerPort: 9528,
    }))
}

module.exports = prodWebconfig
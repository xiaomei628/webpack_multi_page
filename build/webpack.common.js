const path = require('path')
const glob = require('glob')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MinCssExtractPlugin = require("mini-css-extract-plugin")
const ProgressBarPlugin = require('progress-bar-webpack-plugin')

const getEntry = () => {
    const entry = {}
    const htmlWebpackPlugins = []
    const entryFiles = glob.sync(path.join(__dirname, '..', './src/pages/*/index.js'))
    Object.keys(entryFiles).map(index => {
        const entryFile = entryFiles[index]
        const match = entryFile.match(/\/pages\/(.+)\/index.js/)
        const pathname = match && match[1]
        //设置入口对象
        entry[pathname] = entryFile
        //设置html-webpack-plugin设置
        htmlWebpackPlugins.push(
            new HtmlWebpackPlugin({
                // favicon: path.resolve(__dirname, '../assets/lib/favicon-144.png'),
                template: path.join(__dirname, '..', `src/pages/${pathname}/index.html`),
                filename: `./pages/${pathname}.html`,
                chunks: [pathname],
                inject: true,
                minify: {
                    html5: true,
                    collapseWhitespace: true,
                    preserveLineBreaks: false,
                    minifyJS: true,
                    minifyCSS: true,
                    removeComments: false
                }
            })
        )
    })
    return {
        entry,
        htmlWebpackPlugins
    }
}

const getPlugins = () => {
    const NODE_ENV = process.env.NODE_ENV
    let filename = "css/[name]_[chunkhash:8].css"
    if (NODE_ENV === "development") filename = "css/[name].css"
    const plugins = [
        new MinCssExtractPlugin({
            filename: filename,
        }),
        new CleanWebpackPlugin(),
        new ProgressBarPlugin(),
    ]
    return plugins
}

const { entry, htmlWebpackPlugins } = getEntry()
module.exports = {
    entry: entry,
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader',
                include: [path.resolve(__dirname, '..', 'src')],
            },
            {
                test: /\.css$/,
                use: [
                    // { loader: 'style-loader' }, // 配置MinCssExtractPlugin.loader后，此项就无需配置
                    { loader: MinCssExtractPlugin.loader },
                    { loader: 'css-loader' },
                    { loader: 'postcss-loader' },
                ]
            },
            {
                test: /\.less$/,
                use: [
                    // { loader: 'style-loader' },
                    { loader: MinCssExtractPlugin.loader },
                    { loader: 'css-loader' },
                    { loader: 'postcss-loader' },
                    { loader: 'less-loader' },
                ]
            },
            {
                test: /\.(scss|sass)$/,
                use: [
                    // { loader: 'style-loader' },
                    { loader: MinCssExtractPlugin.loader },
                    { loader: 'css-loader' },
                    { loader: 'postcss-loader' },
                    { loader: 'sass-loader' },
                ]
            },
            {
                test: /\.(jpe?g|png|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            name: '[contentHash:8].[ext]',
                            limit: 3 * 1024, // 小于2kb话，转为base64
                            esModule: false,
                            outputPath: 'assets/images'
                        }
                    },
                    // 对图片资源进行压缩处理
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            mozjpeg: {
                                progressive: true,
                                quality: 65
                            },
                            optipng: {
                                enabled: false,
                            },
                            pngquant: {
                                quality: [0.65, 0.90],
                                speed: 4
                            },
                            gifsicle: {
                                interlaced: false,
                            },
                            webp: {
                                quality: 75
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
                use: 'file-loader'
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                use: 'file-loader'
            },
            {
                test: /\.(html|htm)$/i,
                use: 'html-withimg-loader', // 解析 html中的图片资源
            },
        ]
    },
    plugins: [
        ...htmlWebpackPlugins,
        ...getPlugins()
    ],
}
/**
 * Created by Jimmy on 2017/8/25.
 */
/**
 * Created by Jimmy on 2017/5/22.
 */
var path = require('path');
var webpack = require('webpack');
var glob = require('glob');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');
var CleanPlugin = require('clean-webpack-plugin');
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
var getEntry = function () {
    var entry = {};
    //读取开发目录,并进行路径裁剪
    glob.sync('./src/*.js')
        .forEach(function (name) {
            var start = name.indexOf('src/') + 4,
                end = name.length - 2;
            var n = name.slice(start, end);
            n = n.slice(0, n.lastIndexOf('/'));
            //保存各个组件的入口
            entry[n] = name;
        });
    entry.commons = ['angular', 'angular-ui-router'];
    return entry;
};
var prod = process.env.NODE_ENV === 'production' ? true : false;
module.exports = {
    entry: getEntry(),
    output: {
        path: path.resolve(__dirname, prod ? "./dist" : "./build"),
        filename: prod ? "js/[name].[chunkhash:8].js" : "js/[name].js",
        chunkFilename: 'js/[name].[chunkhash:8].js',
        publicPath: prod ? "/" : "/"
    },
    resolve: {
        //配置项,设置忽略js后缀
        extensions: ['.js', '.less', '.css', '.png', '.jpg'],
        modules: ['./src', 'node_modules'],
        // 模块别名
        alias: {}
    },
    module: {
        loaders: [{
            test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svgz)(\?.+)?$/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'images/[hash:16].[ext]'
                }
            }]
        }, {
            test: /\.js$/,
            loader: "babel-loader",
            query: {presets: ['es2015']},
            exclude: /node_modules/
        }, {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract({fallback: 'style-loader', use: 'css-loader'})
        }, {
            test: /\.less$/,
            loader: ExtractTextPlugin.extract({fallback: 'style-loader', use: 'css-loader!less-loader'})
        }, {
            test: /\.scss$/,
            loader: ExtractTextPlugin.extract({fallback: 'style-loader', use: 'css-loader!postcss-loader!sass-loader'})
        }, {
            test: /\.svg$/,
            use: ['xml-loader']
        }, {
                test: /\.html$/,
                loader: 'raw-loader',
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: function () {
                    return [
                        require("autoprefixer")({
                            browsers: ['ie>=8', '>1% in CN']
                        })
                    ]
                }
            }
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html',
            inject: 'body',
            favicon: "./src/favicon.ico",
            hash: true
        }),
        new ExtractTextPlugin({
            filename: '[name][chunkhash:8].css',
            allChunks: false
        }),
        new webpack.NoEmitOnErrorsPlugin(),
        new OpenBrowserPlugin({
            url: 'http://localhost:9084'
        }),
        /* 公共库 */
        new CommonsChunkPlugin({
            name: 'commons',
            minChunks: Infinity
        }),
        new webpack.optimize.CommonsChunkPlugin({name: 'mainifest', chunks: ['commons']}),
        new CleanPlugin(['dist', 'build']),
    ]
};
// 判断开发环境还是生产环境,添加uglify等插件
if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = 'cheap-module-source-map';
    module.exports.plugins = (module.exports.plugins || [])
        .concat([
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: '"production"'
                }
            }),
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false,
                    drop_console: true
                }
            }),
            new webpack.optimize.OccurrenceOrderPlugin(),//排序输出 删除重复数据
        ]);
} else {
    module.exports.devtool = 'source-map';
    module.exports.plugins = (module.exports.plugins || [])
        .concat([
            // 启动热替换
            new webpack.HotModuleReplacementPlugin(),
        ]);
    module.exports.devServer = {
        port: 9084,
        contentBase: './build',
        // hot: true,
        historyApiFallback: true,
        disableHostCheck: true,
        publicPath: "",
        stats: {
            colors: true
        },
        proxy: {
            '/api': {
                target: 'http://localhost:3000/',
                pathRewrite: {'^/api': '/'},
                changeOrigin: true,
                secure: false
            }
        }
    };
}


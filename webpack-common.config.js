const webpack           = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path              = require('path');
const nodeModulesPath   = path.resolve(__dirname, 'node_modules');

const dirSource  = 'source';
const dirPublic  = 'public_html';
const pathStatic = path.resolve(__dirname, dirPublic, 'design');

const proxyLocalHost = 'http://tracker.project';

function webpackConfigure(env) {
    const DEV = (env != 'production');

    const entryDefault = DEV ? {
        devServer    : 'webpack/hot/dev-server',
        onlyDevServer: 'webpack/hot/only-dev-server',
    } : {};

    let config = {
        entry     : Object.assign({}, entryDefault, {
            'js/app': path.join(__dirname, dirSource, '/jsx/entry.jsx'),
            'js/styles': path.join(__dirname, dirSource, '/scss/styles.scss'),
        }),
        output : {
            path: pathStatic,
            filename: '[name].js',
        },
        devtool: DEV ? 'eval' : 'source-map',
        resolve: {
            modulesDirectories: ['node_modules'],
            extensions        : ['', '.js', '.jsx']
        },

        module: {
            loaders: [{
                test   : /\.jsx$/,
                loaders: DEV ? ['react-hot', 'babel-loader'] : ['babel-loader'],
                exclude: [nodeModulesPath],
            }, {
                test   : /\.css$/,
                loader : 'style!css?modules',
                include: /flexboxgrid/,
            }, {
                test  : /\.scss$/,
                loader: ExtractTextPlugin.extract('style', 'css!sass'),
                exclude: [nodeModulesPath],
            }, {
                test  : /\.(png|jpg|gif|svg|ttf|eot|woff|woff2)$/,
                loader: 'file?name=[path][name].[ext]',
            }]
        }
    };

    if (DEV) {
        config.devServer = {
            contentBase: dirPublic,
            devtool    : 'eval',
            hot        : true,
            inline     : true,
            port       : 3000,
            host       : 'localhost', // Change to '0.0.0.0' for external facing server
            proxy      : {
                '*': {
                    target      : proxyLocalHost,
                    secure      : false,
                    changeOrigin: true
                }
            }
        };
        config.plugins   = [
            new webpack.HotModuleReplacementPlugin(),
            new ExtractTextPlugin('css/styles.css'),
            new webpack.NoErrorsPlugin(),
        ];
    } else {
        //noinspection JSUnresolvedFunction
        config.plugins = [
            new webpack.DefinePlugin({
                'process.env': {'NODE_ENV': JSON.stringify('production')}
            }),
            new webpack.optimize.UglifyJsPlugin({
                compress: {warnings: false},
                output  : {comments: false},
            }),
            new ExtractTextPlugin('css/styles.css'),
            new webpack.NoErrorsPlugin(),
        ];
    }

    return config;
}

exports = module.exports = webpackConfigure;

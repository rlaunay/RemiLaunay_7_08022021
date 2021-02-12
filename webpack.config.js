const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { WebpackManifestPlugin } = require('webpack-manifest-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const config = {
    entry: './src/app.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "js/bundle.js",
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
            },
            {
                test: /\.(png|jpg|gif|mp4|svg)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: 'media/[ext]/[name].[hash:7].[ext]',
                    },
                }
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/[name].css',
            chunkFilename: 'css/[id].css'
        }),
        new HtmlWebpackPlugin({
            template: 'public/index.html',
            filename: 'index.html',
            favicon: 'public/logo.ico'
        })
    ],
}

module.exports = (env, argv) => {

    if (argv.mode === "development") {
        config.devtool = "eval-cheap-module-source-map"
        config.devServer = {
            open: true,
            contentBase: path.join(__dirname, 'dist'),
            compress: true,
            port: 9000
        }
    }

    if (argv.mode === "production") {
        config.output.filename = "js/bundle.[chunkhash:8].js"
        config.plugins[0] = new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash].css',
            chunkFilename: 'css/[id].[contenthash].css'
        })
        config.plugins.push(new WebpackManifestPlugin())
        config.plugins.push(new CleanWebpackPlugin())
    }

    return config;
};
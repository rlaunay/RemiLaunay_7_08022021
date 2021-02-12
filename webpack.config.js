const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const config = {
    entry: './src/app.js',
    output: {
        path: path.resolve("./dist"),
        filename: "js/bundle.[hash:7].js",
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
            filename: 'css/[name].[hash:7].css'
        }),
        new HtmlWebpackPlugin({
            template: 'public/index.html',
            filename: 'index.html'
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

    return config;
};
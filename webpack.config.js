const path = require("path");
const srcPath = path.join(__dirname, './src');
const distPath = path.join(__dirname, './dist');
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
    context: srcPath,
    mode: "production",
    entry: {
        main: "./index.tsx",
    },
    output: {
        path: distPath,
        filename: '[name].bundle.js',
        chunkFilename: '[name].bundle.js',
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
            },
            {
                test: /\.tsx?$/,
                enforce: "pre",
                loader: "tslint-loader",
            },
            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                    }, {
                        loader: "less-loader",
                        options: {
                            javascriptEnabled: true,
                        },
                    },
                ],
            },
        ],
    },
    optimization: {
        minimizer: [
            new OptimizeCSSAssetsPlugin({}),
        ],
        splitChunks: {
            cacheGroups: {
                vendors: {
                    test: /node_modules/,
                    name: "vendors",
                    chunks: "all",
                },
            },
        },
    },
    performance: {
        hints: false,
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
            options: {
                debug: true,
                tslint: {
                    emitErrors: true,
                    failOnHint: true,
                },
            },
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
        }),
        new UglifyJsPlugin(),
    ],
}
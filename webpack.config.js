const path = require('path');
const webpack = require('webpack');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    
    entry: {
        game: "./src/js/game.ts"
    },
    
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.scss'],
    },
    
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.scss$/,
                include: path.resolve(__dirname, 'src/scss'),
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader"
                ]
            }
        ]
    },

    plugins: [
        new CleanWebpackPlugin(),
        new webpack.DefinePlugin({
            'typeof CANVAS_RENDERER': JSON.stringify(true),
            'typeof WEBGL_RENDERER': JSON.stringify(true)
        }),
    ],
    
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, './dist'),
    },
    
    devServer: {
        contentBase: path.resolve(__dirname, './'),
        publicPath: './dist',
        writeToDisk: true
    }
    
};

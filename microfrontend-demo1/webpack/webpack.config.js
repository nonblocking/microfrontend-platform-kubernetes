const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, '../dist/frontend'),
        publicPath: '/',
    },

    resolve: {
        extensions: ['.js', '.ts', '.tsx'],
    },

    module: {
        rules: [
            {
                test: /\.tsx?/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                    },
                ],
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                        },
                    },
                    'sass-loader',
                ],
            },
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            inject: 'head',
            template: path.resolve(__dirname, '../src/frontend/index.html'),
        })
    ]
};

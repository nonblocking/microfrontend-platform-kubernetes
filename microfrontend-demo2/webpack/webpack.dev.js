

const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.config');

module.exports = merge(common, {
    entry: {
        bundle: ['webpack-hot-middleware/client?reload=true', 'react-hot-loader/patch', './src/frontend/index.tsx'],
    },
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        inline: true,
        contentBase: 'dist',
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
    ],
    externals: {
        'node-fetch': 'fetch',
    }
});

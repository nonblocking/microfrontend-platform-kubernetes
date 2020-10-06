
const {merge} = require('webpack-merge');
const common = require('./webpack.config');

module.exports = merge(common, {
    entry: {
        bundle: './src/frontend/index.tsx',
    },
    mode: 'production',
    externals: {
        'node-fetch': 'fetch',
    }
});

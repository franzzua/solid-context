const path = require('path');
const webpack = require('webpack');

module.exports = {
    //externals: [/text-encoding/],
    resolve: {
        alias: {
            // "./node_modules/node-fetch/lib/index.js":`${__dirname}/node_modules/solidocity/dist/esm/impl/fetch.js`,
            // '@sinonjs/text-encoding$': `${__dirname}/node_modules/solidocity/polyfills/text-encoder.js`,
            // 'text-encoding$': `${__dirname}/node_modules/solidocity/polyfills/text-encoder.js`,
            // 'whatwg-url$': `${__dirname}/node_modules/solidocity/polyfills/whatwg-url.js`,
            '@trust/webcrypto$':`${__dirname}/node_modules/solidocity/polyfills/crypto.js`,
            // 'solidocity': path.resolve(__dirname, '../solidocity/dist/index.js'),
            // 'stream': `${__dirname}/node_modules/solidocity/dist/esm/impl/fetch.js`,
            'node-fetch$': `${__dirname}/node_modules/solidocity/dist/esm/impl/fetch.js`,
            'solid-auth-client$': `${__dirname}/node_modules/solid-auth-client/browser/index.js`,
            '@app$': `${__dirname}/dist/esm/app/index.js`,
            '@domain$': `${__dirname}/dist/esm/domain/index.js`,
            '@infr$': `${__dirname}/dist/esm/infr/index.js`,
        }
    },
    node: false,

    plugins: [
        new webpack.DefinePlugin({
            global: 'self'
        })
    ]
}
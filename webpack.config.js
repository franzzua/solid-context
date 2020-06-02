const path = require('path');

module.exports = {
    //externals: [/text-encoding/],
    resolve: {
        alias: {
            '@sinonjs/text-encoding$': `${__dirname}/node_modules/solidocity/polyfills/text-encoder.js`,
            'text-encoding$': `${__dirname}/node_modules/solidocity/polyfills/text-encoder.js`,
            'whatwg-url$': `${__dirname}/node_modules/solidocity/polyfills/whatwg-url.js`,
            'node-fetch': `${__dirname}/node_modules/solidocity/dist/esm/impl/fetch.js`,
            'stream': `${__dirname}/node_modules/solidocity/dist/esm/impl/fetch.js`,
            'solid-auth-client$': `${__dirname}/node_modules/solid-auth-client/browser/index.js`,
            '@app$': `${__dirname}/dist/esm/app/index.js`,
            '@domain$': `${__dirname}/dist/esm/domain/index.js`,
            '@infr$': `${__dirname}/dist/esm/infr/index.js`,
            'solidocity': path.resolve(__dirname, '../solidocity/dist/esm/index.js')
        }
    },
    node: false
}
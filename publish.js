const auth = require('solid-auth-cli')
const FC   = require('solid-file-client')
const fc   = new FC( auth );

const username = process.env['SOLID_USERNAME'] || 'context';
const password = process.env['SOLID_PASSWORD'] || 'lkhgmk=-98p-';
const idp = process.env['SOLID_IDP'] || 'https://inrupt.net';
const target = process.env['SOLID_TARGET'] || 'https://context.inrupt.net';

console.log('deploy', username, '*'.repeat(password.length), idp, target);

async function publish() {
    await auth.login({
        idp: idp,
        username: username,
        password: password
    })

    await fc.copyFile(`file://${__dirname}/dist/index.html`, `${target}/context/index.html`);
    await fc.copyFile(`file://${__dirname}/dist/index.html`, `${target}/context/tree/index.html`);
    await fc.copyFile(`file://${__dirname}/dist/index.js`, `${target}/context/index.js`);
    // await fc.copyAclFileForItem(`${target}/profile/card`, `${target}/app/`);
}

publish().catch(console.error);
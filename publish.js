const auth = require('solid-auth-cli')
const FC   = require('solid-file-client')
const fc   = new FC( auth );

const username = process.env['SOLID_USERNAME'] || '';
const password = process.env['SOLID_PASSWORD'] || '';
const idp = process.env['SOLID_IDP'] || 'https://inrupt.net';
const target = process.env['SOLID_TARGET'] || 'https://context.inrupt.net';

console.log('deploy', username, '*'.repeat(password.length), idp, target);

async function publish() {
    await auth.login({
        idp: idp,
        username: username,
        password: password
    })

    await fc.copyFile(`file://${__dirname}/dist/index.html`, `${target}/app/index.html`);
    await fc.copyFile(`file://${__dirname}/dist/tree/index.html`, `${target}/app/index.html`);
    await fc.copyFile(`file://${__dirname}/dist/index.js`, `${target}/app/index.js`);
    await fc.copyAclFileForItem(`${target}/profile/card.acl`, `${target}/app/.acl`);
}

publish().catch(console.error);
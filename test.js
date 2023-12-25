// const dns = require('dns');

// dns.lookup('github.com', (err, address, family) => {
//     console.log('address: %j family: IPv%s', address, family);
// });

const { Resolver } = require('dns');
const resolver = new Resolver();
// resolver.setServers(['8.8.8.8']);
// resolver.setServers(['114.114.114.114']);
resolver.setServers(['202.106.0.20']);

// This request will use the server at 4.4.4.4, independent of global settings.
resolver.resolve4('github.global.ssl.fastly.net', (err, addresses) => {
    console.log(err, addresses);
});
resolver.resolve4('assets-cdn.github.com', (err, addresses) => {
    console.log(err, addresses);
});
resolver.resolve4('github.com', (err, addresses) => {
    console.log(err, addresses);
});

// Mac用户
// sudo killall -HUP mDNSResponder

// Win
// ipconfig /flushdns
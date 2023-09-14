import log4js from 'log4js';

log4js.configure({
    appenders: {
        everything: { type: 'file', filename: 'logs/server.log', maxLogSize: 10485760, backups: 3, compress: true },
        console: { type: 'console' },
    },
    categories: {
        default: { appenders: ['everything', 'console'], level: 'debug' },
        out: { appenders: ['console'], level: 'info' },
    },
});

export default {
    debug(msg, ...args) {
        log4js.getLogger().debug(msg, ...args);
    },
    info(msg, ...args) {
        log4js.getLogger().info(msg, ...args);
    },
};

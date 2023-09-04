import express from 'express';

import test from './api/index';

const app = express();

app.use('/api_test', test);

const port = process.env.PORT || '8082';
app.listen(port, function () {
    console.log(`服务器运行在http://127.0.0.1:${port}`);
});

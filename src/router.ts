import Router from '@koa/router';

import test from './api/index';
import task from './api/task';

const router = new Router();

//对外提供的接口
router.use('/api/api_test', test);
router.use('/api/api_task', task);


export default router;

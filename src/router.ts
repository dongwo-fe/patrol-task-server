import Router from '@koa/router';

import test from './api/index';
import task from './api/task';
import variable from './api/variable';
import notice from './api/notice';
import code from './api/code';

const router = new Router();

//对外提供的接口
router.use('/api/api_test', test);
router.use('/api/api_task', task);
router.use('/api/api_variable', variable);
router.use('/api/notice', notice);
router.use('/api/code', code);

export default router;

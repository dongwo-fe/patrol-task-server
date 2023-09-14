import Router from '@koa/router';
import { runNodejs } from '../service/test';
import { BeError, BeSuccess } from '../util/response';
import { GetTaskList, ModifyTask, DelTask, ControlTask, RunTask, GetTaskDetailsList } from '../service/task';
import Log from '../util/log';

const router = new Router();

//任务列表
router.get('/', async function (ctx) {
    const { pageindex, title, state } = ctx.query;
    try {
        const data = await GetTaskList(pageindex, title as string, state);
        ctx.body = BeSuccess(data);
    } catch (error) {
        Log.debug(error.message);
        ctx.body = BeError(error.message);
    }
});

//创建任务
router.post('/modifyTask', async function (ctx) {
  const { name, url, time, isCookie, isToken, tokenName, token, cookieName, cookie, cookieDomain} = ctx.request.body;
  try {
      // const data = await ModifyTask(ctx.user.userName, name, url, time, token);
      const data = await ModifyTask('admin', name, url, time, isCookie, isToken, tokenName, token, cookieName, cookie, cookieDomain);
      ctx.body = BeSuccess(data);
  } catch (error) {
      Log.debug(error.message);
      ctx.body = BeError(error.message);
  }
});

//删除任务
router.post('/delateTask', async function (ctx) {
  const { id } = ctx.request.body;
  console.log('ctx',ctx)
  try {
      if (!id) throw new Error('不存在的任务');
      // const data = await ModifyTask(ctx.user.userName, name, url, time, token);
      const data = await DelTask(id);
      ctx.body = BeSuccess(data);
  } catch (error) {
      Log.debug(error.message);
      ctx.body = BeError(error.message);
  }
});

//起停用任务
router.post('/updateTaskState', async function (ctx) {
  const { id, state } = ctx.request.body;
  console.log('ctx',ctx)
  try {
      if (!id) throw new Error('不存在的任务');
      if (isNaN(state)) throw new Error('不存在的状态');
      await ControlTask(id, state);
      ctx.body = BeSuccess();
  } catch (error) {
      Log.debug(error.message);
      ctx.body = BeError(error.message);
  }
});

// 执行任务
router.post('/runTask', async function (ctx) {
  const { id } = ctx.request.body; //任务id
  try {
    if (!id) throw new Error('不存在的任务');
    const data = await RunTask(id);
    ctx.body = BeSuccess(data);
  } catch (error) {
      Log.debug(error.message);
      ctx.body = BeError(error.message);
  }
  // runNodejs();
  // res.send('test');
});
// 任务详情
router.get('/getTackDetails', async function (ctx) {
  const { pageindex, taskId } = ctx.query;; //任务id
  try {
    if (!taskId) throw new Error('不存在的任务');
    const data = await GetTaskDetailsList(pageindex, taskId);
    ctx.body = BeSuccess(data);
} catch (error) {
    Log.debug(error.message);
    ctx.body = BeError(error.message);
}
  // runNodejs();
  // res.send('test');
});

export default router.routes();

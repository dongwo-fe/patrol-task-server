import Router from '@koa/router';
import { BeError, BeSuccess } from '../util/response';
import { GetTaskList, ModifyTask, DelTask, ControlTask, RunTask, GetTaskDetailsList, GetTaskDetails, GetTaskRecordList } from '../service/task';
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
  const { name, url, time, browser, variable, id } = ctx.request.body;
  try {
      // const data = await ModifyTask(ctx.user.userName, name, url, time, token);
      const data = await ModifyTask('admin', name, url, time, browser, variable, id);
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
// 巡检详情列表
router.get('/getTackDetails', async function (ctx) {
  const { pageindex, taskId, browser } = ctx.query; //任务id
    try {
      if (!taskId) throw new Error('不存在的任务');
      const data = await GetTaskDetailsList(pageindex, taskId, browser);
      ctx.body = BeSuccess(data);
  } catch (error) {
      Log.debug(error.message);
      ctx.body = BeError(error.message);
  }
  // runNodejs();
  // res.send('test');
});

// 根据taskId获取任务信息
router.get('/getDetails', async function (ctx) {
  const {taskId } = ctx.query; //任务id
    try {
      if (!taskId) throw new Error('不存在的任务');
      const data = await GetTaskDetails(taskId);
      ctx.body = BeSuccess(data);
  } catch (error) {
      Log.debug(error.message);
      ctx.body = BeError(error.message);
  }
});
// 巡检记录列表
router.post('/getTackRecord', async function (ctx) {
  const { pageindex, name, checkTime, browser=1 } = ctx.request.body;
  try {
      const data = await GetTaskRecordList(pageindex, name, checkTime, browser );
      ctx.body = BeSuccess(data);
  } catch (error) {
      Log.debug(error.message);
      ctx.body = BeError(error.message);
  }
});


export default router.routes();

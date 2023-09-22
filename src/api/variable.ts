import Router from '@koa/router';
import { BeError, BeSuccess } from '../util/response';
import { GetVariableList, ModifyVariable, DelVariable, GetAll, GetListById } from '../service/variable';
import Log from '../util/log';

const router = new Router();

//变量列表
router.get('/', async function (ctx) {
    const { pageindex, cname, type } = ctx.query;
    try {
        const data = await GetVariableList(pageindex, cname as string, type);
        ctx.body = BeSuccess(data);
    } catch (error) {
        Log.debug(error.message);
        ctx.body = BeError(error.message);
    }
});

//新增和编辑变量
router.post('/modifyVariable', async function (ctx) {
  const { name, type, key, value, cookieDomain, id} = ctx.request.body;
  try {
      const data = await ModifyVariable('admin', name, type, key, value, cookieDomain, id);
      ctx.body = BeSuccess(data);
  } catch (error) {
      Log.debug(error.message);
      ctx.body = BeError(error.message);
  }
});

//删除变量
router.post('/delateVariable', async function (ctx) {
  const { id } = ctx.request.body;
  console.log('ctx',ctx)
  try {
      if (!id) throw new Error('不存在的变量');
      // const data = await ModifyTask(ctx.user.userName, name, url, time, token);
      const data = await DelVariable(id);
      ctx.body = BeSuccess(data);
  } catch (error) {
      Log.debug(error.message);
      ctx.body = BeError(error.message);
  }
});
// 获取全部变量
router.get('/allVar', async function (ctx) {
  try {
      const data = await GetAll();
      ctx.body = BeSuccess(data);
  } catch (error) {
      Log.debug(error.message);
      ctx.body = BeError(error.message);
  }
});
// 根据id获取变量信息
router.post('/getListById', async function (ctx) {
  const { ids } = ctx.request.body;
  try {
      const data = await GetListById(ids);
      ctx.body = BeSuccess(data);
  } catch (error) {
      Log.debug(error.message);
      ctx.body = BeError(error.message);
  }
});

export default router.routes();

import Router from '@koa/router';
import { runNodejs } from '../service/test';
import { BeError, BeSuccess } from '../util/response';
import { Create } from '../service/task';

const router = new Router();

router.get('/', function (ctx) {
    runNodejs();
    // res.send('test');
    const { pageindex, title, state } = ctx.query;
    ctx.body = BeSuccess("成功");
    /* try {
        const data = await GetChannelList(pageindex, title as string, state);
        ctx.body = BeSuccess(data);
    } catch (error) {
        Log.debug(error.message);
        ctx.body = BeError(error.message);
    } */
});


router.all('/test', async function (ctx, next) {
    const data = await Create();
    ctx.body = '测试接口' + process.env.NODE_ENV;
});
export default router.routes();

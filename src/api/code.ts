import Router from '@koa/router';
import { BeError, BeSuccess } from '../util/response';
import { getCodeAll } from 'src/service/code';

const router = new Router();

router.get('/all', async function (ctx) {
    try {
        const data = await getCodeAll();
        ctx.body = BeSuccess(data);
    } catch (error) {
        ctx.body = BeError(error);
    }
});

export default router.routes();

import Router from '@koa/router';
import { BeError, BeSuccess } from '../util/response';
import { getCodeAll, getCodeList, editCode } from '../service/code';

const router = new Router();

router.get('/', async function (ctx) {
    const { pageindex, code, status } = ctx.query;
    try {
        const data = await getCodeList(pageindex, code, status);
        ctx.body = BeSuccess(data);
    } catch (error) {
        ctx.body = BeError(error.message);
    }
});

router.post('/edit', async function (ctx) {
    const { id, code, name, remark, status, state } = ctx.request.body;
    try {
        let opts: any = {};
        if (code) opts.code = code;
        if (name) opts.name = name;
        if (remark) opts.remark = remark;
        if (status !== undefined) opts.status = status;
        if (state !== undefined) opts.state = state;
        const data = await editCode(opts, id);
        ctx.body = BeSuccess(data);
    } catch (error) {
        ctx.body = BeError(error.message);
    }
});

router.get('/all', async function (ctx) {
    try {
        const data = await getCodeAll();
        ctx.body = BeSuccess(data);
    } catch (error) {
        ctx.body = BeError(error.message);
    }
});

export default router.routes();

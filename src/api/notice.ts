import Router from '@koa/router';
import { NoticeApiError } from '../service/notice';

const router = new Router();

const dataBuffer = Buffer.from('R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=', 'base64');

// 接口api错误，e错误内容：0=http错误、1=接口空内容，k来源接口，f默认head来源页面，可以手动接受其他参数,env环境
router.get('/api_error', async function (ctx) {
    const { k, e, f, r, env } = ctx.query;
    const from = f || ctx.headers['referer'];
    ctx.set('content-type', 'image/gif');
    ctx.body = dataBuffer;
    if (!k || !from) {
        return;
    }
    // console.log('接受错误，来源页面', from, '来源接口', k, '错误内容', e);
    NoticeApiError(from, k, e, r, env);
});

export default router.routes();

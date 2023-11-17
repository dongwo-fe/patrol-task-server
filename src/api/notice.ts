import Router from '@koa/router';

const router = new Router();

const dataBuffer = Buffer.from('R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=', 'base64');

router.get('/api_error', async function (ctx) {
    const {} = ctx.query;
    console.log(ctx.query);
    ctx.set('content-type', 'image/gif');
    ctx.body = dataBuffer;
});

export default router.routes();

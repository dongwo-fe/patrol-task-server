import Router from '@koa/router';
import Koa from 'koa';
import { CheckUserToken } from '../service/user';
import { BeError } from '../util/response';
import Log from '../util/log';

/**
 * 检查用户权限，平台运营、运营、个人
 * @param ctx ctx
 * @param next next
 */
export async function Auth(ctx: Router.RouterContext, next: Koa.Next) {
    //查询是否有权限参数
    const jwt: string = ctx.headers.authorization as string;
    if (!jwt) {
        ctx.body = BeError('登录失效', -1);
        return;
    }
    try {
        await CheckUserToken(jwt);
        const nickname = ctx.headers['nickname'] || '';
        ctx.user = {
            userName: decodeURIComponent(nickname),
        };
        await next();
    } catch (error) {
        Log.debug(error.message);
        ctx.body = BeError('登录失效', -1);
        return;
    }
}

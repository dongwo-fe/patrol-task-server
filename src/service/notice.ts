/**
 * 接收api接口错误信息
 * @param from 来源地址
 * @param api api接口地址
 * @param err_msg 错误信息
 * @param env 环境
 */
export async function NoticeApiError(from: string, api: string, err_msg: string, env?: string) {
    console.log(from, api, err_msg, env);
}

import { APINoticeOnce, TZNoticeGroup } from './dingding';

const API_ERROR_List = new Map<string, APIERRITEM[]>();

interface APIERRITEM {
    from: string;
    api: string;
    /**
     * 错误类型，0http，1api
     */
    err_msg: string;
    env?: string;
}

/**
 * 接收api接口错误信息
 * @param from 来源地址
 * @param api api接口地址
 * @param err_msg 错误信息
 * @param env 环境
 */
export async function NoticeApiError(from: string, api: string, err_msg: string, env = '') {
    console.log(from, api, err_msg, env);
    from = from.split('?')[0];

    let list: APIERRITEM[] = [];
    //合并同接口错误
    if (API_ERROR_List.has(api)) {
        list = API_ERROR_List.get(api) || [];
    }
    list.push({ from, api, err_msg, env });
    API_ERROR_List.set(api, list);
}

// 定时通知钉钉,通知规则，按照错误数量从高到底排序
export async function NoticeDDTalk() {
    if (API_ERROR_List.size === 0) return;
    const APILIST = Array.from(API_ERROR_List.values());

    API_ERROR_List.clear();

    APILIST.sort((a, b) => b.length - a.length);
    //取前10个
    if (APILIST.length > 5) APILIST.length = 5;
    const list: string[] = ['![](https://ossprod.jrdaimao.com/ac/1700477625993_1088x219.png)'];
    // 查询每条错误
    APILIST.forEach((value) => {
        list.push(getAPIListMsg(value));
    });
    TZNoticeGroup(list.join('\n\n'));
}
// 组装接口通知内容
function getAPIListMsg(list: APIERRITEM[]) {
    const objs = new Map<string, APIERRITEM[]>();
    if (list.length === 0) return '';
    let api = '';
    list.forEach((item) => {
        api = item.api;
        const temp = objs.get(item.from) || [];
        temp.push(item);
        objs.set(item.from, temp);
    });

    const result = Array.from(objs.values());
    const msgs: string[] = [`- 【${api}】,${list.length}次/${APINoticeOnce}分钟`];

    result.sort((a, b) => b.length - a.length);

    for (let index = 0; index < result.length; index++) {
        const item = result[index];
        let count = 0;
        let https = 0;
        let apis = 0;
        item.forEach((obj) => {
            count++;
            if (obj.err_msg == '0') https++;
            if (obj.err_msg == '1') apis++;
        });
        msgs.push(`> ${index + 1}. [${item[0].from}]，数据(${count}/${https}/${apis})`);
    }

    return msgs.join('\n\n');
}

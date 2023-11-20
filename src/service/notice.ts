const API_ERROR_List = new Map();

/**
 * 接收api接口错误信息
 * @param from 来源地址
 * @param api api接口地址
 * @param err_msg 错误信息
 * @param env 环境
 */
export async function NoticeApiError(from: string, api: string, err_msg: string, env = '') {
    console.log(from, api, err_msg, env);
    let list: any[] = [];
    //合并同接口错误
    if (API_ERROR_List.has(api)) {
        list = API_ERROR_List.get(api);
    }
    list.push({ from, api, err_msg, env });
    API_ERROR_List.set(api, list);
}

// 定时通知钉钉
export async function NoticeDDTalk() {
    console.log('触发任务', API_ERROR_List.size);
    // 查询每条错误
    API_ERROR_List.forEach((value: any[], key: string) => {
        console.log(key, value.length);
    });
}

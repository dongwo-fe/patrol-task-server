import dayjs from 'dayjs';
import { APINoticeOnce, TZNoticeGroup } from './dingding';
import fs from 'fs';
import path from 'path';
import artTemplate from 'art-template';

// 错误信息缓存
const API_ERROR_List = new Map<string, APIERRITEM[]>();
// 错误信息长列表缓存
const API_ERROR_Cache: APIERRITEM[] = [];
const RootPath = process.cwd();
const TempNginxPath = path.join(RootPath, `./template/api_error.html`);
const TempStr = fs.readFileSync(TempNginxPath, { encoding: 'utf-8' });

interface APIERRITEM {
    from: string;
    api: string;
    url: string;
    /**
     * 错误类型，0http，1api
     */
    err_type: string;
    r?: string;
    env?: string;
    t: string;
}

// 组合错误信息变成一个列表
export function getAPIErrorListMsg() {
    if (API_ERROR_Cache.length === 0) return '';
    return artTemplate.render(TempStr, { texts: API_ERROR_Cache });
}

// 定向排除部分错误
function isFilterAPIError(api: string, r: string) {
    if (r.length > 10 && r.includes(`"data":null,`)) return true;
    // 公告栏
    if (api.includes('/member/bulletinBoard') && r.includes(`data":[],`)) return true;
    // 增量协议列表
    if (api.includes('/saas/incrCompact/list')) return true;
    // 查询消息数量
    if (api.includes('/bMessageCenter/queryCopyGoodsNotice')) return true;
    // 查询用户卖场列表
    if (api.includes('/saas/index/queryUserMarketScope')) return true;
    // 无用的config
    if (api.includes('/api_config/vacation')) return true;
    // 鉴权使用，排除
    if (api.includes('/easyhome-b-web-application/merchant/account')) return true;
    // 所有可抄送人
    if (api.includes('/saasUser/querySysUserHasMarketManager')) return true;
    // 商户管理--- 经营类目下拉框【一个接口写了2次】
    if (api.includes('/goods/category/listCategoryTreeByBrandId')) return true;
    // 商户下拉【一个接口写了很多次】
    if (api.includes('/merchant/queryMerchantSelectedOptimize')) return true;
    // 获取联单明细
    if (api.includes('/operation/order/getOrderLinkedMarketingDetails')) return true;
    // 小b端导购工作台运营位查询 app版本：0国内版，1国际版
    if (api.includes('/operation/smallBShoppingGuideOperationalList')) return true;
    return false;
}

/**
 * 接收api接口错误信息
 * @param from 来源地址
 * @param api api接口地址
 * @param err_type 错误信息
 * @param r 自定义错误内容
 * @param env 环境
 */
export async function NoticeApiError(from: string, api: string, err_type: string, r = '', env = '--') {
    if (isFilterAPIError(api, r)) return;
    // console.log(from, api, err_type, env);
    const url = from.split('?')[0];

    let list: APIERRITEM[] = [];
    //合并同接口错误
    if (API_ERROR_List.has(api)) {
        list = API_ERROR_List.get(api) || [];
    }
    const t = dayjs().format('YYYY-MM-DD HH:mm:ss');
    list.push({ url, from, api, err_type, env, r, t });
    API_ERROR_List.set(api, list);
    API_ERROR_Cache.unshift({ url, from, api, err_type, env, r, t });
    if (API_ERROR_Cache.length > 10000) API_ERROR_Cache.length = 10000;
}

// 定时通知钉钉,通知规则，按照错误数量从高到底排序
export async function NoticeDDTalk() {
    if (API_ERROR_List.size === 0) return;
    const APILIST = Array.from(API_ERROR_List.values());

    API_ERROR_List.clear();

    APILIST.sort((a, b) => b.length - a.length);
    //取前10个
    if (APILIST.length > 4) APILIST.length = 4;
    const list: string[] = ['![](https://ossprod.jrdaimao.com/ac/1700478580078_1088x137.jpg)'];
    // 查询每条错误
    APILIST.forEach((value) => {
        // 如果是1条，不提示
        // if (value.length == 1) return;
        list.push(getAPIListMsg(value));
    });
    list.push('[查看最近的错误信息](https://femonitor.jrdaimao.com/api/notice/api_error_list)');
    TZNoticeGroup(list.join('\n\n'));
}
// 组装接口通知内容
function getAPIListMsg(list: APIERRITEM[]) {
    const objs = new Map<string, APIERRITEM[]>();
    if (list.length === 0) return '';
    let api = '';
    list.forEach((item) => {
        api = item.api;
        const temp = objs.get(item.url) || [];
        temp.push(item);
        objs.set(item.url, temp);
    });

    const result = Array.from(objs.values());
    const msgs: string[] = [`- 【${api}】,\`${list.length}次/${APINoticeOnce}分钟\``];

    result.sort((a, b) => b.length - a.length);

    for (let index = 0; index < result.length; index++) {
        const item = result[index];
        let count = 0;
        let https = 0;
        let apis = 0;
        item.forEach((obj) => {
            count++;
            if (obj.err_type == '0') https++;
            if (obj.err_type == '1') apis++;
        });
        msgs.push(`> ${index + 1}. [${item[0].url}]，\`数据(${count}/${https}/${apis})\``);
    }

    return msgs.join('\n\n');
}

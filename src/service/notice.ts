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
    ip: string;
}

// 组合错误信息变成一个列表
export function getAPIErrorListMsg() {
    if (API_ERROR_Cache.length === 0) return '';
    return artTemplate.render(TempStr, { texts: API_ERROR_Cache });
}

// 定向排除部分错误
function isFilterAPIError(api: string, r = '', ip = '') {
    // 小程序的安全检查
    if (['106.55.202.118', '113.96.223.69', '125.39.132.125'].includes(ip)) return true;
    if (r.includes(`"message":"没有推荐商品"`)) return true;
    if (r.includes(`"message":"订单已全部支付完成"`)) return true;
    if (r.includes(`"message":"该手机号尚未注册"`)) return true;
    if (r.includes(`"message":"请输入验证码"`)) return true;
    if (r.includes(`"message":"无法获取当前导购信息"`)) return true;
    if (r.includes(`"message":"未找到商户信息"`)) return true;
    if (r.includes(`"message":"该品牌、类目、型号的商品已存在"`)) return true;
    if (r.includes(`"message":"您还有订单未支付，请下拉刷新查看"`)) return true;
    if (r.includes(`"message":"您今日已达助力上限啦~"`)) return true;
    if (r.includes(`"message":"您的账号已被停用，请联系运营处理"`)) return true;
    if (r.includes(`"message":"您的账号不存在，请联系运营处理"`)) return true;
    if (r.includes(`"errno":`)) return true;
    if (r.includes(`"message":"保存成功"`)) return true;
    if (r.includes(`"message":"请求成功"`)) return true;
    if (r.includes(`"message":"结算总则中单价不能为空"`)) return true;
    if (r.includes(`"message":"手机号已存在"`)) return true;
    if (r.includes(`"message":"验证码错误，请重新输入"`)) return true;
    if (r.includes(`"message":"请填写合同首期出单日期"`)) return true;
    if (r.includes(`"message":"临近预约时间，不可取消预约"`)) return true;
    if (r.includes(`"message":"可兑换积分不足!"`)) return true;
    if (r.includes(`"message":"该商品已达助力上限！"`)) return true;
    if (r.includes(`"message":"商品请完善必填信息后再上架"`)) return true;
    if (r.includes(`"message":"不满足入会条件"`)) return true;
    if (r.includes(`"message":"请联系管理员绑定天猫店铺或者卖场"`)) return true;
    if (r.includes(`"message":"商品已上架，不能删除"`)) return true;
    if (r.includes(`"message":"物流单号不能为空"`)) return true;
    if (r.includes(`"message":"您已经达到该活动的最大发起数！"`)) return true;
    if (r.includes(`"message":"修改地址成功"`)) return true;
    if (r.includes(`"message":"导购不可以参与该活动"`)) return true;
    if (r.includes(`"message":"输入格式不正确"`)) return true;
    if (r.includes(`"message":"暂不支持退款，部分优惠券已经被核销使用"`)) return true;
    if (r.includes(`"message":"不可为自己助力哦~"`)) return true;
    if (r.includes(`"message":"您的密码有误，请检查后重新输入"`)) return true;
    if (r.includes(`"message":"当前用户是居然员工"`)) return true;
    if (r.includes(`"message":"主营品牌、主营品类为必填项"`)) return true;
    if (r.includes(`"message":"退款金额超出可退金额"`)) return true;
    if (r.includes(`"message":"对接人信息为必填项"`)) return true;
    if (r.includes(`"message":"提现失败，请稍后再试"`)) return true;
    if (r.includes(`"message":"该店铺为已撤店状态，若需`)) return true;
    if (r.includes(`"message":"您的密码有误，再输入错误`)) return true;
    if (r.includes(`"message":"SKU编号不能为空`)) return true;
    if (r.includes(`"message":"商品售价需输入正数`)) return true;
    if (r.includes(`"message":"活动期间每位用户仅可参活1次`)) return true;
    if (r.includes(`"message":"感谢您对低碳环保做出的贡献！`)) return true;
    if (r.includes(`"message":"您的权限不足，请联系管理员`)) return true;
    if (r.includes(`"message":"未查询到发起砍价的信息！`)) return true;
    if (r.includes(`"message":"商品定价没有被确认，不能购买`)) return true;
    if (r.includes(`"message":"验证不一致,手机号已实名`)) return true;
    if (r.includes(`"message":"该优惠券组合不能同时使用！"`)) return true;
    if (r.includes(`"message":"未查询到订单包信息"`)) return true;
    if (r.includes(`"message":"免费配送范围300字以内，不支持表情"`)) return true;
    if (r.includes(`库存数量不足，无法出库`)) return true;
    // if (r.includes(`"data":null,`)) return true;
    if (r.includes(`"code":"200"`) && r.includes(`message":"操作成功"`)) return true;
    if (r.includes(`message":"用户认证失败，请重新登录"`)) return true;
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
export async function NoticeApiError(from: string, api: string, err_type: string, r = '', ip = '', env = '--') {
    if (isFilterAPIError(api, r, ip)) return;
    // console.log(from, api, err_type, env);
    const url = from.split('?')[0];

    let list: APIERRITEM[] = [];
    //合并同接口错误
    if (API_ERROR_List.has(api)) {
        list = API_ERROR_List.get(api) || [];
    }
    const t = dayjs().format('YYYY-MM-DD HH:mm:ss');
    list.push({ url, from, api, err_type, env, r, t, ip });
    API_ERROR_List.set(api, list);
    API_ERROR_Cache.unshift({ url, from, api, err_type, env, r, t, ip });
    if (API_ERROR_Cache.length > 8000) API_ERROR_Cache.length = 8000;
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
        if (value.length == 1) return;
        list.push(getAPIListMsg(value));
    });
    list.push('[查看最近的错误信息](https://femonitor.jrdaimao.com/api/notice/api_error_list)');
    if (list.length === 2) return;
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

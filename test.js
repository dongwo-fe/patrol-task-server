const Koa = require('koa');
const fs = require('fs');
const path = require('path');
const artTemplate = require('art-template');

const RootPath = process.cwd();
const TempNginxPath = path.join(RootPath, `./template/api_error.html`);

const app = new Koa();
const API_ERROR_Cache = [
    {
        from: 'https://servicewechat.com/wx7406f385730d3789/0/page-frame.html',
        api: 'https://gatewaydev4***/easyhome-app-application/mini/order/addOrderByBuyer?requestTime=1700555149633&dwSign=34D527E41619D59098CBF241314DE72C',
        err_type: '0',
        r: '{"code":"500","message":"服务开小差了，请稍候重试！","data":null,"success":false}',
        t: '2023-11-21 16:25:50',
        env: '--',
    },
    {
        from: 'https://servicewechat.com/wx7406f385730d3789/0/page-frame.html',
        api: 'https://gatewaydev4***/easyhome-app-application/mini/order/addOrderByBuyer?requestTime=1700555149633&dwSign=34D527E41619D59098CBF241314DE72C',
        err_type: '0',
        r: '{"code":"500","message":"服务开小差了，请稍候重试！","data":null,"success":false}',
        t: '2023-11-21 16:25:50',
        env: '--',
    },
    {
        from: 'https://servicewechat.com/wx7406f385730d3789/0/page-frame.html',
        api: 'https://gatewaydev4***/easyhome-app-application/mini/order/addOrderByBuyer?requestTime=1700555149633&dwSign=34D527E41619D59098CBF241314DE72C',
        err_type: '0',
        r: '{"code":"500","message":"服务开小差了，请稍候重试！","data":null,"success":false}',
        t: '2023-11-21 16:25:50',
        env: '--',
    },
    {
        from: 'https://servicewechat.com/wx7406f385730d3789/0/page-frame.html',
        api: 'https://gatewaydev4***/easyhome-app-application/mini/order/addOrderByBuyer?requestTime=1700555149633&dwSign=34D527E41619D59098CBF241314DE72C',
        err_type: '0',
        r: '{"code":"500","message":"服务开小差了，请稍候重试！","data":null,"success":false}',
        t: '2023-11-21 16:25:50',
        env: '--',
    },
    {
        from: 'https://servicewechat.com/wx7406f385730d3789/0/page-frame.html',
        api: 'https://gatewaydev4***/easyhome-app-application/mini/order/addOrderByBuyer?requestTime=1700555149633&dwSign=34D527E41619D59098CBF241314DE72C',
        err_type: '0',
        r: '{"code":"500","message":"服务开小差了，请稍候重试！","data":null,"success":false}',
        t: '2023-11-21 16:25:50',
        env: '--',
    },
    {
        from: 'https://servicewechat.com/wx7406f385730d3789/0/page-frame.html',
        api: 'https://gatewaydev4***/easyhome-app-application/mini/order/addOrderByBuyer?requestTime=1700555149633&dwSign=34D527E41619D59098CBF241314DE72C',
        err_type: '0',
        r: '{"code":"500","message":"服务开小差了，请稍候重试！","data":null,"success":false}',
        t: '2023-11-21 16:25:50',
        env: '--',
    },
    {
        from: 'https://servicewechat.com/wx7406f385730d3789/0/page-frame.html',
        api: 'https://gatewaydev4***/easyhome-app-application/mini/order/addOrderByBuyer?requestTime=1700555149633&dwSign=34D527E41619D59098CBF241314DE72C',
        err_type: '0',
        r: '{"code":"500","message":"服务开小差了，请稍候重试！","data":null,"success":false}',
        t: '2023-11-21 16:25:50',
        env: '--',
    },
    {
        from: 'https://servicewechat.com/wx7406f385730d3789/0/page-frame.html',
        api: 'https://gatewaydev4***/easyhome-app-application/mini/order/addOrderByBuyer?requestTime=1700555149633&dwSign=34D527E41619D59098CBF241314DE72C',
        err_type: '0',
        r: '{"code":"500","message":"服务开小差了，请稍候重试！","data":null,"success":false}',
        t: '2023-11-21 16:25:50',
        env: '--',
    },
    {
        from: 'https://servicewechat.com/wx7406f385730d3789/0/page-frame.html',
        api: 'https://gatewaydev4***/easyhome-app-application/mini/order/addOrderByBuyer?requestTime=1700555149633&dwSign=34D527E41619D59098CBF241314DE72C',
        err_type: '0',
        r: '{"code":"500","message":"服务开小差了，请稍候重试！","data":null,"success":false}',
        t: '2023-11-21 16:25:50',
        env: '--',
    },
    {
        from: 'https://servicewechat.com/wx7406f385730d3789/0/page-frame.html',
        api: 'https://gatewaydev4***/easyhome-app-application/mini/order/addOrderByBuyer?requestTime=1700555149633&dwSign=34D527E41619D59098CBF241314DE72C',
        err_type: '0',
        r: '{"code":"500","message":"服务开小差了，请稍候重试！","data":null,"success":false}',
        t: '2023-11-21 16:25:50',
        env: '--',
    },
    {
        from: 'https://servicewechat.com/wx7406f385730d3789/0/page-frame.html',
        api: 'https://gatewaydev4***/easyhome-app-application/mini/order/addOrderByBuyer?requestTime=1700555149633&dwSign=34D527E41619D59098CBF241314DE72C',
        err_type: '0',
        r: '{"code":"500","message":"服务开小差了，请稍候重试！","data":null,"success":false}',
        t: '2023-11-21 16:25:50',
        env: '--',
    },
    {
        from: 'https://servicewechat.com/wx7406f385730d3789/0/page-frame.html',
        api: 'https://gatewaydev4***/easyhome-app-application/mini/order/addOrderByBuyer?requestTime=1700555149633&dwSign=34D527E41619D59098CBF241314DE72C',
        err_type: '0',
        r: '{"code":"500","message":"服务开小差了，请稍候重试！","data":null,"success":false}',
        t: '2023-11-21 16:25:50',
        env: '--',
    },
    {
        from: 'https://servicewechat.com/wx7406f385730d3789/0/page-frame.html',
        api: 'https://gatewaydev4***/easyhome-app-application/mini/order/addOrderByBuyer?requestTime=1700555149633&dwSign=34D527E41619D59098CBF241314DE72C',
        err_type: '0',
        r: '{"code":"500","message":"服务开小差了，请稍候重试！","data":null,"success":false}',
        t: '2023-11-21 16:25:50',
        env: '--',
    },
    {
        from: 'https://servicewechat.com/wx7406f385730d3789/0/page-frame.html',
        api: 'https://gatewaydev4***/easyhome-app-application/mini/order/addOrderByBuyer?requestTime=1700555149633&dwSign=34D527E41619D59098CBF241314DE72C',
        err_type: '0',
        r: '{"code":"500","message":"服务开小差了，请稍候重试！","data":null,"success":false}',
        t: '2023-11-21 16:25:50',
        env: '--',
    },
    {
        from: 'https://servicewechat.com/wx7406f385730d3789/0/page-frame.html',
        api: 'https://gatewaydev4***/easyhome-app-application/mini/order/addOrderByBuyer?requestTime=1700555149633&dwSign=34D527E41619D59098CBF241314DE72C',
        err_type: '0',
        r: '{"code":"500","message":"服务开小差了，请稍候重试！","data":null,"success":false}',
        t: '2023-11-21 16:25:50',
        env: '--',
    },
];
app.use(function (ctx) {
    const TempStr = fs.readFileSync(TempNginxPath, { encoding: 'utf-8' });
    ctx.body = artTemplate.render(TempStr, { texts: API_ERROR_Cache });
});
const port = process.env.PORT || '8082';

app.listen(port, function () {
    console.log(`服务器运行在http://127.0.0.1:${port}`);
});

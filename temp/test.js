import puppeteer, { KnownDevices } from 'puppeteer-core';
import os from 'os';
import path from 'path';
import minimist from 'minimist';

const { NODE_ENV = '' } = process.env;

// 是否生产环境
const isProduction = NODE_ENV === 'production';

// 当前系统所属平台，主要是兼容本地开发环境
const platform = os.platform();
const sleep = (time) => new Promise((ok) => setTimeout(ok, time));

/**
 * 创建一个浏览器
 * @returns 浏览器对象
 */
async function createBrowser(isMobile = false) {
    return puppeteer.launch({
        ignoreHTTPSErrors: true,
        headless: isProduction,
        devtools: !isProduction,
        executablePath: platform === 'win32' ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' : '/usr/bin/google-chrome',
        timeout: 60000,
        // defaultViewport: {
        //     // width: 375,
        //     // height: 667,
        //     isMobile,
        // },
        args: ['--no-sandbox', '--v1=1', '--disable-dev-shm-usage', '--no-first-run', '--disable-setuid-sandbox'],
    });
}

// 请求接口并返回对应的任务信息
async function getTaskInfo(id) {
    return {
        url: 'https://om.jrdaimao.com',
    };
}
// 检查浏览器上的网站
async function checkWebsite(data) {
    const browser = await createBrowser();
    console.log('创建浏览器');
    const pages = await browser.pages();
    let page = pages[0];
    if (!page) {
        page = await browser.newPage();
    }
    console.log('新建页面');
    await page.setDefaultNavigationTimeout(0);
    // await page.emulate(KnownDevices['iPhone 7']);

    // 监听消息
    page.on('console', (msg) => console.log('PAGE LOG:', msg.type(), msg.text(), msg.location()));
    // await page.evaluate(() => console.log(`url is ${location.href}`));
    // 监听请求返回
    page.on('response', (res) => {
        console.log(res.ok(), res.url());
    });
    page.on('domcontentloaded', () => {
        console.log('DOM完成');
    });
    page.on('pageerror', (err) => {
        console.log('页面报错', err.message);
    });
    page.on('load', () => {
        console.log('页面加载完成,静态资源加载完成');
    });
    await page.goto(data.url, {
        waitUntil: 'load',
        timeout: 0,
    });
    console.log('打开页面', data.url);

    await sleep(1000);
}
/**
 * 入口函数，接收参数并检查对应的页面
 * 例如 node test.js --id 123
 */
async function Main() {
    const params = minimist(process.argv);
    console.log('脚本参数', params);
    // 不存在的id
    if (!params.id) return;
    //id存在，获取信息
    const data = await getTaskInfo(params.id);
    console.log('数据', data);
    //执行检查函数
    await checkWebsite(data);
}
Main();

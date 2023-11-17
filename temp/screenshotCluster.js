import { fileURLToPath } from 'url';
import { Cluster } from 'puppeteer-cluster';
import os from 'os';
import fs from 'fs';
import path, { dirname } from 'path';
import Upload from '@dm/img_oss';
import axios from 'axios';
import { deleteFolderRecursive } from './util/deleteFolder.js';
import vm from 'vm';

const { default: IMGOSS } = Upload;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { NODE_ENV = '' } = process.env;

// 是否生产环境
const isProduction = NODE_ENV === 'production';

const IMGCLIENT = new IMGOSS(isProduction ? 'juranapp-prod' : 'juranapp-test');
const TEMP_PATH = path.join(__dirname, '../downloads');

if (!fs.existsSync(TEMP_PATH)) fs.mkdirSync(TEMP_PATH, { recursive: true });

// 当前系统所属平台，主要是兼容本地开发环境
const platform = os.platform();
const sleep = (time) => new Promise((ok) => setTimeout(ok, time));

async function execScripts(scripts) {
    return vm.runInNewContext(scripts, { axios }, { timeout: 50000 });
}

async function crawler(params, variable) {
    let isError = false;
    const launchOptions = {
        ignoreHTTPSErrors: true,
        headless: isProduction,
        devtools: !isProduction,
        // executablePath: platform === 'win32' ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' : '/usr/bin/google-chrome',
        timeout: 60000,
        defaultViewport: {
            width: params.browser === 2 ? 375 : 1366,
            height: params.browser === 2 ? 667 : 768,
            isMobile: params.browser === 2 ? true : false,
        },
        args: ['--no-sandbox', '--v1=1', '--disable-dev-shm-usage', '--no-first-run', '--disable-setuid-sandbox'],
    };
    const clusterLanuchOptions = {
        concurrency: Cluster.CONCURRENCY_PAGE, // 单Chrome多tab模式 ,Cluster.CONCURRENCY_CONTEXT, // 使用多线程或多进程
        maxConcurrency: 5, // 并发的workers数
        retryLimit: 2, // 重试次数
        skipDuplicateUrls: true, // 不爬重复的url
        monitor: false, // 显示性能消耗
        puppeteerOptions: launchOptions,
    };
    const cluster = await Cluster.launch(clusterLanuchOptions);

    let imgList = [];
    // 定义任务处理函数
    await cluster.task(async ({ page, data }) => {
        // await page.goto(data.url);
        if (variable) {
            for (const item of variable) {
                // 执行自动脚本
                if (item.isScript === 1) {
                    item.value = await execScripts(item.scripts);
                }
                // 设置localStorage的值
                if (item.type === 1) {
                    await page.goto(data.url);
                    await page.evaluate(
                        (key, value) => {
                            if (!window.localStorage.getItem(key)) {
                                window.localStorage.setItem(key, value);
                            }
                        },
                        item.key,
                        item.value
                    );
                }
                // 设置sessionStorage
                if (item.type === 2) {
                    await page.goto(data.url);
                    await page.evaluate(
                        (key, value) => {
                            if (sessionStorage.getItem(key)) {
                                sessionStorage.setItem(key, value);
                            }
                        },
                        item.key,
                        item.value
                    );
                }
                // 设置cookie
                if (item.type === 3) {
                    await page.setCookie({
                        name: item.key,
                        value: item.value,
                        domain: item.cookieDomain,
                    });
                }
                // 设置额外的请求头
                if (item.type === 4) {
                    await page.setExtraHTTPHeaders({
                        [item['key']]: item.value,
                    });
                }
            }
        }
        await sleep(2000);
        page.on('error', async (error) => {
            // const errorInfo = `错误消息:${JSON.stringify(error.message)},错误内容：${JSON.stringify(error.stack)}`;
            const errorImg = await getScreenshot(page, 'error');
            await sleep(2000);
            isError = true;
            console.error(JSON.stringify({ status: 'error', type: '页面报错', errorInfo: JSON.stringify(error), imgList: [errorImg] }));

            return;
        });
        page.on('pageerror', async (error) => {
            const errorImg = await getScreenshot(page, 'error');
            // const errorInfo = `错误消息:${JSON.stringify(error.message)},错误内容：${JSON.stringify(error.stack)}`;
            isError = true;
            await sleep(3000);
            console.error(JSON.stringify({ status: 'error', type: '异常信息', errorInfo: error.toString(), imgList: [errorImg] }));
            return;
        });
        let lastErrorMessage = false; // 添加标识来记录截图是否已经被执行
        page.on('console', async (message) => {
            // const errorImg  = await getScreenshot(page, 'error')
            if (message.type() === 'error' && message.text().indexOf('options.token') === -1) {
                if (!lastErrorMessage) {
                    lastErrorMessage = `${message.text()};来源位置信息：${message.location().url}, ${message.location().lineNumber}`;
                    await sleep(3000);
                    const errorImg = await getScreenshot(page, 'error');
                    isError = true;
                    await sleep(3000);
                    console.error(JSON.stringify({ status: 'error', type: '页面 JavaScript 错误', errorInfo: lastErrorMessage, imgList: [errorImg] }));
                    return;
                }
            }
        });
        // 监听页面的网络请求
        let shouldTakeScreenshot = false; // 防止重复截图
        page.on('response', async (response) => {
            if (response.status() >= 400) {
                // console.log('Failed to load resource:', response.url());
                if (shouldTakeScreenshot) {
                    const errorImg = await getScreenshot(page, 'error');
                    isError = true;
                    const errorInfo = `状态码:${response.status()},请求的 URL:${response.url()}`;
                    await sleep(3000);
                    console.error(JSON.stringify({ status: 'error', type: '网络请求错误', errorInfo: errorInfo, imgList: [errorImg] }));
                    return;
                }
            }
        });
        shouldTakeScreenshot = true;
        await page.goto(data.url, {
            waitUntil: 'networkidle0', // 没有网络请求时认为页面加载完成
        });

        await sleep(2000);
        try {
            const filePath = `${TEMP_PATH}/example${data.cur}.png`;
            await page.screenshot({ path: filePath, fullPage: true });
            const file = fs.readFileSync(filePath);
            const res = await IMGCLIENT.client.put(`dm_patrol_task_server/${new Date().getTime()}.png`, file);
            imgList.push(res.url);
            await sleep(2000);
        } catch (error) {
            isError = true;
            console.error('截图失败', error);
        }
    });
    const pageUrls = params.url?.split(',') || [];
    // 添加多个巡检任务
    for (let i = 0; i < pageUrls.length; i++) {
        cluster.queue({ url: pageUrls[i], cur: i });
    }
    // 等待所有任务完成
    await cluster.idle();
    await cluster.close();
    if (!isError) console.log(JSON.stringify({ status: 'success', imgList: imgList, taskId: params.taskId }));
    if (fs.existsSync(TEMP_PATH)) {
        // 删除临时文件夹
        deleteFolderRecursive(TEMP_PATH);
    }
}

// 请求接口并返回对应的任务信息
async function getTaskInfo(id) {
    try {
        const res = await axios.get(isProduction ? 'http://127.0.0.1:18006/api/api_task/getDetails' : 'http://127.0.0.1:8082/api/api_task/getDetails', {
            params: {
                taskId: id,
            },
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
            },
        });
        return res.data.data;
    } catch (error) {
        console.error('获取任务信息', error);
    }
}

// 截图并上传
async function getScreenshot(page, cur) {
    const filePath = `${TEMP_PATH}/example${cur}.png`;
    await page.screenshot({ path: filePath, fullPage: true });
    const file = fs.readFileSync(filePath);
    const res = await IMGCLIENT.client.put(`dm_patrol_task_server/${new Date().getTime()}.png`, file);
    await sleep(1000);
    return res.url;
}
// 请求接口并返回对应的任务所需要的配置信息
async function getVariableInfo(id) {
    try {
        const res = await axios.post(isProduction ? 'http://127.0.0.1:18006/api/api_variable/getListById' : 'http://127.0.0.1:8082/api/api_variable/getListById', {
            ids: JSON.parse(id),
        });
        return res.data.data;
    } catch (error) {
        console.error('获取配置信息', error);
    }
}
async function Main() {
    try {
        const args = process.argv.slice(2);
        const taskId = args[0];
        const params = await getTaskInfo(taskId);
        let variable = null;
        if (params.variable) {
            variable = await getVariableInfo(params.variable);
        }
        //执行检查函数
        await crawler(params, variable);
    } catch (err) {}
}
Main();

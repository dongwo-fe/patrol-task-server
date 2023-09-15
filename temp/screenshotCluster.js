import { fileURLToPath } from 'url';
import { Cluster } from 'puppeteer-cluster';
import os from 'os';
import fs from 'fs';
import path, { dirname } from 'path';
import Upload from '@dm/img_oss';
import axios from 'axios';
import { deleteFolderRecursive } from './util/deleteFolder.js';

const { default: IMGOSS } = Upload; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { NODE_ENV = '' } = process.env;

// 是否生产环境
const isProduction = NODE_ENV === 'production';

const IMGCLIENT = new IMGOSS(isProduction ? 'juranapp-prod': 'juranapp-test');
const TEMP_PATH = path.join(__dirname, "../downloads");

if (!fs.existsSync(TEMP_PATH)) fs.mkdirSync(TEMP_PATH, { recursive: true });

// 当前系统所属平台，主要是兼容本地开发环境
const platform = os.platform();
const sleep = (time) => new Promise((ok) => setTimeout(ok, time));

async function crawler(params) {
  const launchOptions = {
    ignoreHTTPSErrors: true,
    headless: isProduction,
    devtools: !isProduction,
    executablePath: platform === 'win32' ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' : '/usr/bin/google-chrome',
    timeout: 60000,
    defaultViewport: {
        width: params.browser === 2 ? 375 : 1366,
        height: params.browser === 2 ? 667 : 768,
        isMobile: params.browser === 2 ? true : false,
    }, 
    args: ['--no-sandbox', '--v1=1', '--disable-dev-shm-usage', '--no-first-run', '--disable-setuid-sandbox'],
  };
  const clusterLanuchOptions = {
    concurrency: Cluster.CONCURRENCY_PAGE,  // 单Chrome多tab模式 ,Cluster.CONCURRENCY_CONTEXT, // 使用多线程或多进程
    maxConcurrency: 5,  // 并发的workers数
    retryLimit: 2,   // 重试次数
    skipDuplicateUrls: true,  // 不爬重复的url
    monitor: false,  // 显示性能消耗
    puppeteerOptions: launchOptions,
  };
  const cluster = await Cluster.launch(clusterLanuchOptions);
  
  let imgList = [];
  // 定义任务处理函数
  await cluster.task(async ({ page, data}) => {
    // await page.goto(data.url);
    // 设置localStorage的值
    if (params.isToken) {
      await page.goto(data.url);
      await page.evaluate((key,value) => {
        if(!window.localStorage.getItem(key)){
          window.localStorage.setItem(key, value);
        }
      },params.tokenName, params.token);
      await sleep(2000);
    }
    // 设置cookie
    if (params.isCookie) {
      await page.setCookie({
        name: params.cookieName,
        value: params.cookie,
        domain: params.cookieDomain,
      });
      await sleep(2000);
    }
    await page.goto(data.url,{
      waitUntil: 'networkidle0',  // 没有网络请求时认为页面加载完成
    });
    await sleep(2000);
    const filePath = `${TEMP_PATH}/example${data.cur}.png`;
    await page.screenshot({path: filePath});
    const file = fs.readFileSync(filePath);
    const res = await IMGCLIENT.client.put(`dm_patrol_task_server/${new Date().getTime()}.png`, file);
    imgList.push(res.url);
    await sleep(1000);
  });
  const pageUrls = params.url?.split(',') || [];
  // 添加多个巡检任务
  for (let i = 0; i < pageUrls.length; i++) {
    cluster.queue({ url: pageUrls[i], cur: i});
  }
  // 等待所有任务完成
  await cluster.idle();
  await cluster.close();
  console.log(JSON.stringify({'status':'success','imgList':imgList, 'taskId': params.taskId}));
  if (fs.existsSync(TEMP_PATH)) { // 删除临时文件夹
    deleteFolderRecursive(TEMP_PATH);
  };
};

// 请求接口并返回对应的任务信息
async function getTaskInfo(id) {
  try {
    const res = await axios.get('http://127.0.0.1:8082/api/api_task/getDetails', {
      params: {
        taskId: id
      },
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    });
    return res.data.data;
  } catch (error) {
    
  }
}
async function Main() {
  try{
    const args = process.argv.slice(2);
    const taskId = args[0];
    const params = await getTaskInfo(taskId);
    //执行检查函数
    await crawler(params);
  }catch(err){
    console.error(err)
  }
}
Main();
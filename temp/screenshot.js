import { fileURLToPath } from 'url';
import puppeteer, { KnownDevices } from 'puppeteer-core';
import os from 'os';
import fs from 'fs';
import path, { dirname } from 'path';
import Upload from '@dm/img_oss';
import deleteFolderRecursive from '../src/util/deleteFolder.js';

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

const args = process.argv.slice(2);
const urlList = args[0];
const token = args[1];
const taskId = args[2];
const browserType = args[3];
console.log(urlList,token,taskId,browserType,args)
/**
 * 创建一个浏览器
 * @returns 浏览器对象
 */
async function createBrowser(isMobile = false) {
  console.log(isMobile)
    return puppeteer.launch({
        ignoreHTTPSErrors: true,
        headless: isProduction,
        devtools: !isProduction,
        executablePath: platform === 'win32' ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' : '/usr/bin/google-chrome',
        timeout: 60000,
        defaultViewport: {
            width: isMobile ? 375 : 1366,
            height: isMobile ? 667 : 768,
            isMobile,
        },
        args: ['--no-sandbox', '--v1=1', '--disable-dev-shm-usage', '--no-first-run', '--disable-setuid-sandbox'],
    });
}
(async () => {
  // 获取传递的参数
  try {
    const browser = await createBrowser(browserType == 1 ? false : true);
    
    // const pages = await browser.pages();
    
    const pageUrls = urlList?.split(',') || [];
    let imgList = [];
    for(let i=0; i<pageUrls.length; i++) {
      const page = await browser.newPage();
      // 设置localStorage的值
      if (token) {
        await page.goto(pageUrls[i]);
        await page.evaluate((key,value) => {
          if(!window.localStorage.getItem(key)){
            window.localStorage.setItem(key, value);
          }
        },'jwtToken',token);
        await sleep(2000);
      }
      await page.goto(pageUrls[i],{
        waitUntil: 'networkidle0',  // 没有网络请求时认为页面加载完成
      });
      const filePath = `${TEMP_PATH}/example${i+1}.png`;
      await page.screenshot({path: filePath});
      const file = fs.readFileSync(filePath);
      const res = await IMGCLIENT.client.put(`dm_patrol_task_server/${new Date().getTime()}.png`, file);
      imgList.push(res.url);
      await sleep(1000);
      await page.close();
    }
    console.log(JSON.stringify({'status':'success','imgList':imgList, 'taskId': taskId}));
    if (fs.existsSync(TEMP_PATH)) { // 删除临时文件夹
      deleteFolderRecursive(TEMP_PATH);
    };
    await browser.close();
  } catch (error) {
    console.error('error',error)
  }
})();
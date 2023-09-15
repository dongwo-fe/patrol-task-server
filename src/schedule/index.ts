import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import {  ModifyTaskResult, UpdateTaskState } from '../service/task';

const ROOT_PATH = process.cwd();
const TEMP_PATH = path.join(ROOT_PATH, './temp');

if (!fs.existsSync(TEMP_PATH)) fs.mkdirSync(TEMP_PATH);

// 执行js文件
export async function runNodejs(curTask) {
    console.log(ROOT_PATH);
    console.log(TEMP_PATH);

    // const ps = spawn('node', ['screenshotCluster.js',curTask.url,curTask.token,curTask.taskId,curTask.browser,curTask.isToken,curTask.isCookie,curTask.tokenName,curTask.cookieName,curTask.cookie,curTask.cookieDomain,], { cwd: TEMP_PATH });
    const ps = spawn('node', ['screenshotCluster.js',curTask.taskId], { cwd: TEMP_PATH });
    ps.stdout.on('data', (data) => {
      try {
        console.log('data---------:',data.toString());
        let res = JSON.parse(data.toString()) || {};
        UpdateTaskState(curTask.id, 1)
        ModifyTaskResult(curTask.name, (res.imgList).toString(), res.taskId);
      } catch (error) {
        console.log('errorinfo-------------------:', data.toString());
      }
    });
    ps.stderr.on('data', (data) => {
        console.log('err-------------:', data.toString());
        UpdateTaskState(curTask.id, 0, data.toString())
    });
    ps.on('close', (code) => {
        if (code !== 0) {
            console.log(`ps process exited with code ${code}`);
        }
        console.log('end');
    });
}



// 创建任务管理器
// const taskManager = new TaskManager();

// 添加定时任务
// taskManager.addTask('task1', '1 * * * *', () => {
//   console.log('任务1执行');
// });

// taskManager.addTask('task2', '*/5 * * * *', () => {
//   console.log('任务2执行');
// });

// 取消定时任务
// taskManager.cancelTask('task1');
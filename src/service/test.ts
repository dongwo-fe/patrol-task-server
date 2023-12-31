import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const ROOT_PATH = process.cwd();
const TEMP_PATH = path.join(ROOT_PATH, './temp');

if (!fs.existsSync(TEMP_PATH)) fs.mkdirSync(TEMP_PATH);

// 执行js文件
export async function runNodejs() {
    console.log(ROOT_PATH);
    console.log(TEMP_PATH);

    const ps = spawn('node', ['screenshot.js'], { cwd: TEMP_PATH });
    ps.stdout.on('data', (data) => {
        console.log('info-------------------:', data.toString());
    });
    ps.stderr.on('data', (data) => {
        console.log('err-------------:', data.toString());
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
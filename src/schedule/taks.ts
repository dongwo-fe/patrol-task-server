import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { ModifyTaskResult, UpdateTaskState } from '../service/task';
import log from '../util/log';
import { sendDingTalk } from '../service/dingding';

const ROOT_PATH = process.cwd();
const TEMP_PATH = path.join(ROOT_PATH, './temp');

if (!fs.existsSync(TEMP_PATH)) fs.mkdirSync(TEMP_PATH);

// 执行js文件
export async function runNodejs(curTask) {
    try {
        log.info('ROOT_PATH:---', ROOT_PATH, process.env.NODE_ENV);
        log.info('TEMP_PATH:---', TEMP_PATH);
        const nodePath = process.env.NODE_ENV === 'production' ? '/usr/local/node16/bin/node' : 'node';
        const ps: any = spawn(nodePath, ['screenshotCluster.js', curTask.taskId], { cwd: TEMP_PATH });
        log.info('ps:---', ps);
        ps.stdout.on('data', (data) => {
            // 子进程的输出
            try {
                log.info('data---------:', data.toString());
                let res = JSON.parse(data.toString()) || {};
                UpdateTaskState(curTask.id, 1);
                ModifyTaskResult(curTask.name, res.imgList.toString(), res.taskId, false);
            } catch (error) {
                log.info('errorinfo-------------------:', data.toString());
            }
        });
        ps.stderr.on('data', (data) => {
            // 子进程的错误
            try {
                log.info('err-------------:', data.toString());
                let res = JSON.parse(data.toString()) || {};
                UpdateTaskState(curTask.id, 0, data.toString()); // 修改任务状态
                ModifyTaskResult(curTask.name, '', curTask.taskId, true, res.errorInfo, res.type); //增加一条错误信息
                sendDingTalk(curTask.taskId, res); // 发送钉钉通知
            } catch (error) {
                log.info('error-------------------:', data.toString());
                UpdateTaskState(curTask.id, 0, data.toString());
            }
        });
        ps.on('close', (code) => {
            // 子进程退出
            if (code !== 0) {
                log.info(`ps process exited with code ${code}`);
            }
            log.info('end', code);
        });
    } catch (error) {
        log.info('执行出错：', error);
        UpdateTaskState(curTask.id, 0, '执行出错');
    }
}

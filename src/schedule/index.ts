import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { ModifyTaskResult, UpdateTaskState } from '../service/task';
import log from '../util/log';

const ROOT_PATH = process.cwd();
const TEMP_PATH = path.join(ROOT_PATH, './temp');

if (!fs.existsSync(TEMP_PATH)) fs.mkdirSync(TEMP_PATH);

// 执行js文件
export async function runNodejs(curTask) {
  try {
    log.info('ROOT_PATH:---', ROOT_PATH,process.env.NODE_ENV);
    log.info('TEMP_PATH:---', TEMP_PATH);
    const nodePath = process.env.NODE_ENV === 'production' ? '/usr/local/node16/bin/node' : 'node';
    const ps:any = spawn(nodePath, ['screenshotCluster.js', curTask.taskId], { cwd: TEMP_PATH });
    ps.stdout.on('data', (data) => {
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
        try {
            log.info('err-------------:', data.toString());
            let res = JSON.parse(data.toString()) || {};
            UpdateTaskState(curTask.id, 0, data.toString());
            ModifyTaskResult(curTask.name, res.imgList.toString(), curTask.taskId, true, res.errorInfo, res.type);
        } catch (error) {
            log.info('error-------------------:', data.toString());
            UpdateTaskState(curTask.id, 0, data.toString());
        }
    });
    ps.on('close', (code) => {
        if (code !== 0) {
            log.info(`ps process exited with code ${code}`);
        }
        log.info('end',code);
    });
  } catch (error) {
    log.info('执行出错：',error);
    UpdateTaskState(curTask.id, 0, '执行出错');
  }
}

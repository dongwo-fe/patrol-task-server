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
    log.info('ROOT_PATH', ROOT_PATH);
    log.info('TEMP_PATH', TEMP_PATH);

    // const ps = spawn('node', ['screenshotCluster.js',curTask.url,curTask.token,curTask.taskId,curTask.browser,curTask.isToken,curTask.isCookie,curTask.tokenName,curTask.cookieName,curTask.cookie,curTask.cookieDomain,], { cwd: TEMP_PATH });
    const ps = spawn('node', ['screenshotCluster.js', curTask.taskId], { cwd: TEMP_PATH, env: { NODE_ENV: process.env.NODE_ENV } });
    const stdoutStream = fs.createWriteStream('stdout.log');
    const stderrStream = fs.createWriteStream('stderr.log');
    ps.stdout.pipe(stdoutStream);
    ps.stderr.pipe(stderrStream);
    /* ps.stdout.on('data', (data) => {
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
    }); */
    ps.on('close', (code) => {
        if (code !== 0) {
            log.info(`ps process exited with code ${code}`);
        }
        log.info('end',code);
        // 在服务器上读取输出文件的内容
        const stdoutData = fs.readFileSync('stdout.log', 'utf-8');
        const stderrData = fs.readFileSync('stderr.log', 'utf-8');
        log.info('data from child (stdout): ' + stdoutData);
        log.info('data from child (stderr): ' + stderrData);
        if (stdoutData) {
          try {
            let res = JSON.parse(stdoutData.toString()) || {};
            log.info('成功了-------------------:', stdoutData.toString());
            if (res && res.status === 'success') {
              UpdateTaskState(curTask.id, 1);
              ModifyTaskResult(curTask.name, res.imgList.toString(), res.taskId, false);
            }
          } catch (error) {
              log.info('errorinfo-------------------:', stdoutData.toString());
          }
        }
        if (stderrData) {
          const res = stderrData.split('\n').reduce((acc:any, jsonString) => {
            try {
              const jsonObject = JSON.parse(jsonString);
              acc.push(jsonObject);
            } catch (error) {
              console.error('Invalid JSON:', jsonString);
            }
            return acc;
          }, []);
          log.info('失败-------------:', res);
          try {
            if (res && res.length) {
              let cur = res.length-1;
              // let res = JSON.parse(stderrData.toString()) || {};
              UpdateTaskState(curTask.id, 0, res[cur].toString());
              ModifyTaskResult(curTask.name, res[cur].imgList.toString(), curTask.taskId, true, res[cur].errorInfo, res[cur].type);
            }
          } catch (error) {
              log.info('error-------------------:', stderrData.toString());
              UpdateTaskState(curTask.id, 0, res[0].toString() || '检测失败');
          }
        }
    });
}

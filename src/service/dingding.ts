import TaskModel from '../model/task';
import crypto from 'crypto';
import axios from 'axios';

// 前端开发团队
export const dwFrontKey = 'SEC2117cce35290d82be96ba0a9e6a9c28126224f2aa705eba105996240d6f6005d';
export const dwFrontGrouoWebhookAccessToken = '75b23380f82181ad066e1b5dd9af35eda1c19036bb4354ec5317112fb8d1824e';

// 方式到钉钉
export async function sendDingTalk(taskId, data) {
    try {
        const TaskData: any = await TaskModel.findByTaskId(taskId);
        const browser = TaskData?.browser || ''; // 浏览器类型;
        const title = '巡检报警通知';
        const message = [`巡检ID：${taskId}`, `巡检地址：${TaskData?.url}`, `错误类型：${data.type}`, `错误信息：${data.errorInfo}`];
        await tongzhiFEDD(taskId, browser, title, message);
        console.log('钉钉通知发送成功');
    } catch (error) {
        console.log('钉钉通知发送失败');
    }
}

/**
 * 前端组需求提测，通知到钉钉前端群
 * @param id 需求编号
 * @param title 需求名称
 * @param message 描述
 */
async function tongzhiFEDD(id: string, browserType: number, title: string, message: string[]) {
    const btns: any[] = [];
    const texts = [title, ...message];
    btns.push({
        title: '查看',
        actionURL: `dingtalk://dingtalkclient/page/link?pc_slide=false&url=${encodeURIComponent(
            `http://59.110.230.100:18006/#/taskManagementDetails?taskId=${id}&browser=${browserType}`
        )}`,
    });
    try {
        await postToDD(dwFrontKey, dwFrontGrouoWebhookAccessToken, {
            msgtype: 'actionCard',
            actionCard: {
                title,
                text: texts.join('\n\n'),
                btns,
            },
        });
    } catch (error) {
        console.log('失败失败', error);
    }
}

/**
 * 通知到钉钉群
 * @param key 加密Key
 * @param webhook 调用的勾子链接
 * @param data 传入的数据
 */
async function postToDD(key: string, access_token: string, data: any) {
    const timestamp = Date.now();
    const sha = crypto.createHmac('SHA256', key);
    sha.update(`${timestamp}\n${key}`, 'utf8');
    const sign = encodeURI(sha.digest('base64'));
    // 洞窝前端群
    await axios.post('https://oapi.dingtalk.com/robot/send', data, { params: { access_token, timestamp, sign } });
}

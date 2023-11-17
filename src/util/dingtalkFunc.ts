import crypto from 'crypto';
import {
  dwFrontKey,
  dwFrontGrouoWebhookAccessToken,
} from "../configs/dingtalk";
import { sendToRobot } from '../api/dingtalkApis';

/**
 * 通知到钉钉群
 * @param key 加密Key
 * @param webhook 调用的勾子链接
 * @param data 传入的数据
 */
async function postToDD(key: string, webhookAccessToken: string, data: any) {
  const timestamp = Date.now();
  const sha = crypto.createHmac('SHA256', key);
  sha.update(`${timestamp}\n${key}`, 'utf8');
  const sign = encodeURI(sha.digest('base64'));
  // 洞窝前端群
  await sendToRobot({ access_token: webhookAccessToken, timestamp, sign }, data);
}

/**
 * 前端组需求提测，通知到钉钉前端群
 * @param id 需求编号
 * @param title 需求名称
 * @param message 描述
 */
export async function tongzhiFEDD(id: string, browserType: number, title: string, message: string[]) {
  const btns: any[] = [];
  const texts = [title, ...message];
  btns.push({
    title: '查看',
    actionURL: `dingtalk://dingtalkclient/page/link?pc_slide=false&url=${encodeURIComponent(`http://59.110.230.100:18006/#/taskManagementDetails?taskId=${id}&browser=${browserType}`)}`,
  });
  try {
    await postToDD(dwFrontKey,dwFrontGrouoWebhookAccessToken, {
      msgtype: 'actionCard',
      actionCard: {
        title,
        text: texts.join('\n\n'),
        btns,
      },
    });
  } catch (error) {
    console.log('失败失败',error);
  }
}






import TaskModel from '../model/task';
import { tongzhiFEDD } from '../util/dingtalkFunc';
export default async function sendDingTalk (taskId, data) {
  const TaskData:any = await TaskModel.findByTaskId(taskId);
  const browser = TaskData?.browser || ''; // 浏览器类型;
  const title = '巡检报警通知';
  const message = [`巡检ID：${taskId}`, `巡检地址：${TaskData?.url}`,`错误类型：${data.type}`, `错误信息：${data.errorInfo}`]
  try {
    await tongzhiFEDD(taskId, browser, title, message);
    console.log('钉钉通知发送成功');
  } catch (error) {
    console.log('钉钉通知发送失败');
  }
}
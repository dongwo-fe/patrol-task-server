import { dingtalkOApiFetch } from "../fetch";

const dingtalkApi = dingtalkOApiFetch();

/**
 * 发送到钉钉机器人
 * @param params url上拼接的参数
 * @param data 请求数据
 * @returns 结果
 */
export const sendToRobot = (params: { access_token: string; sign: string; timestamp: number }, data: any) => {
  console.log('测试');
  return dingtalkApi.post('/robot/send', data, { params });
};

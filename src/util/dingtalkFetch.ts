import axios from 'axios';

/**
 * 钉钉开放接口网关
 * @returns Axios Instance
 */
export const dingtalkOApiFetch = () => {
  // 获取钉钉开放接口域名
  const dingtalkHost = 'https://oapi.dingtalk.com';
  // 创建axios请求对象
  const instance = axios.create({ baseURL: dingtalkHost });
  // 处理响应数据
  instance.interceptors.response.use((res) => res.data);
  return instance;
};

import CodeManger from '../model/codeManger';

/**
 * 获取所有生效的code码
 * @returns 数组
 */
export async function getCodeAll() {
    const data = await CodeManger.getAll();
    return data;
}

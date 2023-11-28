import CodeManger from '../model/codeManger';

/**
 * 获取所有生效的code码
 * @returns 数组
 */
export async function getCodeAll() {
    const data = await CodeManger.getAll();
    return data;
}

/**
 * 获取列表，分页
 * @param pageindex 页码
 * @param name 名称
 * @param status 状态
 * @returns
 */
export async function getCodeList(pageindex?: string, name?: string, status?: string) {
    let index: number | undefined = undefined;
    if (pageindex) index = Number(pageindex);
    let status2: number | undefined = undefined;
    if (status) status2 = Number(status);
    const data = await CodeManger.getList(index, name, status2);
    return data;
}
/**
 * 编辑或者新增
 * @param data 数据
 * @param id id
 * @returns
 */
export async function editCode(data, id?: number) {
    if (id) {
        return CodeManger.update(data, { where: { id } });
    } else {
        return CodeManger.insert(data);
    }
}

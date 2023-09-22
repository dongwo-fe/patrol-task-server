import { customAlphabet } from 'nanoid';
import VariableModel from '../model/variable';

const random = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 6);
//列表
export async function GetVariableList(pageindex: any, name: string, type?: any) {
    if (type !== undefined && type !== '') {
        type = type * 1;
    } else {
        type = undefined;
    }
    if (pageindex) pageindex = pageindex * 1;
    const data = await VariableModel.getList(pageindex, name, type);
    return data;
}

// 创建 name, type, key, value, cookieDomain
export async function ModifyVariable(operator:string, name:string, type:number,  key: string, value: boolean, cookieDomain?:string, id?:number | string){
  //如果已经存在，则不能继续增加
  if (name) {
    const model = await VariableModel.findByName(name);
    if (model && model.id !== id) throw new Error('已经存在相同的变量名称');
  }
  let data: any = {
      operator,
  };
  if (name) {
      data.name = name;
  }
  if (type) {
      data.type = type;
  }
  if (key) {
    data.key = key;
  }
  if (value) {
    data.value = value;
  }
  if (cookieDomain) {
    data.cookieDomain = cookieDomain;
  }
  if (id && id !== '0') {
    return VariableModel.update(data, id);
  }
  return VariableModel.insert(data);
}

// 删除
export async function DelVariable(id: number) {
  const model = await VariableModel.get(id);
  if (!model) return;
  await VariableModel.del(id);
};

// 获取全部
export async function GetAll() {
  const data = await VariableModel.getAll();
  return data;
};

// 根据id获取对应的信息
export async function GetListById(ids) {
  try{
    const data = await VariableModel.findById(ids)
    return data;
  }catch(error){
    console.log('error333:',error)
    throw new Error('cuole')
  }
  };

// 根据变量id获取变量信息

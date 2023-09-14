import { customAlphabet } from 'nanoid';
import TaskModel from '../model/task';
import TaskResult from '../model/taskResult';
import TaskManager from '../util/taskManager';
import { runNodejs } from '../schedule/index';

const random = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 6);
//列表
export async function GetTaskList(pageindex: any, title: string, state?: any) {
    if (state !== undefined && state !== '') {
        state = state * 1;
    } else {
        state = undefined;
    }
    if (pageindex) pageindex = pageindex * 1;
    const data = await TaskModel.getList(pageindex, title, state);
    return data;
}

// 创建任务 name, url, time, isCookie, isToken, tokenName, token, cookieName, cookie, cookieDomain
export async function ModifyTask(operator:string, name:string, url:string,  time: string, isCookie: boolean, isToken: boolean, tokenName?:string, token?:string, cookieName?:string, cookie?:string, cookieDomain?:string, id?:number | string){
  //如果已经存在，则不能继续增加
  if (name) {
    const model = await TaskModel.findByName(name);
    if (model && model.id !== id) throw new Error('已经存在相同的任务名称');
  }
  if (isToken && (!tokenName || !token)) throw new Error('请正确填写token');
  if (isCookie && (!cookieName || !cookie || !cookieDomain)) throw new Error('请正确填写cookie');
  let data: any = {
      operator,
      taskId: random(), // 用来启用和关闭定时任务
      isCookie,
      isToken,
  };
  if (name) {
      data.name = name;
  }
  if (url) {
      data.url = url;
  }
  if (time) {
    data.time = time;
  }
  if (tokenName) {
    data.tokenName = tokenName;
  }
  if (token) {
    data.token = token;
  }
  if (cookieName) {
    data.cookieName = cookieName;
  }
  if (cookie) {
    data.cookie = cookie;
  }
  if (cookieDomain) {
    data.cookieDomain = cookieDomain;
  }
  return TaskModel.insert(data);
}

// 删除
export async function DelTask(id: number) {
  const model = await TaskModel.get(id);
  if (!model) return;
  if (model.state === 1) throw new Error('启用中任务的不能删除');
  await TaskModel.del(id);
};
// 启停
export async function ControlTask(id: number,state: number) {
  const model = await TaskModel.get(id);
  if (!model) return;
  
  if (model.checkState === 2) throw new Error('执行中任务的不能操作');
  if (!model.taskId) throw new Error('找不到需要执行的任务id');
  await TaskModel.update({ state }, id);
  // 开启定时任务
  const taskManager = new TaskManager();
  if (state === 1) {
    console.log('开启----------')
    // 添加定时任务
    taskManager.addTask(model.taskId, model.time, async() => {
      console.log('任务1执行');
      autoTask(id, model)
    });
  } else if (state === 0) {
    console.log('关闭----------')
    // 关闭定时任务
    taskManager.cancelTask(model.taskId);
  }
};
// 自动支持
export async function autoTask(id: number, model) {
  console.log('来了')
  await TaskModel.update({ checkState: 2 }, id);
  runNodejs(model);
}

// 任务信息

export async function GetTaskDetails(taksId) {
  const data = await TaskResult.get(taksId);
  return data;
}

// 执行任务
export async function RunTask(id: number) {
  const model = await TaskModel.get(id);
  if (!model) return;
  if (model.checkState === 2) throw new Error('任务已经在执行中了');
  if (model.state === 0) throw new Error('停用的任务的不能执行');
  console.log('model::------------------:',model);
  await TaskModel.update({ checkState: 2 }, id);
  runNodejs(model);
}

// 更新任务执行状态
export async function UpdateTaskState(id: number,checkState: number, failureReason?: string) {
  const model = await TaskModel.get(id);
  if (!model) return;
  if (!model.taskId) throw new Error('找不到需要更新的任务id');
  await TaskModel.update({ checkState, failureReason: failureReason || ''}, id);
};

// 更新任务关联表
export async function ModifyTaskResult(name:string, imgList:string,  taskId: string){
  //如果已经存在，则不能继续增加
  let data: any = {};
  if (name) {
      data.name = name;
  }
  if (imgList) {
      data.imgList = imgList;
  }
  if (taskId) {
      data.taskId = taskId;
  }
  return TaskResult.insert(data);
}

//任务详情列表
export async function GetTaskDetailsList(pageindex, taksId) {
  if (pageindex) pageindex = pageindex * 1;
  const data = await TaskResult.getList(pageindex, taksId);
  data.rows.forEach((item:any) => {
    item.imgList = item.imgList?.split(',') || [];
  })
  return data;
}
//建表
export async function Create() {

  const data = await TaskModel.sync(true);
  return data;
}
import { customAlphabet } from 'nanoid';
import TaskModel from '../model/task';
import VariableModel from '../model/variable'; // findById
import TaskResult from '../model/taskResult';
import TaskManager from '../util/taskManager';
import { runNodejs } from '../schedule/taks';

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
    data.rows.forEach((item) => {
      item.variableArr = JSON.parse(item.variableArr);
      item.variable = JSON.parse(item.variable);
    });
    return data;
}

// 创建任务 name, url, time, browser, variable
export async function ModifyTask(operator:string, name:string, url:string,  time: string, browser: number, variable?: Array<number>, id?:number | string){
  //如果已经存在，则不能继续增加
  try {
    if (name && id === 0) {
      const model = await TaskModel.findByName(name);
      if (model && model.id !== id) throw new Error('已经存在相同的任务名称');
    }
    let variableArr:Array<any> = [];
    if (variable) {
      const data = await VariableModel.findById(variable);
      data.forEach((item) => {
        variableArr.push(item.name)
      })
    }
    if (id && id !== 0) {
      let data: any = {
        operator,
        variableArr: JSON.stringify(variableArr),
        variable: JSON.stringify(variable),
      };
      if (name) {
        data.name = name;
      }
      if (time) {
        data.time = time;
      }
      if (browser) {
        data.browser = browser;
      }
      if (url) {
        data.url = url;
      }
      console.log('data999999:',data)
      return TaskModel.update(data, id);
    } else {
      let groupingId = random();
      // 根据url创建任务
      let urlArr = url.split(',') || [];
      console.log('urlArr-----------:',urlArr);
      console.log('variableArr-----------:',variableArr);
      let dataArr:any = [];
      urlArr?.forEach((item) => {
        let data: any = {
          operator,
          url: item,
          taskId: random(), // 用来启用和关闭定时任务
          variableArr: JSON.stringify(variableArr),
          variable: JSON.stringify(variable),
          groupingId,
        };
        if (name) {
          data.name = name;
        }
        if (time) {
          data.time = time;
        }
        if (browser) {
          data.browser = browser;
        }
        dataArr.push(data);
      });
      return TaskModel.bulkCreate(dataArr);
    }
  } catch(error) {
    throw new Error(error.message)
  };
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

// 根据taskId获取详情
export async function GetTaskDetails(taskId) {
  const data = await TaskModel.findByTaskId(taskId);
  return data;
}

// 执行任务
export async function RunTask(id: number) {
  const model = await TaskModel.get(id);
  if (!model) return;
  if (model.checkState === 2) throw new Error('任务已经在执行中了');
  console.log('model::------------------:',model); //[1,3]
  // var信息
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
export async function ModifyTaskResult(name:string, imgList:string,  taskId: string, isError: boolean, errorInfo?: string, type?:string){
  const TaskData:any = await TaskModel.findByTaskId(taskId);
  let data: any = {
    isError,
    url: TaskData?.url || '',
    operator: TaskData?.operator || '',
    browser: TaskData?.browser || '',
    variableArr: TaskData?.variableArr || [],

  };
  if (name) {
      data.name = name;
  }
  if (imgList) {
      data.imgList = imgList;
  }
  if (taskId) {
      data.taskId = taskId;
  }
  if (errorInfo) {
    data.errorInfo = errorInfo;
  }
  if (type) {
    data.type = type;
  }
  return TaskResult.insert(data);
}

//任务详情列表
export async function GetTaskDetailsList(pageindex, taskId, browser) {
  if (pageindex) pageindex = pageindex * 1;
  const data = await TaskResult.getList(pageindex, taskId, browser);
  data.rows.forEach((item:any) => {
    item.imgList = item.imgList?.split(',') || [];
    item.variableArr = JSON.parse(item.variableArr);
  })
  return data;
}
//任务记录列表
export async function GetTaskRecordList(pageindex, name, checkTime, browser) {
  if (pageindex) pageindex = pageindex * 1;
  const data = await TaskResult.getAllList(pageindex, name, checkTime, browser);
  data.rows.forEach((item:any) => {
    item.imgList = item.imgList?.split(',') || [];
    item.variableArr = JSON.parse(item.variableArr);
  })
  return data;
}
//建表
export async function Create() {

  const data = await TaskModel.sync(true);
  return data;
}
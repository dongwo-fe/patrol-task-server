const schedule = require('node-schedule');

class TaskManager {
  tasks: {};
  constructor() {
    this.tasks = {};
  }

  addTask(id, cronExpression, taskFn) {
    const job = schedule.scheduleJob(cronExpression, taskFn);
    this.tasks[id] = job;
  }

  cancelTask(id) {
    const job = this.tasks[id];
    if (job) {
      job.cancel();
      delete this.tasks[id];
    }
  }
};

export default TaskManager;

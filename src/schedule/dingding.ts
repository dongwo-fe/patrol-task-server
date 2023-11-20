import { CronJob } from 'cron';
import { NoticeDDTalk } from '../service/notice';

// 每5分钟触发一次通知
new CronJob('0 * * * * *', () => {
    console.log('执行一次定时任务');
    NoticeDDTalk();
}).start();

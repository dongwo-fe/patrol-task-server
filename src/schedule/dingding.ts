import { CronJob } from 'cron';
import { NoticeDDTalk } from '../service/notice';

// 每5分钟触发一次通知
new CronJob('0 * * * * *', () => {
    NoticeDDTalk();
}).start();

import { CronJob } from 'cron';
import { NoticeDDTalk } from '../service/notice';
import { APINoticeOnce } from '../service/dingding';

// 每5分钟触发一次通知
new CronJob(`0 0 */${APINoticeOnce} * * *`, () => {
    NoticeDDTalk();
}).start();

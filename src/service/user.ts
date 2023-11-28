import axios from 'axios';
import ENV from '../env';
import LRU from 'lru-cache';

const LoginConfig = ENV.login;
//10秒的缓存
const Cache = new LRU({
    updateAgeOnGet: true,
    maxAge: 10000,
});

export async function CheckUserToken(token: string) {
    const res = await axios.get(LoginConfig.check, {
        headers: {
            token,
        },
    });
    Cache.set(token, res.data.data);
}

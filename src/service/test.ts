import { spawn, exec, execFile } from 'child_process';
import fs from 'fs';
import path from 'path';

const ROOT_PATH = process.cwd();
const TEMP_PATH = path.join(ROOT_PATH, './temp');

if (!fs.existsSync(TEMP_PATH)) fs.mkdirSync(TEMP_PATH);

// 执行js文件
export async function runNodejs() {
    console.log(ROOT_PATH);
    console.log(TEMP_PATH);
    // exec(
    //     `node test.js`,
    //     {
    //         encoding: 'utf-8',
    //         cwd: TEMP_PATH,
    //     },
    //     (err, stdout, stderr) => {
    //         if (err) {
    //             console.error(`exec error: ${err}`);
    //             return;
    //         }
    //         console.log(`stdout: ${stdout}`);
    //         console.error(`stderr: ${stderr}`);
    //     }
    // );
    const ps = spawn('node', ['test.js'], { cwd: TEMP_PATH });
    ps.stdout.on('data', (data) => {
        console.log('info:', data.toString());
    });
    ps.stderr.on('data', (data) => {
        console.log('err:', data.toString());
    });
    ps.on('close', (code) => {
        if (code !== 0) {
            console.log(`ps process exited with code ${code}`);
        }
        console.log('end');
    });
}

import express from 'express';
import { runNodejs } from '../service/test';

const router = express.Router();

router.get('/', function (req, res) {
    runNodejs();
    res.send('test');
});

export default router;

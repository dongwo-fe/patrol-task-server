import express from 'express';

const router = express.Router();

router.get('/', function (req, res) {
    res.send('test');
});

export default router;

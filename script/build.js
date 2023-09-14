const config = require('config');
const fs = require('fs');
const path = require('path');

const cfgs = config;

fs.writeFileSync(path.join(__dirname, '../src/env.ts'), 'export default ' + JSON.stringify(cfgs));

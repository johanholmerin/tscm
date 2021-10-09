const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '../fixtures/transform');
const fixtures = fs.readdirSync(DIR).map((file) => path.join(DIR, file));

module.exports = { fixtures };

const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const init = async () =>
    await open({
      filename: './database.db',
      driver: sqlite3.Database
    })

module.exports = init();
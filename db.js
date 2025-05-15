// db.js – thin wrapper around the open() connection
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path     = require('path');

module.exports = async function getDB() {
  return open({
    filename: path.join(__dirname, 'dreamweaver_db.sqlite'),
    driver  : sqlite3.Database
  });
};

//載入Sqlite3
const sqlite3 = require('sqlite3').verbose();

//將回呼(Callback)函數分離成獨立的函數
const callback = (msg) => {
  return (err) => {
    if (err) {
      console.error(err.message);
      return;
    }
    console.log(msg);
  }
};

//開啟資料庫並連線
let db = new sqlite3.Database('./sample.db',
  callback('Connected to the database.'));

let records = [
  { name: 'John', email: 'john@gmail.com' },
  { name: 'Mary', email: 'mary@gmail.com' },
  { name: 'Tom', email: 'tom@gmail.com' },
]

db.serialize(() => {
  //建立資料表
  db.run('CREATE TABLE IF NOT EXISTS users (name text, email text)',
    callback('Table is created.'));

  //插入多筆資料
  let sql = `INSERT INTO users (name, email) VALUES ` + records.map(r => '(?, ?)').join(', ');
  let data = records.flatMap(r => Object.values(r));

  db.run(sql, data,
    callback(`${records.length} records are inserted.`));

});

//查詢資料
db.all('SELECT * FROM users', (err, rows) => {
  if (err) {
    throw err;
  }
  console.log('\n\n============');
  rows.forEach((row) => {
    console.log(row.name, row.email);
  });
  console.log('============\n\n');
});

//更新資料
db.run('UPDATE users SET email = ? WHERE name = ?',
  ['john@outlook.com', 'John'],
  callback('Updated!!'));

//查詢資料
db.all('SELECT * FROM users', (err, rows) => {
  if (err) {
    throw err;
  }
  console.log('\n\n============');
  rows.forEach((row) => {
    console.log(row.name, row.email);
  });
  console.log('============\n\n');
});

//刪除資料表
db.run('DROP TABLE IF EXISTS users',
  callback('Table is dropped.'));

//關閉資料庫
db.close(callback('Close the database connection.'));
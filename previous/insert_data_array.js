//載入Sqlite3
const sqlite3 = require('sqlite3').verbose();


//開啟資料庫並連線
let db = new sqlite3.Database('./sample.db',
  (err) => {
    if (err) {
      console.error(err.message);
      return;
    }
    console.log('Connected to the database.');
  });

let records = [
  { name: 'John', email: 'john@gmail.com' },
  { name: 'Mary', email: 'mary@gmail.com' },
  { name: 'Tom', email: 'tom@gmail.com' },
]

db.serialize(() => {
  //建立資料表
  db.run('CREATE TABLE IF NOT EXISTS users (name text, email text)',
    (err) => {
      if (err) {
        console.error(err.message);
        return;
      }
      console.log('Table is created.');
    });

  //插入多筆資料
  let sql = `INSERT INTO users (name, email) VALUES ` + records.map(r => '(?, ?)').join(', ');
  let data = records.flatMap(r => Object.values(r));

  db.run(sql,
    data,
    (err) => {
      if (err) {
        console.error(err.message);
        return;
      }
      console.log('2 records are inserted.');
    });
});




//關閉資料庫
db.close((err) => {
  if (err) {
    console.error(err.message);
    return;
  }
  console.log('Close the database connection.');
});
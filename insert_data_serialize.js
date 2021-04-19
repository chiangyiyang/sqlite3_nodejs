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

  //插入2筆資料
  db.run('INSERT INTO users ( name , email ) VALUES ( ?, ? ), ( ?, ? )',
    [
      'John', 'john@gmail.com',
      'Mary', 'mary@gmail.com',
    ],
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
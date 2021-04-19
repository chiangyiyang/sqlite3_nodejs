//載入Sqlite3
const sqlite3 = require('sqlite3').verbose();


//開啟資料庫並連線
let db = new sqlite3.Database('./my_database.db',
  (err) => {
    if (err) {
      console.error(err.message);
      return;
    }
    console.log('Connected to the database.');
  });


//建立資料表
db.run('CREATE TABLE IF NOT EXISTS my_table (field1 text, field2 text)',
  (err) => {
    if (err) {
      console.error(err.message);
      return;
    }
    console.log('Table is created.');
  });


//關閉資料庫
db.close((err) => {
  if (err) {
    console.error(err.message);
    return;
  }
  console.log('Close the database connection.');
});
//載入Sqlite3
const sqlite3 = require('sqlite3').verbose();


//開啟資料庫並連線
let db = new sqlite3.Database('./my_database.db',
  (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the database.');
  });

//關閉資料庫
db.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Close the database connection.');
});
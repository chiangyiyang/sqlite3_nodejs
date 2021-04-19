## 1. 建立NodeJS專案

```
mkdir my_app
cd my_app

npm init
...
```

## 2. 安裝Sqlite3，並且記錄到package.json的dependencies中

```
npm install sqlite3 --save
```


## 3. 開啟在**記憶體中**的資料庫
```js
//載入Sqlite3
const sqlite3 = require('sqlite3').verbose();

//開啟資料庫並連線
let db = new sqlite3.Database(':memory:');

//關閉資料庫
db.close();
```
## 4. 開啟在**檔案中**的資料庫
```js
//載入Sqlite3
const sqlite3 = require('sqlite3').verbose();

//開啟資料庫並連線
let db = new sqlite3.Database('./my_database.db');

//關閉資料庫
db.close();
```

## 5. 開啟在**記憶體中**的資料庫，並且提供Callback函數
```js
//載入Sqlite3
const sqlite3 = require('sqlite3').verbose();

//開啟資料庫並連線
let db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');
});

//關閉資料庫
db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Close the database connection.');
});
```

## 6. 開啟在**檔案中**的資料庫，並且提供Callback函數
```js
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
```

## 7. 建立資料表
```js
//載入Sqlite3
...
//開啟資料庫並連線
...


//建立資料表
db.run('CREATE TABLE my_table(field1 text, field2 text)',
  (err) => {
    if (err) {
      console.error(err.message);
      return;
    }
    console.log('Table is created.');
  });


//關閉資料庫
...
```

## 8. 如果資料表不存在時，就建立資料表
```js
//開啟資料庫並連線
...


//建立資料表
db.run('CREATE TABLE IF NOT EXIST my_table(field1 text, field2 text)',
  (err) => {
    if (err) {
      console.error(err.message);
      return;
    }
    console.log('Table is created.');
  });


//關閉資料庫
...
```

## 9. 如果資料表存在時，就刪除資料表
```js
//開啟資料庫並連線
...

//刪除資料表
db.run('DROP TABLE IF EXISTS my_table',
  (err) => {
    if (err) {
      console.error(err.message);
      return;
    }
    console.log('Table is dropped.');
  });

//關閉資料庫
...
```

## 10. 插入資料
```js
...

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

//關閉資料庫
...
```
### 第一次執行結果
```bash
Connected to the database.
SQLITE_ERROR: no such table: users
Table is created.
Close the database connection.
```

### 第一次之後的執行結果
```bash
Connected to the database.
Table is created.
2 records are inserted.
Close the database connection.
```
#### <span style="color:lightgreen">因為Sqlite平行(Parallelize)執行SQL命令，第一次執行時，CREATE TABLE尚未完成，就執行INSERT INTO，造成找不到TABLE的情況</span>

## 11. 以序列(Serialize)方式建立資料表並插入資料
```js
...

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
...
```
### 第一次執行就沒有問題了
```bash
Connected to the database.
Table is created.
2 records are inserted.
Close the database connection.
```
## 12. 插入多筆資料
```js
...

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
...
```

## 13. 將Callback函數抽離
```js
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
  callback('Connected to the database.'));  //使用新的回乎函數

let records = [
  { name: 'John', email: 'john@gmail.com' },
  { name: 'Mary', email: 'mary@gmail.com' },
  { name: 'Tom', email: 'tom@gmail.com' },
]

db.serialize(() => {
  //建立資料表
  db.run('CREATE TABLE IF NOT EXISTS users (name text, email text)',
    callback('Table is created.')); //使用新的回乎函數

  //插入多筆資料
  let sql = `INSERT INTO users (name, email) VALUES ` + records.map(r => '(?, ?)').join(', ');
  let data = records.flatMap(r => Object.values(r));

  db.run(sql, data,
    callback(`${records.length} records are inserted.`)); //使用新的回乎函數

});

//關閉資料庫
db.close(callback('Close the database connection.')); //使用新的回乎函數
```


## 14. 查詢資料
```js
...

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
...
```

## 15. 以各比資料方式查詢
```js
...

//查詢資料
db.each('SELECT * FROM users', (err, row) => {
  if (err) {
    throw err;
  }
  console.log(row.name, row.email);
});

//刪除資料表
...
```


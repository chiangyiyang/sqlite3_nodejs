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
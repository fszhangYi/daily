// db
const sqlite3 = require('sqlite3');
const dbName = 'test.db';

const getDate = () => {
    // 创建一个日期对象
    const date = new Date();
    // 配置时区
    const options = { timeZone: 'Asia/Shanghai' };
    // 使用配置的时区将时间戳转化成时间字符串
    const formattedDate = date.toLocaleString('zh-CN', options);
    // 解析得到当前时间
    const today = formattedDate.split(" ")[0].replace(/\//g, '_');
    return today;
}

const getName = () => `tab_${getDate()}`;

const defaultCallback = function (err) {
    if (err) {
        console.error('执行失败：', err);
    } else {
        console.log('执行成功', this.lastID);
    }
};

const isExist = (db, name, sucb, facb) => {
    // 检查表是否存在
    db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name='${name}'`, (err, row) => {
        if (!err && row) {
            console.log('表存在');
            sucb(db);
        } else {
            console.log('表不存在');
            facb(db);
        }
    });
}

const newTask = (db, name, cb = defaultCallback) => {
    const newTab = `CREATE TABLE ${name} (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, name TEXT, content TEXT, jump INTEGER)`;
    db.run(newTab, cb);
};

const insertTask = (db, name, data, cb = defaultCallback) => {
    const insert = `INSERT INTO ${name} (date, name, content, jump) VALUES (?, ?, ?, ?)`;
    db.run(insert, data, cb);
}


const updateDb = (db, person, content) => {
    const name = getName();
    const data = [getDate(), person, content, 0];
    insertTask(db, name, data, () => {
        db.close();
    });
}

const createDb = (db, person, content) => {
    const name = getName();
    const data = [getDate(), person, content, 0];
    newTask(db, name, () => {
        insertTask(db, name, data, () => {
            db.close();
        });
    })
}

const readDataFromTab = (tabName, sucb=()=>{}, facb=()=>{} ) => {
    const db = new sqlite3.Database(dbName);
  
    const query = `SELECT * FROM ${tabName}`;
    db.all(query, [], (err, rows) => {
      if (err) {
        console.error('读取数据失败:', err);
        facb(err);
        return;
      }
  
      const data = rows.map(row => {
        return {...row};
      });
  
      db.close();
  
      sucb(data);
    });
  }

// server
const http = require('http');

const server = http.createServer((req, res) => {
    console.log('req.url: ', req.url);
    console.log('req.method: ', req.method);
    if (req.url === '/re_api') {
        if (req.method === 'OPTIONS') {
            // 处理预检请求
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
            res.setHeader('Access-Control-Max-Age', '86400');
            res.end();
            return;
        }
        else if (req.method === 'POST') {
            let body = '';

            req.on('data', chunk => {
                body += chunk;
            });

            req.on('end', () => {
                console.log('请求体:', body);
                const { content, person } = JSON.parse(body);
                const db = new sqlite3.Database(dbName);
                isExist(db, getName(), () => {
                    updateDb(db, person, content);
                }, () => {
                    createDb(db, person, content);
                });

                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Content-Type', 'text/plain; charset=utf-8'); // 添加字符编码
                res.end('提交成功');
            });
            return;
        }
    }

    if (req.url === '/re_api/get_all') {
        console.log('ppp')
        readDataFromTab(getName(), (data) => {
            console.log(data);
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Content-Type', 'text/plain; charset=utf-8'); // 添加字符编码
            res.end(JSON.stringify(data));
        });
        return;
    }

    // 没有匹配的路径，返回 404
    res.statusCode = 404;
    res.end();
});

server.listen(9000, () => {
    console.log('后端服务已启动，监听端口 9000');
});

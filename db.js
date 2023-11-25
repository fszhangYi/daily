// db
const sqlite3 = require('sqlite3');

const getDate = () => {
    // 创建一个日期对象
    const date = new Date();
    // 配置时区
    const options = { timeZone: 'Asia/Shanghai' };
    // 使用配置的时区将时间戳转化成时间字符串
    const formattedDate = date.toLocaleString('zh-CN', options);
    // 解析得到当前时间
    const today = formattedDate.split(" ")[0].replace(/\//g,'_');
    return today;
  }

  const getName = () => `tab_${getDate()}`;

const db = new sqlite3.Database('main.db');

const defaultCallback = function(err) {
    if (err) {
      console.error('执行失败：', err);
    } else {
      console.log('执行成功', this.lastID);
    }
  };

  const isExist = (name, sucb, facb) => {
    // 检查表是否存在
    db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name='${name}'`, (err, row) => {
        if(!err && row) {
            console.log('表存在');
            sucb();
        } else {
            console.log('表不存在');
            facb();
        }
    });
}

const newTask = (name, cb = defaultCallback) => {
    const newTab = `CREATE TABLE ${name} (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, name TEXT, content TEXT, jump INTEGER)`;
    db.run(newTab, cb);
};

const insertTask = (name, data, cb = defaultCallback) => {
    const insert = `INSERT INTO ${name} (date, name, content, jump) VALUES (?, ?, ?, ?)`;
    db.run(insert, data, cb);
}


const createDb = (person, content) => {
    const name = getName();
    const data = [getDate(), person, content, 0];
    insertTask(name, data, () => {
        db.close();
    });
}

const updateDb = (person, content) => {
    const name = getName();
    const data = [getDate(), person, content, 0];
    newTask(name, ()=>{
        insertTask(name, data, () => {
            db.close();
        });
    })
}

const person = 'Sam';
const content = 'go to school';

isExist(getName(), () => {
    updateDb(person, content);
}, () => {
    createDb(person, content);
});

const axios = require('axios');
const dotenv = require('dotenv');


dotenv.config();
const _hour = process.env.HOUR;
// 在这之后，你可以通过process.env访问.env文件中定义的所有环境变量
console.log(process.env.WEB_HOOK); // 输出：http://example.com/api
console.log(process.env.HTML_URL); // 输出：http://example.com/api

let dailyLaunch = false;
// 在整点发送请求的函数
function sendRequestOnTheHour() {
    const url = process.env.WEB_HOOK;
    const data = {
        "msgtype": "news",
        "news": {
            "articles": [
                {
                    "title": "机器人Daily提示您发日报了~~",
                    "description": "及时发送您的工作日报，提高沟通效率，促进团队协作，跟踪工作进度，解决问题，发现改进方向。记录总结您的工作，启发思考，共建高效团队",
                    "url": process.env.HTML_URL,
                    "picurl": "https://file03.16sucai.com/2017/1100/16sucai_p580e100_18f.JPG"
                }
            ]
        }
    };

    axios.post(url, data, {
        headers: { 'Content-Type': 'application/json' },
    })
        .then(response => {
            console.log('请求已发送');
            dailyLaunch = true;
        })
        .catch(error => {
            console.error('发送请求时出错:', error);
        });
}

setInterval(
    () => {
        const date = new Date();
        const options = { timeZone: 'Asia/Shanghai' };
        const formattedDate = date.toLocaleString('zh-CN', options);
        const [hour, min, sec] = formattedDate.split(" ")[1].split(":");
        console.log(`现在是：${hour}:${min}:${sec}`);
        if (hour === _hour && !dailyLaunch) {
            sendRequestOnTheHour();
        } else if (hour !== _hour) {
            dailyLaunch = false;
        }
    }, 1 * 60 * 1000
)

// // // npx pm2 start daily.js --name daily --log daily-log.log
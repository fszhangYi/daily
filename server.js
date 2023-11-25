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
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Content-Type', 'text/plain; charset=utf-8'); // 添加字符编码
                res.end('提交成功');
            });
            return;
        }
    }

    // 没有匹配的路径，返回 404
    res.statusCode = 404;
    res.end();
});

server.listen(9000, () => {
    console.log('后端服务已启动，监听端口 9000');
});

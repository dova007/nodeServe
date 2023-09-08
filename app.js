const fs = require('fs');
const path = require('path');
const express = require('express');
const compression = require('compression');
const history = require('connect-history-api-fallback');
const bodyParser = require('body-parser');
const router = require('./router/router');
const net = require('net'); // 引入Node.js内置的net模块


const basePort = 8090; // 起始端口号
const distFolders = getDistFolders('./web/'); // 获取指定文件夹下的dist子文件夹列表
// 递归函数，用于查找可用端口
function findAvailablePort(port, callback) {
  const server = net.createServer();
  server.listen(port, () => {
    server.once('close', () => {
      callback(port);
    });
    server.close();
  });
  server.on('error', () => {
    // 端口被占用，继续查找下一个端口
    findAvailablePort(port + 1, callback);
  });
}
const historyMiddleware = history(); // 创建单独的 history 中间件实例
distFolders.forEach((folder, index) => {
  const staticPath = path.join(__dirname, 'web', folder); // 文件夹路径
  const app = express();
  app.use(compression());
  app.use(historyMiddleware)
  app.use(bodyParser.urlencoded({ extended: false }));


  app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    // res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials","true");
    res.header("X-Powered-By",' 3.2.1')
    if (req.method === 'OPTIONS') res.send(200);
    else next();
  });
  findAvailablePort(basePort + index, (port) => {
    app.use(express.static(staticPath));
    app.use(`/${folder}`, router);

    app.listen(port, () => {
      console.log(`服务器运行在${port}端口，静态资源目录：${staticPath}`);
    });
  });
});

// 获取指定文件夹下的dist子文件夹列表
function getDistFolders(parentFolder) {
  const files = fs.readdirSync(parentFolder);
  return files.filter(file => {
    const fullPath = path.join(parentFolder, file);
    return fs.statSync(fullPath).isDirectory() && fs.existsSync(path.join(fullPath, 'index.html'));
  });
}
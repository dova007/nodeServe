var express = require('express');
const db = require('../db/mysql.config');
//1.创建一个路由容器
var router = express.Router();
//2. 把路由都挂载到router路由容器中
router.get('/test', (req, res) => {
  console.log("🚀 ~ router.get ~ req", req.query)
  res.send('ok')
})

router.get('/user', async (req, res) => {
  let sql = 'select * from test2'
  try {
    const results = await db(sql)
    console.log(results, "打印test2数据");
    const data = {
      code: 200,
      params: [],
      total: results.length,
      data: results,
      message: "操作成功",
      ext: "",
    };
    res.send(data);
  } catch(err) {
    res.send(err)
  }
})
//3. 导出router
module.exports = router
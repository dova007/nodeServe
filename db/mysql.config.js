const mysql = require('mysql')
const pool = mysql.createPool({
  connectionLimit: 20,//连接限制数
  host: '192.168.8.145',
  // host: 'localhost',
  port: 3306,
  user: 'root',
  password: '12345678',
  database: 'test'
})

const db = function(sql) {
  return new Promise(function(resolve, reject) {
    pool.getConnection(function(err, connection) {
      if(err) {
        console.info(err.message)
        reject(err)
      }
      connection.query(sql, function(err, result) {
        connection.release()//释放连接
        if(err) {
          console.info(err.message)
          reject(err)
        }
        console.log("数据库promise对象生成成功");
        resolve(result)
      })
    })
  })
}

module.exports = db
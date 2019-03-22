var express = require('express');
var md5 = require('md5');
var router = express.Router();

var pool = require('../modules/db-mysql').options.pool;
var pipe = require('../modules/pipe');

router.post('/login', function (req, res) {
  // 登录标识，0是账号登录，1邮箱登录，2手机登录
  var loginFlag = req.body.loginFlag - 0;
  if ([0, 1, 2].findIndex(flag => flag == loginFlag) == -1) {
    res.send({code: 201, message: '登录标识非法！'});
    return;
  }

  var password = req.body.password;
  if (!password) {
    res.send({code: 202, message: '密码不能为空！'});
    return;
  }
  password = md5(password);

  // 根据不同的登录方式，设置不同的查询条件。
  var account = '';
  var sql = '';
  var msg = '';
  switch (loginFlag) {
    case 0:
      account = req.body.loginName;
      sql = `select * from users where loginName='${account}' and password='${password}'`;
      msg = '账号'
      break;
    case 1:
      account = req.body.email;
      sql = `select * from users where email='${account}' and password='${password}'`;
      msg = '邮箱';
      break;
    default:
      account = req.body.phone;
      sql = `select * from users where phone='${account}' and password='${password}'`;
      msg = '手机';
      break;
  }

  pool
    .query(sql, function (err, results) {
      if (err) {
        res.send({code: 203, message: err.message});
        return;
      }

      if (!results || results.length == 0) {
        res.send({code: 204, message: `${msg}或密码有误！`});
        return;
      }

      if (results.length > 1) {
        res.send({code: 205, message: `查询到多个用户！`});
        return;
      }

      var user = results[0];
      delete user.password;

      if (user.status == 1) {
        res.send({code: 206, message: `用户被禁用！`});
        return;
      }

      res.cookie("loginInfo", user, {
        maxAge: 3 * 60 * 60 * 1000
      });
      req.session.loginInfo = user;
      req
        .session
        .save();

      res.send({code: 200, message: '登录成功！', user});
    })
});

router.post('/logout', function (req, res) {
  res.clearCookie("loginInfo");
  req
    .session
    .destroy();
  res.send({code: 200, message: '注销成功！'});
})

router.post('/post', pipe.checkLogin, function (req, res) {
  var loginName = req.body.loginName;
  var email = req.body.email;
  var phone = req.body.phone;
  var password = req.body.password;
  var userName = req.body.userName;
  var companyId = req.body.companyId;
  if (!loginName || !email || !phone || !password || !userName || !companyId) {
    res.send({code: 201, message: '参数错误！'});
    return;
  }

  var status = 0;
  var createUser = req.session.loginInfo.userId;

  var sqlInsert = `INSERT INTO users(loginName, email, phone, password, userName, companyId, status, createTime, createUser) VALUES ('${loginName}', '${email}', '${phone}', '${md5(password)}', '${userName}', '${companyId}', ${status}, now(), '${createUser}')`;

  var sql = `select count(1) count from users where loginName='${loginName}' or email='${email}' or phone='${phone}'`;
  pool.query(sql, function (err, results) {
    if (err) {
      res.send({code: 202, message: err.message});
      return;
    }
    if (results[0] && results[0].count > 0) {
      res.send({code: 203, message: '用户名，手机，邮箱都不能和其他用户重复！'});
      return;
    }
    pool
      .query(sqlInsert, function (err, results2) {
        if (err) {
          res.send({code: 202, message: err.message});
          return;
        }
        res.send({code: 200, message: '添加成功！'});
      });
  })
})

router.get('/get', pipe.checkLogin, function (req, res) {
  var userId = req.query.userId
  var loginName = req.query.loginName;
  var email = req.query.email;
  var phone = req.query.phone;
  var userName = req.query.userName;
  var companyId = req.query.companyId;
  var status = req.query.status;

  var createTimeStart = req.query.createTimeStart;
  var createTimeEnd = req.query.createTimeEnd;
  var createUser = req.query.createUser;
  var updateTimeStart = req.query.updateTimeStart;
  var updateTimeEnd = req.query.updateTimeEnd;
  var updateUser = req.query.updateUser;

  var page = req.query.page - 0 || 1;
  var pageSize = req.query.pageSize - 0 || 10;

  var sql = `SELECT users.userId, users.loginName, users.email, users.phone, users.password, users.userName, users.companyId, companies.companyName, users.status, users.createTime, users.createUser, users2.userName as createUserName, users.updateTime, users.updateUser,users3.userName as updateUserName FROM users LEFT JOIN companies ON users.companyId = companies.companyId LEFT JOIN users as users2 ON users.createUser=users2.userId LEFT JOIN users as users3 ON users.updateUser=users3.userId where (1=1)`;
  if (userId) {
    sql += ` and users.userId='${userId}'`;
  }
  if (loginName) {
    sql += ` and users.loginName like '%${loginName}%'`;
  }
  if (email) {
    sql += ` and users.email like '%${email}%'`;
  }
  if (phone) {
    sql += ` and users.phone like '%${phone}%'`;
  }
  if (userName) {
    sql += ` and users.userName like '%${userName}%'`;
  }
  if (companyId) {
    sql += ` and users.companyId=${companyId}`;
  }
  if (status > -1) {
    sql += ` and users.status=${status}`;
  }
  if (createTimeStart) {
    sql += ` and users.createTime>='${createTimeStart}'`;
  }
  if (createTimeEnd) {
    sql += ` and users.createTime<='${createTimeEnd}'`;
  }
  if (createUser) {
    sql += ` and users.createUser=${createUser}`;
  }
  if (updateTimeStart) {
    sql += ` and users.updateTime>='${updateTimeStart}'`;
  }
  if (updateTimeEnd) {
    sql += ` and users.updateTime<='${updateTimeEnd}'`;
  }
  if (updateUser) {
    sql += ` and users.updateUser=${updateUser}`;
  }
  sql += ` order by users.createTime desc limit ${ (page - 1) * pageSize}, ${pageSize};`;
  var sql2 = `SELECT count(1) as total from users`;

  pool.query(sql, function (err, results) {
    if (err) {
      res.send({code: 201, message: err.message});
      return;
    }
    pool
      .query(sql2, function (err, results2) {
        if (err) {
          res.send({code: 201, message: err.message});
          return;
        }
        res.send({code: 200, message: '查询成功！', users: results, total: results2[0].total});
      })
  })
})

router.get('/getAll', pipe.checkLogin, function (req, res) {
  var sql = `SELECT userId, userName FROM users`;
  pool.query(sql, function (err, results) {
    if (err) {
      res.send({code: 201, message: err.message});
      return;
    }
    res.send({code: 200, message: '查询成功！', users: results});
  })
})

router.put('/put', pipe.checkLogin, function (req, res) {
  var userId = req.body.userId;
  var loginName = req.body.loginName;
  var email = req.body.email;
  var phone = req.body.phone;
  var userName = req.body.userName;
  var companyId = req.body.companyId;

  if (!userId || !loginName || !email || !phone || !userName || !companyId) {
    res.send({code: 201, message: '参数错误！'});
    return;
  }

  var user = req.session.loginInfo.userId;
  var sqlUpdate = `update users set loginName='${loginName}',email='${email}',phone='${phone}',userName='${userName}',companyId='${companyId}',updateTime=now(),updateUser='${user}' where userId='${userId}';`;

  var sql = `select count(1) count from users where userId!='${userId}' and (loginName='${loginName}' or email='${email}' or phone='${phone}')`;
  pool.query(sql, function (err, results) {
    if (err) {
      res.send({code: 202, message: err.message});
      return;
    }
    if (results[0] && results[0].count > 0) {
      res.send({code: 203, message: '用户名，手机，邮箱都不能和其他用户重复！'});
      return;
    }

    pool
      .query(sqlUpdate, function (err, results) {
        if (err) {
          res.send({code: 204, message: err.message});
          return;
        }
        res.send({code: 200, message: '修改成功！'});
      })
  });

})

router.put('/setStatus', pipe.checkLogin, function (req, res) {
  var userId = req.body.userId;
  var status = req.body.status;

  if (!userId || [0, 1].findIndex(s => s == status) == -1) {
    res.send({code: 201, message: '参数错误！'});
    return;
  }

  var sql = `update users set status='${status}' where userId='${userId}';`;

  pool.query(sql, function (err, results) {
    if (err) {
      res.send({code: 202, message: err.message});
      return;
    }
    res.send({code: 200, message: '修改成功！'});
  })
})

router.put('/resetPassword', pipe.checkLogin, function (req, res) {
  var userId = req.body.userId;
  var userName = req.body.userName;
  var oldPassword = req.body.oldPassword;
  var newPassword = req.body.newPassword;

  if (!userId || !userName || !oldPassword || !newPassword) {
    res.send({code: 201, message: '参数错误！'});
    return;
  }

  var user = req.session.loginInfo.userId;
  var sqlUpdate = `update users set password='${md5(newPassword)}',updateTime=now(),updateUser='${user}' where userId='${userId}';`;

  var sql = `select count(1) count from users where userId='${userId}' and password='${md5(oldPassword)}';`;
  pool.query(sql, function (err, results) {
    if (err) {
      res.send({code: 202, message: err.message});
      return;
    }
    if (results[0] && results[0].count == 0) {
      res.send({code: 203, message: '旧密码输入有误！'});
      return;
    }

    pool
      .query(sqlUpdate, function (err, results) {
        if (err) {
          res.send({code: 204, message: err.message});
          return;
        }
        res.send({code: 200, message: '修改成功！'});
      })
  });

})

router.delete('/delete', pipe.checkLogin, function (req, res) {
  var userIds = req.body.userIds;
  if (!userIds) {
    res.send({code: 201, message: '参数错误！'});
    return;
  }
  var sql = `delete from users where userId in (${userIds})`;
  pool.query(sql, function (err, results) {
    if (err) {
      res.send({code: 201, message: err.message});
      return;
    }
    res.send({code: 200, message: '删除成功！'});
  })
})

module.exports = router;

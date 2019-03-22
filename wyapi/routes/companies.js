var express = require('express');
var router = express.Router();

var pool = require('../modules/db-mysql').options.pool;
var pipe = require('../modules/pipe');

router.get('/get', pipe.checkLogin, function (req, res) {
  var companyName = req.query.companyName;
  var contact = req.query.contact;
  var address = req.query.address;
  var email = req.query.email;
  var legalPerson = req.query.legalPerson;
  var principal = req.query.principal;
  var status = req.query.status;

  var createTimeStart = req.query.createTimeStart;
  var createTimeEnd = req.query.createTimeEnd;
  var createUser = req.query.createUser;
  var updateTimeStart = req.query.updateTimeStart;
  var updateTimeEnd = req.query.updateTimeEnd;
  var updateUser = req.query.updateUser;

  var page = req.query.page - 0 || 1;
  var pageSize = req.query.pageSize - 0 || 10;

  var sql = `SELECT companies.companyId,  companies.companyName, companies.contact,  companies.address,  companies.email,  companies.legalPerson,  companies.principal,  companies.status, companies.createTime,  companies.createUser, users.userName as createUserName,  companies.updateTime,  companies.updateUser, users2.userName as updateUserName from companies LEFT JOIN users ON companies.createUser = users.userId LEFT JOIN users as users2 ON companies.updateUser = users2.userId where (1=1)`;
  if (companyName) {
    sql += ` and companies.companyName like '%${companyName}%'`;
  }
  if (contact) {
    sql += ` and companies.contact like '%${contact}%'`;
  }
  if (address) {
    sql += ` and companies.address like '%${address}%'`;
  }
  if (email) {
    sql += ` and companies.email like '%${email}%'`;
  }
  if (legalPerson) {
    sql += ` and companies.legalPerson like '%${legalPerson}%'`;
  }
  if (principal) {
    sql += ` and companies.principal like '%${principal}%'`;
  }
  if (status > -1) {
    sql += ` and companies.status=${status}`;
  }
  if (createTimeStart) {
    sql += ` and companies.createTime>='${createTimeStart}'`;
  }
  if (createTimeEnd) {
    sql += ` and companies.createTime<='${createTimeEnd}'`;
  }
  if (createUser) {
    sql += ` and companies.createUser=${createUser}`;
  }
  if (updateTimeStart) {
    sql += ` and companies.updateTime>='${updateTimeStart}'`;
  }
  if (updateTimeEnd) {
    sql += ` and companies.updateTime<='${updateTimeEnd}'`;
  }
  if (updateUser) {
    sql += ` and companies.updateUser=${updateUser}`;
  }
  sql += ` order by companies.createTime desc limit ${ (page - 1) * pageSize}, ${pageSize};`;
  var sql2 = `SELECT count(1) as total from companies`;

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
        res.send({code: 200, message: '查询成功！', companies: results, total: results2[0].total});
      })
  })
});

router.post('/post', pipe.checkLogin, function (req, res) {
  var companyName = req.body.companyName;
  var contact = req.body.contact;
  var address = req.body.address;
  var email = req.body.email;
  var legalPerson = req.body.legalPerson;
  var principal = req.body.principal;
  if (!companyName || !contact || !address || !email || !legalPerson || !principal) {
    res.send({code: 201, message: '参数错误！'});
    return;
  }

  var status = 0;
  var createUser = req.session.loginInfo.userId;

  var sqlInsert = `INSERT INTO companies(companyName, contact, address, email, legalPerson, principal, status, createTime, createUser) VALUES ('${companyName}', '${contact}', '${address}', '${email}', '${legalPerson}', '${principal}', ${status}, now(), '${createUser}')`;

  var sql = `select count(1) count from companies where companyName='${companyName}'`;
  pool.query(sql, function (err, results) {
    if (err) {
      res.send({code: 202, message: err.message});
      return;
    }
    if (results[0] && results[0].count > 0) {
      res.send({code: 203, message: '公司名称不能重复！'});
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

router.put('/put', pipe.checkLogin, function (req, res) {
  var companyId = req.body.companyId;
  var companyName = req.body.companyName;
  var contact = req.body.contact;
  var address = req.body.address;
  var email = req.body.email;
  var legalPerson = req.body.legalPerson;
  var principal = req.body.principal;

  if (!companyId || !companyName || !contact || !address || !email || !legalPerson || !principal) {
    res.send({code: 201, message: '参数错误！'});
    return;
  }

  var user = req.session.loginInfo.userId;
  var sqlUpdate = `update companies set companyName='${companyName}',contact='${contact}',address='${address}',email='${email}',legalPerson='${legalPerson}',principal='${principal}',updateTime=now(),updateUser='${user}' where companyId='${companyId}';`;

  var sql = `select count(1) count from companies where companyId!='${companyId}' and companyName='${companyName}'`;
  pool.query(sql, function (err, results) {
    if (err) {
      res.send({code: 202, message: err.message});
      return;
    }
    if (results[0] && results[0].count > 0) {
      res.send({code: 203, message: '公司名称不能重复！'});
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
  var companyId = req.body.companyId;
  var status = req.body.status;

  if (!companyId || [0, 1].findIndex(s => s == status) == -1) {
    res.send({code: 201, message: '参数错误！'});
    return;
  }

  var sql = `update companies set status='${status}' where companyId='${companyId}';`;

  pool.query(sql, function (err, results) {
    if (err) {
      res.send({code: 202, message: err.message});
      return;
    }
    res.send({code: 200, message: '修改成功！'});
  })
})

router.delete('/delete', pipe.checkLogin, function (req, res) {
  var companyIds = req.body.companyIds;
  if (!companyIds) {
    res.send({code: 201, message: '参数错误！'});
    return;
  }
  var sql = `delete from companies where companyId in (${companyIds})`;
  pool.query(sql, function (err, results) {
    if (err) {
      res.send({code: 201, message: err.message});
      return;
    }
    res.send({code: 200, message: '删除成功！'});
  })
})

module.exports = router;

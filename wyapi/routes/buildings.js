var express = require('express');
var router = express.Router();

var pool = require('../modules/db-mysql').options.pool;
var pipe = require('../modules/pipe');

router.get('/get', pipe.checkLogin, function (req, res) {
  var buildingId = req.query.buildingId;
  var buildingName = req.query.buildingName;
  var zoneId = req.query.zoneId;
  var layerCount = req.query.layerCount;
  var height = req.query.height;
  var area = req.query.area;
  var buildTimeStart = req.query.buildTimeStart;
  var buildTimeEnd = req.query.buildTimeEnd;
  var type = req.query.type;
  var direction = req.query.direction;
  var status = req.query.status;

  var createTimeStart = req.query.createTimeStart;
  var createTimeEnd = req.query.createTimeEnd;
  var createUser = req.query.createUser;
  var updateTimeStart = req.query.updateTimeStart;
  var updateTimeEnd = req.query.updateTimeEnd;
  var updateUser = req.query.updateUser;

  var page = req.query.page - 0 || 1;
  var pageSize = req.query.pageSize - 0 || 10;

  var sql = `SELECT buildings.buildingId,  buildings.buildingName,  buildings.zoneId, zones.zoneName, buildings.layerCount,  buildings.height,  buildings.area,  buildings.buildTime,  buildings.type,  buildings.direction,  buildings.status, buildings.createTime,  buildings.createUser, users.userName as createUserName,  buildings.updateTime,  buildings.updateUser, users2.userName as updateUserName from buildings LEFT JOIN zones ON buildings.zoneId = zones.zoneId LEFT JOIN users ON buildings.createUser = users.userId LEFT JOIN users as users2 ON buildings.updateUser = users2.userId where (1=1)`;
  if (buildingId) {
    sql += ` and buildings.buildingId = '${buildingId}'`;
  }
  if (buildingName) {
    sql += ` and buildings.buildingName like '%${buildingName}%'`;
  }
  if (zoneId) {
    sql += ` and buildings.zoneId = '%${zoneId}%'`;
  }
  if (layerCount) {
    sql += ` and buildings.layerCount = '%${layerCount}%'`;
  }
  if (height) {
    sql += ` and buildings.height = '%${height}%'`;
  }
  if (area) {
    sql += ` and buildings.area = '%${area}%'`;
  }
  if (buildTimeStart) {
    sql += ` and buildings.buildTime>='${buildTimeStart}'`;
  }
  if (buildTimeEnd) {
    sql += ` and buildings.buildTime<='${buildTimeEnd}'`;
  }
  if (type && type != "全部") {
    sql += ` and buildings.type='${type}'`;
  }
  if (direction && direction != "全部") {
    sql += ` and buildings.direction='${direction}'`;
  }
  if (status > -1) {
    sql += ` and buildings.status=${status}`;
  }
  if (createTimeStart) {
    sql += ` and buildings.createTime>='${createTimeStart}'`;
  }
  if (createTimeEnd) {
    sql += ` and buildings.createTime<='${createTimeEnd}'`;
  }
  if (createUser) {
    sql += ` and buildings.createUser=${createUser}`;
  }
  if (updateTimeStart) {
    sql += ` and buildings.updateTime>='${updateTimeStart}'`;
  }
  if (updateTimeEnd) {
    sql += ` and buildings.updateTime<='${updateTimeEnd}'`;
  }
  if (updateUser) {
    sql += ` and buildings.updateUser=${updateUser}`;
  }
  sql += ` order by buildings.createTime desc limit ${ (page - 1) * pageSize}, ${pageSize};`;
  var sql2 = `SELECT count(1) as total from buildings`;
  console.log(sql)
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
        res.send({code: 200, message: '查询成功！', buildings: results, total: results2[0].total});
      })
  })
});

router.post('/post', pipe.checkLogin, function (req, res) {
  var buildingName = req.body.buildingName;
  var zoneId = req.body.zoneId;
  var layerCount = req.body.layerCount;
  var height = req.body.height;
  var area = req.body.area;
  var buildTime = req.body.buildTime;
  var type = req.body.type;
  var direction = req.body.direction;

  if (!buildingName || !zoneId || !direction) {
    res.send({code: 201, message: '参数错误！'});
    return;
  }

  var status = 0;
  var createUser = req.session.loginInfo.userId;

  var sqlInsert = `INSERT INTO buildings(buildingName, zoneId, layerCount, height, area, buildTime, type, direction, status, createTime, createUser) VALUES ('${buildingName}', '${zoneId}', '${layerCount}', '${height}', '${area}', '${buildTime}', '${type}', '${direction}', ${status}, now(), '${createUser}')`;

  var sql = `select count(1) count from buildings where buildingName='${buildingName}'`;
  pool.query(sql, function (err, results) {
    if (err) {
      res.send({code: 202, message: err.message});
      return;
    }
    if (results[0] && results[0].count > 0) {
      res.send({code: 203, message: '楼宇名称不能重复！'});
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
  var buildingId = req.body.buildingId;
  var buildingName = req.body.buildingName;
  var zoneId = req.body.zoneId;
  var layerCount = req.body.layerCount;
  var height = req.body.height;
  var area = req.body.area;
  var buildTime = req.body.buildTime;
  var type = req.body.type;
  var direction = req.body.direction;

  if (!buildingId || !buildingName || !zoneId || !direction) {
    res.send({code: 201, message: '参数错误！'});
    return;
  }

  var user = req.session.loginInfo.userId;
  var sqlUpdate = `update buildings set buildingName='${buildingName}',zoneId='${zoneId}',layerCount='${layerCount}',height='${height}',area='${area}',buildTime='${buildTime}',type='${type}',updateTime=now(),updateUser='${user}' where buildingId='${buildingId}';`;

  var sql = `select count(1) count from buildings where buildingId!='${buildingId}' and buildingName='${buildingName}'`;
  pool.query(sql, function (err, results) {
    if (err) {
      res.send({code: 202, message: err.message});
      return;
    }
    if (results[0] && results[0].count > 0) {
      res.send({code: 203, message: '楼宇名称不能重复！'});
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
  var buildingId = req.body.buildingId;
  var status = req.body.status;

  if (!buildingId || [0, 1].findIndex(s => s == status) == -1) {
    res.send({code: 201, message: '参数错误！'});
    return;
  }

  var sql = `update buildings set status='${status}' where buildingId='${buildingId}';`;

  pool.query(sql, function (err, results) {
    if (err) {
      res.send({code: 202, message: err.message});
      return;
    }
    res.send({code: 200, message: '修改成功！'});
  })
})

router.delete('/delete', pipe.checkLogin, function (req, res) {
  var buildingIds = req.body.buildingIds;
  if (!buildingIds) {
    res.send({code: 201, message: '参数错误！'});
    return;
  }
  var sql = `delete from buildings where buildingId in (${buildingIds})`;
  pool.query(sql, function (err, results) {
    if (err) {
      res.send({code: 201, message: err.message});
      return;
    }
    res.send({code: 200, message: '删除成功！'});
  })
})

module.exports = router;

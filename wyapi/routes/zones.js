var express = require('express');
var router = express.Router();

var pool = require('../modules/db-mysql').options.pool;
var pipe = require('../modules/pipe');

router.get('/get', pipe.checkLogin, function (req, res) {
    var zoneId = req.query.zoneId
    var zoneName = req.query.zoneName;
    var companyId = req.query.companyId;
    var principal = req.query.principal;
    var contact = req.query.contact;
    var address = req.query.address;
    var buildTimeStart = req.query.buildTimeStart;
    var buildTimeEnd = req.query.buildTimeEnd;
    var area = req.query.area;
    var areaStructure = req.query.areaStructure;
    var areaRoad = req.query.areaRoad;
    var houseCount = req.query.houseCount;
    var houseCount2 = req.query.houseCount2;
    var carCount = req.query.carCount;
    var areaCar = req.query.areaCar;
    var areaPublic = req.query.areaPublic;
    var areaGreen = req.query.areaGreen;
    var status = req.query.status;

    var createTimeStart = req.query.createTimeStart;
    var createTimeEnd = req.query.createTimeEnd;
    var createUser = req.query.createUser;
    var updateTimeStart = req.query.updateTimeStart;
    var updateTimeEnd = req.query.updateTimeEnd;
    var updateUser = req.query.updateUser;

    var page = req.query.page - 0 || 1;
    var pageSize = req.query.pageSize - 0 || 10;

    var sql = `SELECT zones.zoneId,  zones.zoneName, zones.companyId, companies.companyName,  zones.principal,  zones.contact,  zones.address,  zones.buildTime,  zones.area,  zones.areaStructure,  zones.areaRoad,  zones.houseCount,  zones.houseCount2,  zones.carCount,  zones.areaCar, zones.areaPublic,  zones.areaGreen, zones.status, zones.createTime,  zones.createUser, users.userName as createUserName,  zones.updateTime,  zones.updateUser, users2.userName as updateUserName from zones LEFT JOIN companies ON zones.companyId = companies.companyId LEFT JOIN users ON zones.createUser = users.userId LEFT JOIN users as users2 ON zones.updateUser = users2.userId where (1=1)`;
    if (zoneId) {
        sql += ` and zones.zoneId='${zoneId}'`;
      }
    if (zoneName) {
        sql += ` and zones.zoneName like '%${zoneName}%'`;
    }
    if (companyId) {
        sql += ` and zones.companyId like '%${companyId}%'`;
    }
    if (principal) {
        sql += ` and zones.principal like '%${principal}%'`;
    }
    if (contact) {
        sql += ` and zones.contact like '%${contact}%'`;
    }
    if (address) {
        sql += ` and zones.address like '%${address}%'`;
    }
    if (buildTimeStart) {
        sql += ` and zones.buildTimeStart>='${buildTimeStart}'`;
    }
    if (buildTimeEnd) {
        sql += ` and zones.buildTimeEnd<='${buildTimeEnd}'`;
    }
    if (area) {
        sql += ` and zones.area like '%${area}%'`;
    }
    if (areaStructure) {
        sql += ` and zones.areaStructure like '%${areaStructure}%'`;
    }
    if (areaRoad) {
        sql += ` and zones.areaRoad like '%${areaRoad}%'`;
    }
    if (houseCount) {
        sql += ` and zones.houseCount like '%${houseCount}%'`;
    }
    if (houseCount2) {
        sql += ` and zones.houseCount2 like '%${houseCount2}%'`;
    }
    if (carCount) {
        sql += ` and zones.carCount like '%${carCount}%'`;
    }
    if (areaCar) {
        sql += ` and zones.areaCar like '%${areaCar}%'`;
    }
    if (areaPublic) {
        sql += ` and zones.areaPublic like '%${areaPublic}%'`;
    }
    if (areaGreen) {
        sql += ` and zones.areaGreen like '%${areaGreen}%'`;
    }

    if (status > -1) {
        sql += ` and zones.status=${status}`;
    }
    if (createTimeStart) {
        sql += ` and zones.createTime>='${createTimeStart}'`;
    }
    if (createTimeEnd) {
        sql += ` and zones.createTime<='${createTimeEnd}'`;
    }
    if (createUser) {
        sql += ` and zones.createUser=${createUser}`;
    }
    if (updateTimeStart) {
        sql += ` and zones.updateTime>='${updateTimeStart}'`;
    }
    if (updateTimeEnd) {
        sql += ` and zones.updateTime<='${updateTimeEnd}'`;
    }
    if (updateUser) {
        sql += ` and zones.updateUser=${updateUser}`;
    }
    sql += ` order by zones.createTime desc limit ${ (page - 1) * pageSize}, ${pageSize};`;
    var sql2 = `SELECT count(1) as total from zones`;

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
                res.send({code: 200, message: '查询成功！', zones: results, total: results2[0].total});
            })
    })
});

router.post('/post', pipe.checkLogin, function (req, res) {
    var zoneName = req.body.zoneName;
    var companyId = req.body.companyId;
    var principal = req.body.principal;
    var contact = req.body.contact;
    var address = req.body.address;
    var buildTime = req.body.buildTime;
    var area = req.body.area;
    var areaStructure = req.body.areaStructure;
    var areaRoad = req.body.areaRoad;
    var houseCount = req.body.houseCount;
    var houseCount2 = req.body.houseCount2;
    var carCount = req.body.carCount;
    var areaCar = req.body.areaCar;
    var areaPublic = req.body.areaPublic;
    var areaGreen = req.body.areaGreen;
    if (!zoneName || !companyId) {
        res.send({code: 201, message: '参数错误！'});
        return;
    }

    var status = 0;
    var createUser = req.session.loginInfo.userId;

    var sqlInsert = `INSERT INTO zones(zoneName, companyId, principal, contact, address, buildTime, area, areaStructure, areaRoad, houseCount, houseCount2, carCount, areaCar, areaPublic, areaGreen, status, createTime, createUser) VALUES ('${zoneName}', '${companyId}', '${principal}', '${contact}', '${address}', '${buildTime}', '${area}', '${areaStructure}', '${areaRoad}', '${houseCount}', '${houseCount2}', '${carCount}', '${areaCar}', '${areaPublic}', '${areaGreen}', ${status}, now(), '${createUser}')`;

    var sql = `select count(1) count from zones where zoneName='${zoneName}'`;
    pool.query(sql, function (err, results) {
        if (err) {
            res.send({code: 202, message: err.message});
            return;
        }
        if (results[0] && results[0].count > 0) {
            res.send({code: 203, message: '小区名称不能重复！'});
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
    var zoneId = req.body.zoneId;
    var zoneName = req.body.zoneName;
    var companyId = req.body.companyId;
    var principal = req.body.principal;
    var contact = req.body.contact;
    var address = req.body.address;
    var buildTime = req.body.buildTime;
    var area = req.body.area;
    var areaStructure = req.body.areaStructure;
    var areaRoad = req.body.areaRoad;
    var houseCount = req.body.houseCount;
    var houseCount2 = req.body.houseCount2;
    var carCount = req.body.carCount;
    var areaCar = req.body.areaCar;
    var areaPublic = req.body.areaPublic;
    var areaGreen = req.body.areaGreen;

    if (!zoneId || !zoneName || !companyId) {
        res.send({code: 201, message: '参数错误！'});
        return;
    }

    var user = req.session.loginInfo.userId;
    var sqlUpdate = `update zones set zoneName='${zoneName}',companyId='${companyId}',principal='${principal}',contact='${contact}',address='${address}',buildTime='${buildTime}',area='${area}',areaStructure='${areaStructure}',areaRoad='${areaRoad}',houseCount='${houseCount}',houseCount2='${houseCount2}',carCount='${carCount}',areaCar='${areaCar}',areaPublic='${areaPublic}',areaGreen='${areaGreen}',updateTime=now(),updateUser='${user}' where zoneId='${zoneId}';`;

    var sql = `select count(1) count from zones where zoneId!='${zoneId}' and zoneName='${zoneName}'`;
    pool.query(sql, function (err, results) {
        if (err) {
            res.send({code: 202, message: err.message});
            return;
        }
        if (results[0] && results[0].count > 0) {
            res.send({code: 203, message: '小区名称不能重复！'});
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
    var zoneId = req.body.zoneId;
    var status = req.body.status;

    if (!zoneId || [0, 1].findIndex(s => s == status) == -1) {
        res.send({code: 201, message: '参数错误！'});
        return;
    }

    var sql = `update zones set status='${status}' where zoneId='${zoneId}';`;

    pool.query(sql, function (err, results) {
        if (err) {
            res.send({code: 202, message: err.message});
            return;
        }
        res.send({code: 200, message: '修改成功！'});
    })
})

router.delete('/delete', pipe.checkLogin, function (req, res) {
    var zoneIds = req.body.zoneIds;
    if (!zoneIds) {
        res.send({code: 201, message: '参数错误！'});
        return;
    }
    var sql = `delete from zones where zoneId in (${zoneIds})`;
    pool.query(sql, function (err, results) {
        if (err) {
            res.send({code: 201, message: err.message});
            return;
        }
        res.send({code: 200, message: '删除成功！'});
    })
})

module.exports = router;

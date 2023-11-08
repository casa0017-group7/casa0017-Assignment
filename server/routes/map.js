var express = require('express');
var db = require("../sql.js");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('map', {title: 'CarbonMap'});
});

router.post('/data', function(req, res, next) {
    var val = req.body;
    var regionid = val.regionid;
    var shortname = val.shortname;
    var date = val.date;
    var time = val.time;

    console.log(val);

    db.query("select forecast, data from region where regionid = ? and shortname = ? and date = ? and time = ?", [regionid, shortname, date, time], function(err, data){
        if(err){
            throw err;
        }else if(data.length > 0){
            res.end(JSON.stringify(data));
        }
    })
});

module.exports = router;

var express = require('express');
var db = require("../sql.js");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('map', {title: 'CarbonMap'});
});

/**
 * @apiDefine respSuccessModel
 *
 * @apiSuccess {Object} data      request data[not null]
 *
 */

/**
 * @api {POST} /map/data get history carbon intensity data
 * @apiName getData
 * @apiGroup Data
 * @apiVersion 1.0.0
 * @apiHeader Content-Type application/json
 * @apiParam (Request body) {number} regionid the id of region
 * @apiParam (Request body) {String} shortname the short name of region
 * @apiParam (Request body) {String} date the date of carbon intensity record
 * @apiParam (Request body) {String} time the time of carbon intensity record
 * @apiParamExample {json} Request-Example
 *  {
 *     "regionid": 1,
 *     "shortname": "North Scotland",
 *     "date": "2018-07-06",
 *     "time": "02:00:00"
 * }
 *
 *
 * @apiUse respSuccessModel
 *
 * @apiSuccess {number} forecast the forecast value of next half hour
 * @apiSuccess {json} data the combination of carbon intensity
 * @apiSuccessExample  {json} Response-Example
 {
    "forecast":"268",
    "data":"[
        {\"fuel\": \"biomass\",\"perc\": 0},
        {\"fuel\": \"coal\", \"perc\": 0},
        {\"fuel\": \"imports\", \"perc\": 0},
        {\"fuel\": \"gas\", \"perc\": 68.6},
        {\"fuel\": \"nuclear\", \"perc\": 0},
        {\"fuel\": \"other\", \"perc\": 0},
        {\"fuel\": \"hydro\", \"perc\": 20.3},
        {\"fuel\": \"solar\", \"perc\": 0},
        {\"fuel\": \"wind\", \"perc\": 11.1}]"}
 }
 *
 * @apiSampleRequest off
 */
router.post('/data', function(req, res, next) {
    var val = req.body;
    var regionid = val.regionid;
    var shortname = val.shortname;
    var date = val.date;
    var time = val.time;

    console.log(val);
    console.log(typeof(val));

    db.query("select forecast, data from region where regionid = ? and shortname = ? and date = ? and time = ?", [regionid, shortname, date, time], function(err, data){
        if(err){
            throw(err);
        }else if(data.length > 0){
            res.end(JSON.stringify(data));
        }
    })
});

module.exports = router;

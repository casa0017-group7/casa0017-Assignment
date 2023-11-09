var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('error', {title: 'CarbonMap - 404 Not Found'});
});

module.exports = router;

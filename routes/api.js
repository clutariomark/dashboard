/*
 * Serve JSON to our AngularJS client
 */

var config = require('../config');
var fs = require('fs');
var path = require('path');
var sampleData = [{
    "id" : 1, //optional but good to have
    "location" : "Pasig City", //required
    "location_id" : 19, //required
    "value" : 778, //required
    "unit" : "mm Hg", //optional
    "description" : "Normal Value" //required
},
{
    "id" : 2, //optional but good to have
    "location" : "Quezon City", //required
    "location_id" : 20, //required
    "value" : 778, //required
    "unit" : "mm Hg", //optional
    "description" : "Normal Value" //required
}
];

//get connection pool from db
var pool = require('../config/db').pool;

//indexed fields
var FIELD_KEYS = config.FIELD_KEYS;

/**
* Accepts csv files for the data
*/
exports.submit = function (req, res) {
  var type = req.params.type.split('.')[0];
  if(!type || !config.data.hasOwnProperty(type)) {
    return res.send(404, 'Invalid type. Not supported');
  }

  var _data =  [];
  
  var data = req.files.data;
  var csv = fs.readFileSync(data.path, 'UTF8');
  var lines = csv.split('\n');

  for(var i = 0; i < lines.length; i++) {
    var line = lines[i];
    var fields = line.split(',');

    if(fields.length <= 1) continue;
    if(fields.length != FIELD_KEYS.length) {
      console.log(fields.length, FIELD_KEYS.length);
      return res.json({file: data, str: csv, error: 404, msg: 'Invalid data. Must have complete details. See fields in order: '+  FIELD_KEYS.join(',')});
    }

    var datum = {}
    for(var j= 0; j < fields.length; j++) {
      datum[FIELD_KEYS[j]] = fields[j];
    }
    _data.push(datum);
  }

  var filePath = path.join(__dirname, '../', config.SAVE_LOCATION);
  if(!fs.existsSync(filePath)) {
    //create
    fs.mkdirSync(filePath);
  }

  //save this data somewhere
  fs.writeFile(path.join(filePath , type + '.json'), JSON.stringify(_data), function (err) {
    if (err) {
      return res.json({err: err , msgs: 'Failed to write submitted file. Try again.'});
    }

    res.json({file: data, data: _data});
  });
  
}

exports.data = function (req, res) {
  var type = req.params.type.split('.')[0];
  if(!type || !config.data.hasOwnProperty(type)) {
    return res.send(404, 'Invalid type. Not supported');
  }

  var filePath = path.join(__dirname, '../', config.SAVE_LOCATION, type + '.json');
  if(fs.existsSync(filePath)) {
    var data = fs.readFileSync(filePath, 'utf8');
    return res.json(JSON.parse(data));
  }else {
    return res.json([]);
  }
  /* test data
  var _data = [];
  getAllCities(function (err, cities) {
    if(err) 
      return res.json({data: [], error: err});

    for(var i = 0; i < cities.length; i++) {
      _data.push({
        "id" : cities[i].id, //optional but good to have
        "location" : cities[i].name + ', ' + cities[i].province, //required
        "location_id" : cities[i].id, //required
        "value" : parseInt(Math.random()*1000), //required
        "unit" : "some unit", //optional
        "description" : "some description", //required
        "region" : cities[i].region,
        "province" : cities[i].province
      });
    }

    return res.json(_data);
  });
*/
}

/**
* Get municipalities per region
* @param region. {String}
* @param cb. {Function(err, cities)}
*/
function getCitiesForRegion(region, cb) {
  pool.getConnection(function (err, conn) {
    if(err) {
      return cb(err);
    }

    var sql = 'SELECT * FROM city WHERE region = ?';
    conn.query(sql, region, function (err, cities) {
      conn.release();
      if(err) {
        return cb(err);
      }else{
        return cb(null, cities);
      }
    });

  });
}

/**
* Get all cities
* @param cb. {Function (err, cities)}
*/
function getAllCities(cb) {
  pool.getConnection(function (err, conn) {
    if(err) {
      return cb(err);
    }

    var sql = 'SELECT * FROM city';
    conn.query(sql, [], function (err, cities) {
      conn.release();
      if(err) {
        return cb(err);
      }else{
        return cb(null, cities);
      }
    });

  });
}


/**
* Get all region
* @param cb. {Function(err, regions)}
*/
function getAllRegion(cb) {
  pool.getConnection(function (err, conn) {
    if(err)
      return cb(err);

    var sql = 'SELECT region FROM city GROUP BY region;';
    conn.query(sql, [], function (err, results) {
      conn.release();
      if(err)
        return cb(err)

      return cb(null, results);
    });
  });
}




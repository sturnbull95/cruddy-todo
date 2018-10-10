const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
//var storeIdHere = [];
  var myCB = function(err, id) {
    //console.log(exports.dataDir + '/' + id, "text: ", text)
    fs.writeFile(exports.dataDir + '/' + id +'.txt', text, function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log('saved!')
        callback(null, {id,text});
      }
    })
  }
  counter.getNextUniqueId(myCB);

};

exports.readAll = (callback) => {
  var data = [];
  fs.readdir(exports.dataDir, function(err, items) {
    console.log(items)
    for (var i=0; i<items.length; i++) {
      var obj = {};
      var temp = items[i].split('.');
      obj.id = temp[0];
      console.log(obj.id)
      obj.text = temp[0]
      data.push(obj);
      // fs.readFile(exports.dataDir +'/'+ items[i],function(err,buff){
      //   console.log('INSIDE SMALL READ')
      //   obj.data = buff.toString();
      //   console.log(obj)
      //   data.push(obj);
      //   console.log('DATA',data)
      // });
    }
    callback(null, data);
});
};

exports.readOne = (id, callback) => {
  fs.readdir(exports.dataDir, function(err, items) {
    var obj = {};
    for (var i=0; i<items.length; i++) {
      var temp = items[i].split('.');
      if(temp[0] === id){
        obj.id = temp[0];
        fs.readFile(exports.dataDir +'/'+ items[i],function(err,buff){
          obj.text = buff.toString();
          callback(null,obj);
        });
      }
    }
    if(obj.id === undefined){
      callback(new Error(`No item with id: ${id}`));
    }
});
};

exports.update = (id, text, callback) => {
    fs.exists(exports.dataDir + '/' + id +'.txt', function (exists) {
      if (!exists) {
        callback(new Error(`No item with id: ${id}`));
      } else {
        fs.writeFile(exports.dataDir + '/' + id +'.txt', text, function(err) {
          if (err) {
            console.log(err);
            callback(new Error('Failed to write file!'));
          } else {
            callback(null, {id,text});
          }
        });
      }
  });
};

exports.delete = (id, callback) => {
  fs.exists(exports.dataDir + '/' + id +'.txt', function (exists) {
    if (!exists) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.unlink(exports.dataDir + '/' + id +'.txt', function(err) {
        if (err) {
          callback(new Error('Could not delete for some reason!'));
        } else {
          callback(err);
        }
      });
    }
});
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};

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
        console.log(exports.dataDir + '/' + id, "text: ", text)
        console.log('saved!')

        callback(null, {id,text});
      }
    })
  }
  counter.getNextUniqueId(myCB);

};

exports.readAll = (callback) => {
  var data = [];
  _.each(items, (text, id) => {
    data.push({ id, text });
  });
  callback(null, data);
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};

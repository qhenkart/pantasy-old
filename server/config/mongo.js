var Promise = require('bluebird');
var mongodb = require('mongodb');
var config = require('../../config.json');

var MongoClient = mongodb.MongoClient;
var Collection = mongodb.Collection;
Promise.promisifyAll(MongoClient);
Promise.promisifyAll(Collection.prototype);

module.exports = MongoClient.connectAsync(config.mongo.url);

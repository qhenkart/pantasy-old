var Promise = require('bluebird');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var Collection = mongodb.Collection;
Promise.promisifyAll(MongoClient);
Promise.promisifyAll(Collection.prototype);

module.exports = MongoClient.connectAsync('mongodb://dummy:a12345667@ec2-52-26-139-62.us-west-2.compute.amazonaws.com:27017/dummyDB');

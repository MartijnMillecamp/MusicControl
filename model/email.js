/**
 * Created by yucheng on 14/11/2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Email', new Schema({
	email: String
}));
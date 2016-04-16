var colors = require("colors/safe");
var moment = require("moment");
var Helper = require("./helper");

function writeLine(type, messageArgs) {
	var config = Helper.getConfig();
	var format = (config.logs || {}).format || "YYYY-MM-DD HH:mm:ss";
	var tz = (config.logs || {}).timezone || "UTC+00:00";

	var time = moment().utcOffset(tz).format(format);

	Array.prototype.unshift.call(messageArgs, colors.dim(time), type);
	console.log.apply(console, messageArgs);
}

exports.err = function() {
	writeLine(colors.red("[ERROR]"), arguments);
};

exports.warn = function() {
	writeLine(colors.yellow("[WARN]"), arguments);
};

exports.info = function() {
	writeLine(colors.blue("[INFO]"), arguments);
};

exports.debug = function() {
	writeLine(colors.green("[DEBUG]"), arguments);
};

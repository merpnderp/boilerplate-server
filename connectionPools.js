var mysql = require('mysql');
var dbConfigs = require('./config').dbConfig;

exports.authorizationPool = authPool = mysql.createPool(dbConfigs.authorization);

exports.authQuery = function (sql, args) {
	return new Promise(function (res, rej) {
		authPool.getConnection(function (err, conn) {
			if (err) return rej(err)
			conn.query(sql, args, function (err, results) {
				conn.release();
				if (err) return rej(err);
				res(results);
			})
		})
	})
}

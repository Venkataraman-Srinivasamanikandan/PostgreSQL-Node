const validator = require("node-validator");

exports.validate = (check, body, res) => {
	return new Promise((resolve, reject) => {
		validator.run(check, body, (errCount, errs) => {
			if (errCount > 0) {
				res.status(400);
				return reject({ message: 'Invalid parameters', stack: errs })
			}
			resolve(true)
		})
	})
}
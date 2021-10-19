const joi = require("joi");

const envVarsSchema = joi
	.object()
	.keys({
		PORT: joi.number().positive().required(),
		PGUSER: joi.string().required(),
		PGHOST: joi.string().required(),
		PGPASSWORD: joi.string().required(),
		PGDATABASE: joi.string().required()
	})
	.unknown();

const { value: envVars, error } = envVarsSchema
	.prefs({ errors: { label: "key" } })
	.validate(process.env);

if (error) {
	throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
	port: process.env.PORT
}
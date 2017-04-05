if (!process.env.BOILERPLATE_PASSWORD) {
  throw new Exception("DB Password not set in BOILERPLATE_PASSWORD env");
}
module.exports = {
  dbConfig: {
    authorization: {
      connectionLimit: 10,
      user: "boilerplate",
      password: process.env.BOILERPLATE_PASSWORD,
      host: "127.0.0.1",
      database: "Authorization"
    }
  },
  auth: {
    sessionExpireTime: 5 * 24 * 60 * 60 * 1000,
    saltRounds: 10
  },
	expressSession = process.env.EXPRESS_SESSION
};

if(!process.env.BOILERPLATE_PASSWORD)
	throw new Error("BOILERPLATE_PASSWORD must be defined");
if(!process.env.EXPRESS_SESSION)
  throw new Error("EXPRESS_SESSION must be defined");

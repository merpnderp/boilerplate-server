if (!process.env.BOILERPLATE_PASSWORD) {
  throw new Exception("DB Password not set in BOILERPLATE_PASSWORD env");
}
var password = process.env.BOILERPLATE_PASSWORD;

module.exports = {
  dbConfig: {
    authorization: {
      connectionLimit: 10,
      user: "boilerplate",
      password: password,
      host: "127.0.0.1",
      database: "Authorization"
    }
  },
  auth: {
    tokenExpireTime: 24,
    saltRounds: 10
  }
};

if(!process.env.BOILERPLATE_PASSWORD)
	throw new Error("BOILERPLATE_PASSWORD must be defined");
if(!process.env.EXPRESS_SESSION)
  throw new Error("EXPRESS_SESSION must be defined");

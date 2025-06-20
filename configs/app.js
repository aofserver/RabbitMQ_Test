require("dotenv").config();

const env = {
  port: process.env.PORT || 3000,
  appName: process.env.APPNAME || "",
  rabbitHost: process.env.RABBIT_HOST || "localhost",
  rabbitUser: process.env.RABBIT_ADMIN_USER || process.env.RABBIT_DEV_USER,
  rabbitPass: process.env.RABBIT_ADMIN_PASS || process.env.RABBIT_DEV_PASS,
};

Object.keys(env).map((i)=>{ env[i] ? "" : console.log(`[ error ] missing environment parameter ${i}.`) })
module.exports = env;
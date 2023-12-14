const mongoose = require("mongoose");
const app = require("./app");
const { DB_HOST, HOST } = process.env;

mongoose.set("strictQuery", true);

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(HOST);
    console.log(`Server  running. Use our API on port: ${HOST}`);
  })
  .catch((err) => {
    console.error(err.message);

    process.exit(1);
  });

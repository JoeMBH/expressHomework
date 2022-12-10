const mongoose = require("mongoose");
const { config } = require("../config/secret");
main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(
    `mongodb+srv://${config.userDB}:${config.userPass}@mongodb.4ncheir.mongodb.net/homeworkExpress`
  );
  console.log("homeworkExpress database connected.");
}

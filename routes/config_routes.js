const usersR = require("./users");
const gamesR = require("./games");

exports.routesInit = (app) => {
  app.use("/users", usersR);
  app.use("/games", gamesR);
  app.use("*", (req, res) => {
    res.status(404).json({ msg: "Endpoint not found , 404", error: 404 });
  });
};

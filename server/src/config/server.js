const app = require("../app");

var server = app.listen(3000, () => console.log("--running"));

require("./socketio")(server);

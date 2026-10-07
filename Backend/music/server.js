import app from "./src/app.js";
import connectToDatabase from "./src/db/db.js";
import initSocketServer from "./src/sockets/socket.server.js";
import http from "http";

const httpServer = http.createServer(app);

/* Connect database */
connectToDatabase();
initSocketServer(httpServer);

/* Server started here */
httpServer.listen(3002, () => {
  console.log("Music service is running on port 3002");
})

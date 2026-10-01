import app from "./src/app.js";
import startListener from "./src/broker/listener.js";
import { connect } from "./src/broker/rabbit.js";


connect().then(startListener);


/* Server Started */
app.listen(3000, () => {
  console.log("Notification Server is running on port 3000")
})

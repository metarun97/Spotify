import app from "./src/app.js";
import connectToDatabase from "./src/db/db.js";


/* Connect database */
connectToDatabase();

/* Server started here */
app.listen(3002, () => {
  console.log("Music service is running on port 3002");
})

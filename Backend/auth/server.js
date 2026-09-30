import app from "./src/app.js";
import connectToDb from "./src/db/db.js";


/* Database Connected */
connectToDb();


/* Auth Server Started */
app.listen(3000, () => {

  console.log("Auth server is running on port 3000");

})

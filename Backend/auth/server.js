import app from './src/app.js';
import connectDatabase from './src/db/db.js';
import { connect } from './src/broker/rabbit.js';


/* Connect Database */
connectDatabase();

/* Connect RabbitMQ */
connect();

/* Server Started */
app.listen(3000, () => {
  console.log("Auth Server is running on port 3000");
})




import { subscribeToQueue } from "./rabbit.js";
import sendEmail from './../utils/email.js';


/* Listener function */
const startListener = () => {
  subscribeToQueue("user_created", async (msg) => {

    const { email, role, fullname: { firstName, lastName } } = msg;

    const tamplate = `
  <h1>Welcome to our Spotify</h1>
  <p>Dear ${firstName} ${lastName},</p>
  <p>We are excited to have you on board as a ${role}. We hope you enjoy your experience with us.</p>
  <br/>
  <p>Best regards,</p>
  <p>Spotify Team</p>
  <p>Note: This is an automated email, please do not reply.</p>
`;

    await sendEmail(email, "Welcome to Spotify", "Thank you for registering with Spotify!", tamplate);
  })
}

export default startListener;

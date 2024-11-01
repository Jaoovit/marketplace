require("dotenv").config();
const express = require("express");
const initializeSession = require("./config/session");

const app = express();

// Middleware to parte JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Prisma session configuration
initializeSession(app);

// Routes
const userRoute = require("./routes/userRoute");
const adsRoute = require("./routes/adsRoute");
const adImageRoute = require("./routes/adImageRoute");

app.use(userRoute);
app.use(adsRoute);
app.user(adImageRoute);

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  `The server is running in the port ${PORT}`;
});

require("dotenv").config();
const express = require("express");
const initializeSession = require("./config/session");

const app = express();

const cors = require("cors");

/*
Cors options example

const corsOptions = {
  origin: "https://your-allowed-domain.com",
  methods: "GET,POST, PUT, DELETE, PATCH",
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
*/

app.use(cors(/*corsOptions*/));

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
app.use(adImageRoute);

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  `The server is running in the port ${PORT}`;
});

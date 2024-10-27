require("dotenv").config();
const express = require("express");
const initializeSession = require("./config/session");

const app = express();

// Middleware to parte JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Public
app.use(express.static("public"));

// Prisma session configuration
initializeSession(app);

// Routes
const userRoute = require("./routes/userRouter");

app.use(userRoute);

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  `The server is running in the port ${PORT}`;
});

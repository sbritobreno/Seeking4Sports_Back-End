const express = require("express");
const cors = require("cors");

const app = express();

// Config JSON response
app.use(express.json());

//In this project we do not need URLenconded as we are only going to work with json

// Solve CORS
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

// Public folder for images
app.use(express.static("public"));

// Routes
const ApiRoutes = require("./routes/ApiRoutes");
const UserRoutes = require("./routes/UserRoutes");
const SportRoutes = require("./routes/SportRoutes");
const MessageRoutes = require("./routes/MessageRoutes");

app.use("/seeking4sports_api", ApiRoutes);
app.use("/user", UserRoutes);
app.use("/sport", SportRoutes);
app.use("/message", MessageRoutes);

app.listen(5000);

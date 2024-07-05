const express = require("express");

const app = express();

const path = require("path");

const mongoose = require("mongoose");

const bodyParser = require("body-parser");

const cors = require("cors");

require("dotenv").config();

// const rootDir = require("./util/path");
const userRoutes = require("./routes/User");
const projectRoutes = require("./routes/Project");
const PORT = process.env.PORT;
const corsOptions = {
  origin: "http://localhost:3000", 
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.use(express.static(path.join(rootDir, "../frontend/public")));

app.use("/api", userRoutes);
app.use("/api", projectRoutes);

mongoose
  .connect("mongodb://127.0.0.1:27017/projectManagement")
  .then((result) => {
    app.listen(PORT);
    console.log(`server listening on ${PORT}`);
  })
  .catch((err) => {
    console.log("error connecting to database");
  });

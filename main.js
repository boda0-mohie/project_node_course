require("dotenv").config();
const express = require("express");

const path = require("path");

const app = express();
const cors = require("cors");

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const mongoose = require("mongoose");

const url = process.env.MONGO_URL;

mongoose.connect(url).then(() => {
  console.log("DB Connected");
});

app.use(cors());
app.use(express.json());

const coursesRouter = require("./routs/routs");
const usersRouter = require("./routs/users.routs");

app.use("/api/courses", coursesRouter);
app.use("/api/users", usersRouter);

// Global Middleware For Not Found rout
app.all("*", (req, res, next) => {
  return res.json({ status: "error", message: "Resourse Not Found" });
});

// Global error Handelar
app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({
    status: error.statusText || "error",
    message: error.message,
    code: error.statusCode || 500,
    data: null,
  });
});

app.listen(process.env.PORT || 200, () => {
  console.log("Listening On Port: 200");
});

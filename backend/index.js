const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const router = require("./routes/router");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use("/", router);

// Add connection handling events
mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", {
    name: err.name,
    message: err.message,
    code: err.code,
  });
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected from MongoDB");
});

// Test connection function
async function testConnection() {
  try {
    // Test the connection by running a simple operation
    await mongoose.connection.db.admin().ping();
    console.log("MongoDB connection test successful!");
    return true;
  } catch (error) {
    console.error("MongoDB connection test failed:", {
      name: error.name,
      message: error.message,
      code: error.code,
    });
    return false;
  }
}

mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("Connected to MongoDB");
    // Test the connection after connecting
    await testConnection();
  })
  .catch((err) => {
    console.error("MongoDB connection error details:", {
      name: err.name,
      message: err.message,
      code: err.code,
    });
    // Terminate the process if MongoDB connection fails
    process.exit(1);
  });
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

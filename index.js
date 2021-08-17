const express = require('express');
const app = express();
require("dotenv").config();
const connect = require("./config/db");
const userRoutes = require("./routes/userRoutes");

connect();

app.use(express.json());
app.use("/", userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server is runnig on port ${PORT}`);
});

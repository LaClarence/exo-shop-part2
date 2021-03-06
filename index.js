const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

app.use(bodyParser.json());

mongoose.connect(
  "mongodb://localhost:27017/online-shop-part2",
  { useNewUrlParser: true }
);

const departmentRoutes = require("./routes/department");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const reviewRoutes = require("./routes/review");

app.use(departmentRoutes);
app.use(categoryRoutes);
app.use(productRoutes);
app.use(reviewRoutes);

app.listen(3000, () => {
  console.log("Server started");
});

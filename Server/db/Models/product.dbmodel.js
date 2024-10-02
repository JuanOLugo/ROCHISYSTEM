const { Schema, model } = require("mongoose");

//Creating Schema for db

const productSchema = new Schema({
  code: String,
  name: String,
  price: Number,
  supplier: String,
  stock: String,
});

//Creating Model
const productModel = model("products", productSchema);

//Export model
module.exports = productModel;

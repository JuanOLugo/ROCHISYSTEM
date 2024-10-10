const { Schema, model } = require("mongoose");

//Creating Schema for db

const productSchema = new Schema({
  code: String,
  name: String,
  priceCost: Number,
  priceSell: Number,
  supplier: String,
  stock: Number,
});

//Creating Model
const productModel = model("products", productSchema);

//Export model
module.exports = productModel;
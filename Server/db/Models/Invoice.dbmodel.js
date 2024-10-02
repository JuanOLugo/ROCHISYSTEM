const { Schema, model } = require("mongoose");

//Creating Schema for db

const invoiceSchema = new Schema({
  clientName: String,
  idClient: String,
  sellerName: String,
  productList: [
    {
      product: Schema.ObjectId,
      discount: Number,
      amount: Number,
    },
  ],
  totalInvoice: Number,
  moneyGave: Number,
});


//Creating Model
const invoiceModel = model("invoices", invoiceSchema);

//Export model
module.exports = invoiceModel;

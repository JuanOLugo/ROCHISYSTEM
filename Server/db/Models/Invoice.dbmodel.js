const { Schema, model } = require("mongoose");

//Creating Schema for db

const invoiceSchema = new Schema({
  clientName: String,
  idClient: String,
  sellerName: String,
  productList: [
    {
        _id: String ,
        code: String,
        name: String,
        priceSell: Number,
        amount:Number,
        discount:Number
      
    },
  ],
  totalInvoice: Number,
  moneyGave: Number,
  date: String,
  payMethod: String,
  
});

//Creating Model
const invoiceModel = model("invoices", invoiceSchema);

//Export model
module.exports = invoiceModel;

const { Router } = require("express");
const Invoice = require("../db/Models/Invoice.dbmodel");
const productModel = require("../db/Models/product.dbmodel");

const iRouter = Router();

iRouter.post("/create", async (req, res) => {
  const { invoice } = req.body;
  const productList = await Promise.all(
    invoice.productos.map(async (e) => {
      const product = await productModel.findById(e._id);
      if (!product) throw new Error("ERROR PRODUCTO NO EXISTE");
      const newStock = product.stock - e.cantidad;
      const updatedProduct = await productModel.findByIdAndUpdate(e._id, {
        stock: newStock,
      });

      const { _id, code, name, priceCost, priceSell, stock } = updatedProduct;

      return {
        _id: _id,
        code: code,
        name: name,
        priceSell: priceSell,
        priceCost: priceCost,
        amount: e.cantidad,
        discount: e.descuento,
      };
    })
  );

  const newInvoice = new Invoice({
    clientName: invoice.nombreCliente,
    idClient: invoice.identificacionCliente,
    sellerName: invoice.nombreVendedor,
    productList: productList,
    totalInvoice: invoice.total,
    moneyGave: invoice.totalMoney,
    date: invoice.date,
    payMethod: invoice.paymentMethod,
  });

  //Guardamos el producto en la base de datos
  const saveInvoice = await newInvoice.save();

  //Verificamos que se gaurde correctamente y enviamos un mensaje
  saveInvoice
    ? res.status(200).send({ message: "Factura guardada satisfactoriamente" })
    : res.status(400).send({ message: "Error al guardar" });
});

iRouter.post("/get", async (req, res) => {
  const { date } = req.body;

  const filterInvoice = await Invoice.find({ date: date });

  //Verificamos que se gaurde correctamente y enviamos un mensaje
  filterInvoice
    ? res.status(200).send({ invoices: filterInvoice })
    : res.status(400).send({ message: "Error al filtrar" });
});

iRouter.post("/delete", async (req, res) => {
  const { id } = req.body;

  let filterInvoice = await Invoice.findById(id);
  const productList = filterInvoice.productList;
  const newPromiseAll = Promise.all(
    productList.map(async (e) => {
      const filterProduct = await productModel.findById(e._id);
      const newStock = e.amount + filterProduct.stock;
      await productModel.findByIdAndUpdate(filterProduct._id, {
        stock: newStock,
      });
    })
  );

  if (newPromiseAll) {
    filterInvoice = await Invoice.findByIdAndDelete(id);
  }

  //Verificamos que se gaurde correctamente y enviamos un mensaje
  filterInvoice
    ? res.status(200).send({ message: "Eliminado correctamente" })
    : res.status(400).send({ message: "Error al eliminar" });
});

iRouter.post("/verifyTotalWinDay", async (req, res) => {
  const { date } = req.body;

  let filterInvoice = await Invoice.find({ date });
  const v = filterInvoice.map((i) => i.productList)

  const validation = v.reduce((totalWinningSum, group) => {
    const groupTotal = group.reduce((groupSum, e) => {
      const sumPrices = e.priceSell * e.amount;
      const totalDiscount = sumPrices * (e.discount / 100);
      const sumTotalAfterDiscount = sumPrices - totalDiscount;
      const sumPriceCost = (e.priceCost || 0) * e.amount;
      const totalWinning = sumTotalAfterDiscount - sumPriceCost;
      return groupSum + totalWinning;
    }, 0);
    return totalWinningSum + groupTotal;
  }, 0);

  if(validation) return res.status(200).send({totalWinning: validation})
  else return res.status(400).send({message: "No hay ingresos de ganancias fijos"})
});

module.exports = iRouter;

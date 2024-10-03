const { Router } = require("express");
const product = require("../db/Models/product.dbmodel");
const pRouter = Router();
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
pRouter.post("/create", async (req, res) => {
  const { codigo, nombre, PrecioCosto, Precioventa, proveedor, stock } =
    req.body;

  //Find by code if product exist

  const findProduct = await product.find({ code: codigo });

  //Si existe enviamos mensaje de error
  if (findProduct.length > 0)
    return res
      .status(400)
      .send({ message: "Codigo en uso, actualice la pagina" });

  //Agregamos cada valor correspondinte
  const newproduct = new product({
    code: codigo,
    name: nombre,
    priceCost: PrecioCosto,
    supplier: proveedor ? proveedor : "Local",
    stock: parseInt(stock),
    priceSell: Precioventa,
  });

  //Guardamos el producto en la base de datos
  const saveProduct = await newproduct.save();

  //Verificamos que se gaurde correctamente y enviamos un mensaje
  saveProduct
    ? res.status(200).send({ message: "Producto guardado satisfactoriamente" })
    : res.status(400).send({ message: "Error al gaurdar" });
});

pRouter.post("/delete", async (req, res) => {
  const { id } = req.body;

  //Find by code if product exist

  const deleteProduct = await product.findByIdAndDelete(id);

  //Si se elimina enviamos mensaje
  if (deleteProduct)
    return res
      .status(200)
      .send({ message: "Producto eliminado correctamente" });
  return res.status(400).send({ message: "Error al eliminar el producto" });
});

pRouter.post("/update", async (req, res) => {
  const { productos } = req.body;

  console.log(productos);

  const FileName = "registro.json";
  const rutaDirectorio = path.join(__dirname, "Registros", FileName); // Especifica la ruta completa

  // Uso de promesa para escribir el archivo

  fs.writeFileSync(rutaDirectorio, JSON.stringify(productos))

  try {
    exec("bartend", (err, data) => {
      console.log(err);
      console.log(data.toString());
    });
    console.log("ejecutado");
  } catch (error) {
    console.log("no ejecutado");
  }

  //Find by code if product exist

  const updateProducts = productos.map(async (p) => {
    const existingProduct = await product.findOne({ code: p.codigo });

    // Suma el stock actual con el nuevo valor
    const newStock = existingProduct.stock + p.cantidad;

    return (filterProductAndUpdate = await product.findOneAndUpdate(
      { code: p.codigo },
      {
        priceCost: p.precioCosto,
        priceSell: p.precioVenta,
        stock: newStock,
        name: p.nombre,
      }
    ));
  });

  //Si se actualiza enviamos mensaje de error
  if (updateProducts)
    return res
      .status(200)
      .send({ message: "Producto actualizado correctamente" });
  return res.status(400).send({ message: "Error al actualizar el producto" });
});

pRouter.get("/get", async (req, res) => {
  //Get all products
  const products = await product.find();
  if (products.length > 0) return res.status(200).send(products);
  res.status(400).send({ message: "No existen productos" });
});

module.exports = pRouter;

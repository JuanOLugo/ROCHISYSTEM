const { Router, json } = require("express");
const product = require("../db/Models/product.dbmodel");
const pRouter = Router();
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const converter = require("json-2-csv");

//Code generator

function generarCodigoUnico() {
  // El primer dígito no puede ser 0
  const primerDigito = Math.floor(Math.random() * 9) + 1; // Genera un número entre 1 y 9
  // Los otros tres dígitos pueden ser cualquier número entre 0 y 9
  const siguienteDigitos = Math.floor(Math.random() * 1000); // Genera un número entre 000 y 999
  // Asegura que siempre tenga 3 dígitos, añadiendo ceros a la izquierda si es necesario
  const codigo =
    primerDigito.toString() + siguienteDigitos.toString().padStart(3, "0");
  return codigo;
}

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

  const productAddForTicket = productos.filter(
    (e) => e.GenerateTicked === true
  );

  if (productAddForTicket.length > 0) {
    const FileName = "registro.csv";
    const rutaDirectorio = path.join(__dirname, "Registros", FileName); // Especifica la ruta completa

    // Uso de promesa para escribir el archivo

    fs.writeFileSync(
      rutaDirectorio,
      converter.json2csv(productAddForTicket, (err, csv) => {
        if (err) console.log(err);
        return csv;
      })
    );

    try {
      exec("bartend", (err, data) => {
        console.log(err);
        console.log(data.toString());
      });
      console.log("ejecutado");
    } catch (error) {
      console.log("no ejecutado");
    }
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

pRouter.get("/getproductcode", async (req, res) => {
  //Get all products

  const products = await product.find();
  let codeGen = generarCodigoUnico().toString();
  const productExist = products.map((p) => {
    while (products.some((p) => p.code === codeGen)) {
      codeGen = generarCodigoUnico().toString();
      console.log("igual");
    }
  });

  if (codeGen) {
    res.status(200).send({ code: codeGen });
  }
});

pRouter.post("/getproductbycode", async (req, res) => {
  //Get all products
  const { code } = req.body;
  console.log(code);
  const productFilter = await product.findOne({ code: code });

  if (productFilter) {
    res.status(200).send({ product: productFilter });
  } else res.status(400).send({ message: "No se encontro producto" });
});

pRouter.post("/getproductbyname", async (req, res) => {
  //Get all products
  let { name } = req.body;
  name = name.toLowerCase();
  const products = await product.find();

  const productsFilter = products.filter((p) => {
    if (p.name.toLowerCase().includes(name)) return p;
  });
  console.log(productsFilter);
  if (productsFilter) {
    res.status(200).send({ product: productsFilter });
  } else res.status(400).send({ message: "No se encontro producto" });
});

pRouter.post("/getproductbysection", async (req, res) => {
  //Get all products
  let { pageNum, pageSize, codeFilter, nameFilter } = req.body;

  const products = await product.find();
  const info = {
    pageNum,
    pageSize,
    productsSize: products.length,
  };

  let arrayProducts;

  if (codeFilter) {
    arrayProducts = products.filter((p) => p.code.includes(codeFilter));
    arrayProducts = arrayProducts.slice(
      (pageNum - 1) * pageSize,
      pageNum * pageSize
    );
  } else if (nameFilter) {
    arrayProducts = products.filter((p) => p.name.toLowerCase().includes(nameFilter.toLowerCase()));
    arrayProducts = arrayProducts.slice(
      (pageNum - 1) * pageSize,
      pageNum * pageSize
    );
  } else {
    arrayProducts = products.slice(
      (pageNum - 1) * pageSize,
      pageNum * pageSize
    );

    
  }

  let final;

  if(arrayProducts.length > pageSize - 1){
    final = false
  }else final = true

  if (arrayProducts.length > 0) {
    res.status(200).send({ products: arrayProducts, info: {...info, final}  });
  } else res.status(400).send({ message: "No hay productos", info: {...info, final} });
});

module.exports = pRouter;

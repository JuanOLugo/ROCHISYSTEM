const { Router } = require("express");
const product = require("../db/Models/product.dbmodel")
const pRouter = Router();

pRouter.post("/create", async (req, res) => {

    const { codigo, nombre, precio, proveedor, stock } = req.body

    //Find by code if product exist

    const findProduct = await product.find({code: codigo})

    //Si existe enviamos mensaje de error
    if(findProduct.length > 0) return res.status(400).send({message: "Codigo en uso, actualice la pagina"})
    

    //Agregamos cada valor correspondinte
    const newproduct = new product({
        code: codigo,
        name:nombre,
        price: precio,
        supplier: proveedor ? proveedor : "Local",
        stock
    })

    //Guardamos el producto en la base de datos
    const saveProduct = await newproduct.save()

    //Verificamos que se gaurde correctamente y enviamos un mensaje
    saveProduct ? res.status(200).send({message: "Producto guardado satisfactoriamente"}) : res.status(400).send({message: "Error al gaurdar"})

});


pRouter.post("/delete", async (req, res) => {

    const {id} = req.body

    //Find by code if product exist

    const deleteProduct = await product.findByIdAndDelete(id)

    //Si se elimina enviamos mensaje 
    if(deleteProduct) return res.status(200).send({message: "Producto eliminado correctamente"})
    return res.status(400).send({message: "Error al eliminar el producto"})

});

pRouter.post("/update", async (req, res) => {

    const {id, precio, stock, proveedor, nombre} = req.body

    //Find by code if product exist

    const updateProduct = await product.findByIdAndUpdate(id, 
        {
            price: precio,
            stock,
            supplier:proveedor,
            name: nombre
        }
    )

    //Si se actualiza enviamos mensaje de error
    if(updateProduct) return res.status(200).send({message: "Producto actualizado correctamente"})
    return res.status(400).send({message: "Error al actualizar el producto"})

});


pRouter.get("/get", async (req, res) => {

    //Get all products
    const products = await product.find()
    if(products.length > 0) return res.status(200).send(products)
    res.status(400).send({message: "No existen productos"})

});



module.exports = pRouter;

const {Router} = require("express")

const iRouter = Router()

iRouter.post("/create", async (req, res) => {

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


module.exports = iRouter
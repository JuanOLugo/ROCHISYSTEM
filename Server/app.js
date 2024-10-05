const express = require("express")
const cors = require("cors")

 const app = express()

//Policy cors
app.use(cors())

//admitir json de manera nativa
app.use(express.json())

//Api Routes
app.use("/api/product", require("./Routes/Product.routes"))
app.use("/api/invoice", require("./Routes/Invoice.Routes"))


// Puerto del servidor
const port = 8528

const server = app.listen(port, () => {
    //Mensaje de OK
    const messageOK = "Server ready on port: "
    console.log(messageOK + port)

    //Start db
    require("./db/start.db")('mongodb://127.0.0.1:27017/inventario_rochi')
})




const { Router } = require("express");
const trouter = Router();
const converter = require("json-2-csv");
const fs = require("fs");
const path = require("path")
const { exec } = require("child_process");

trouter.post("/generateticket", async (req, res) => {
  const { productos } = req.body;

  if (productos.length > 0) {
    try {
      const FileName = "registro.csv";
      const rutaDirectorio = path.join(__dirname, "Registros", FileName); // Especifica la ruta completa
      fs.writeFileSync(
        rutaDirectorio,
        converter.json2csv(productos, (err, csv) => {
          if (err) console.log(err);
          return csv;
        })
      );
      exec("bartend", (err, data) => {
        console.log(err);
        console.log(data.toString());
      });
      res.status(200).send({ message: "CSV CREADO" });
    } catch (error) {
      res.status(400).send({ message: "ERROR BARTENDER" });
      console.log(error);
    }
  }
});

module.exports = trouter;

const { Router } = require("express");
const trouter = Router();
const converter = require("json-2-csv");
const fs = require("fs");
const path = require("path")
const { exec } = require("child_process");

trouter.post("/generateticket", async (req, res) => {
  const { productos } = req.body;

  const FileName = "registro.csv";
      const rutaDirectorio = path.join(__dirname, "Registros", FileName); // Especifica la ruta completa
      fs.writeFileSync(
        rutaDirectorio,
        converter.json2csv(productos, (err, csv) => {
          if (err) console.log(err);
          return csv;
        })
      );

  const executeCommand = new Promise((resolve, reject) => {
    exec("bartend", (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
  const response = await executeCommand.catch((error) => {
    return error;
  });
  if (response) return res.status(400).send("Error al ejecutar el comando desde el servidor | Contactar al desarrollador");
  else return res.status(200).send("Mensaje enviado correctamente");

});

module.exports = trouter;

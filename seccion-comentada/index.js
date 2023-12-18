// const express = require("express"); // CommonJS
import express from "express"; // ECMAScript modules
import usuarioRoutes from "./routes/usuarioRoutes.js";

// Crear la app
const app = express();

// Routing
app.use("/", usuarioRoutes); // use busca todas las rutas que inician con /, en cambio get busca exactamente la ruta entre " "

// crear puerto y arrancar proyecto

const port = 3001;

app.listen(port, () => {
  console.log(`El Servidor esta funcionando en el puerto ${port}`);
});

// const express = require("express"); // CommonJS
import express from "express"; // ECMAScript modules
import usuarioRoutes from "./routes/usuarioRoutes.js";
import propiedadesRoutes from "./routes/propiedadesRoutes.js";
import appRoutes from "./routes/appRoutes.js";
import apiRoutes from "./routes/apiRoutes.js";
import db from "./config/db.js";
import cookieParser from "cookie-parser";

// Crear la app
const app = express();

//Habilitar cookieParser
app.use(cookieParser());

//Habilitar Lectura de datos de formularios
app.use(express.urlencoded({ extended: true }));

// Conexion a la base de datos
try {
  await db.authenticate();
  db.sync();
  console.log("Conexion  Correcta a la base de datos");
} catch (error) {
  console.log(error);
}

// Habilitar Pug
app.set("view engine", "pug");
app.set("views", "./views");

//Carpeta Publica
app.use(express.static("public"));
// Routing
app.use("/", appRoutes);
app.use("/auth", usuarioRoutes);
app.use("/", propiedadesRoutes);
app.use("/api", apiRoutes);

// crear puerto y arrancar proyecto

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`El Servidor esta funcionando en el puerto ${port}`);
});

import categorias from "./categorias.js";
import Categoria from "../models/Categorias.js";
import db from "../config/db.js";

const importarDatos = async () => {
  try {
    // Autenticar
    await db.authenticate();
    // Generar las columnas
    await db.sync();
    //Insertamos los Datos

    // await Categoria.bulkCreate(categorias);
    // await Precio.bulkCreate(precios);  //Esta forma se puede usar si un query depende del anterior, con Promise podemos ejecutar las 2 query a la vez

    await Promise.all([
      Categoria.bulkCreate(categorias),
      Precio.bulkCreate(precios),
    ]);
    console.log("Datos Importados Correctamente");
    exit(); // exit() o exit(0) finaliza la ejecucion de codigo correctamente
  } catch (error) {
    console.log(error);
    process.exit(1); // exit(1) finaliza la ejecucion de codigo pero con un error
  }
};

const eliminarDatos = async () => {
  try {
    await Promise.all([
      Categoria.destroy({ where: {}, truncate: true }),
      Precio.destroy({ where: {}, truncate: true }),
    ]);

    await db.sync({ force: true }); // Esta linea hace lo mismo pero eliminando las tablas y volviendolas a crear, sirve para usar una sola linea en el caso de tener muchos modelos(tablas)
    console.log("Datos eliminados Correctamente");
    exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
if (process.argv[2] === "-i") {
  importarDatos();
}
if (process.argv[2] === "-e") {
  eliminarDatos();
}

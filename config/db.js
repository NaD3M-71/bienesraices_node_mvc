import Sequelize from "sequelize";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

// const BD_NOMBRE = "bienesraices_node_mvc";
// const BD_USER = "root";
// const BD_PASS = "";
// const BD_HOST = "localhost";

const { BD_NOMBRE, BD_USER, BD_PASS, BD_HOST } = process.env;
// ?? hace que lea el valor de la variable y ponga ese valor, si no puede leerlo coloca lo que este despues, en este caso ""
const db = new Sequelize(BD_NOMBRE, BD_USER, BD_PASS ?? "", {
  host: BD_HOST,
  port: "3307",
  dialect: "mysql",
  define: {
    timestamps: true,
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export default db;

import jwt from "jsonwebtoken";
//generar un JWT

const generarJWT = (datos) =>
  jwt.sign(
    // el formato del jwt.sign es ({informacion a guardar},'clave privada',{opciones})
    { id: datos.id, nombre: datos.nombre },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

//Generar un token para Id
const generarId = () =>
  Math.random().toString(32).substring(2) + Date.now().toString(32);

export { generarJWT, generarId };

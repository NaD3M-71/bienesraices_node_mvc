import bcrypt from "bcrypt";

const usuarios = [
  {
    nombre: "Giuliano",
    email: "giuli@giuli.com",
    confirmado: 1,
    password: bcrypt.hashSync("password", 10),
  },
];

export default usuarios;

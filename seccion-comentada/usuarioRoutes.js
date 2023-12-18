import express from "express";

const router = express.Router();

//  Routing --> distintas rutas de nuestro url - "carpetas"
router.get("/", (req, res) => {
  res.send("Hola Mundo en Express"); //--> devuelve un texto como respuesta
  //   res.json("Hola Mundo en Express"); ---> este envia como respuesta un json con informacion
  //   res.render("Hola Mundo en Express"); ---> esta funcion devuelve un renderizado
});
router.post("/", (req, res) => {
  res.json({ msg: "Respuesta de Tipo POST" });
});

// router
//   .route("/") // este metodo sirve para utilizar distintos metodos en una misma ruta
//   .get(function (req, res) {
//     res.send("Hola Mundo en Express");
//   })
//   .post(function (req, res) {
//     res.json({ msg: "Respuesta de Tipo POST" });
//   });

export default router;

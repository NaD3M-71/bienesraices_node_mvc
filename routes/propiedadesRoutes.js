import express from "express";
import { body } from "express-validator";
import {
  admin,
  crear,
  guardar,
  guardarCambios,
  agregarImagen,
  almacenarImagen,
  editar,
  eliminar,
  cambiarEstado,
  mostrarPropiedad,
  enviarMensaje,
  verMensajes,
} from "../controllers/propiedadController.js";
import protegerRuta from "../middleware/protegerRuta.js";
import upload from "../middleware/subirImagen.js";
import identificarUsuario from "../middleware/identificarUsuario.js";

const router = express.Router();

//Routing

router.get("/mis-propiedades",protegerRuta, admin);
router.get("/propiedades/crear",protegerRuta, crear);
router.post("/propiedades/crear",protegerRuta,
  body("titulo").notEmpty().withMessage("El titulo de la propiedad no puede estar vacio"),
  body("descripcion")
    .notEmpty().withMessage("La descripción no puede estar vacia")
    .isLength({max:200}).withMessage('La descripcion no puede tener mas de 200 caracteres'),
  body('categoria').isNumeric().withMessage("Selecciona una Categoría"),
  body("precio").isNumeric().withMessage("Selecciona un rango de precios"),
  body("habitaciones").isNumeric().withMessage("Selecciona la cantidad de habitaciones"),
  body("estacionamientos").isNumeric().withMessage("Selecciona la cantidad de estacionamientos"),
  body("banios").isNumeric().withMessage("Selecciona la cantidad de baños"),
  body("lat").notEmpty().withMessage("Ubica la propiedad en el mapa"),
  body('lng').notEmpty().withMessage('Ubica la propiedad en el mapa'),
  body('calle').notEmpty().withMessage('Ubica la propiedad en el mapa'),
  guardar
);

router.get('/propiedades/agregar-imagen/:id',protegerRuta, agregarImagen)
router.post('/propiedades/agregar-imagen/:id', 
  protegerRuta,
  upload.single('imagen'),
  almacenarImagen
)

router.get('/propiedades/editar/:id',
  protegerRuta,
  editar
)
router.post("/propiedades/editar/:id",
  protegerRuta,
  body("titulo").notEmpty().withMessage("El titulo de la propiedad no puede estar vacio"),
  body("descripcion")
    .notEmpty().withMessage("La descripción no puede estar vacia")
    .isLength({max:200}).withMessage('La descripcion no puede tener mas de 200 caracteres'),
  body('categoria').isNumeric().withMessage("Selecciona una Categoría"),
  body("precio").isNumeric().withMessage("Selecciona un rango de precios"),
  body("habitaciones").isNumeric().withMessage("Selecciona la cantidad de habitaciones"),
  body("estacionamientos").isNumeric().withMessage("Selecciona la cantidad de estacionamientos"),
  body("banios").isNumeric().withMessage("Selecciona la cantidad de baños"),
  body("lat").notEmpty().withMessage("Ubica la propiedad en el mapa"),
  guardarCambios
);

router.post('/propiedades/eliminar/:id',
  protegerRuta,
  eliminar
)

router.put('/propiedades/:id',
protegerRuta,
cambiarEstado
)

// Area Publica

router.get('/propiedad/:id',
  identificarUsuario,
  mostrarPropiedad,
  )

// Almacenar Mensajes
router.post('/propiedad/:id',
  identificarUsuario,
  body('mensaje').isLength({min:20}).withMessage('El Mensaje es muy corto'),
  enviarMensaje,
  )
// Mensajes
router.get('/mensajes/:id',
  protegerRuta,
  verMensajes)
export default router;

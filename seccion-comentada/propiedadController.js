import { validationResult } from "express-validator";
import { Precio, Categoria, Propiedad} from '../models/index.js'
const admin = async (req, res) => {

  //Leer Query String
  const { pagina: paginaActual } = req.query
  
  const expresion = /^[0-9]$/  //^ le dice que siempre tiene que empezar con digitos y $ que siempre tiene que finalizar con digitos

  if(!expresion.test(paginaActual)){
    return res.redirect('/mis-propiedades?pagina=1')
  }
  
  const { id } = req.usuario;

  const propiedades = await Propiedad.findAll({
    limit, //limit:limit cuando la propiedad y el valor se llaman igual podemos dejar solo el nombre del valor
    offset,
    where: {
      usuarioId: id,
    },
    include: [
      { model: Categoria, as: "categoria" },
      { model: Precio, as: "precio" },
    ],
  });
  res.render("propiedades/admin", {
    pagina: "Mis Propiedades",
    propiedades,
  });
};

// Formulario para crear una propiedad
const crear = async (req, res) => {
  // Consultar Modelo de Precio y Categorias
  const [categorias, precios] = await Promise.all([
    Categoria.findAll(),
    Precio.findAll(),
  ]);
  res.render("propiedades/crear", {
    pagina: "Crear Propiedad",
    categorias,
    precios,
    datos: {}
  });
};
const guardar = async (req, res) => {
  // Validacion

  let resultado = validationResult(req);
  if (!resultado.isEmpty()) {
    const [categorias, precios] = await Promise.all([
      Categoria.findAll(),
      Precio.findAll(),
    ]);

    return res.render("propiedades/crear", {
      pagina: "Crear Propiedad",
      categorias,
      precios,
      errores: resultado.array(),
      datos: req.body,
    });
  }
  // Crear un registro

  const {
    titulo,
    descripcion,
    habitaciones,
    estacionamientos,
    banios,
    calle,
    lat,
    lng,
    precio: precioId,
    categoria: categoriaId,
  } = req.body;

  const { id: usuarioId} = req.usuario



  try {
    const propiedadGuardada = await Propiedad.create({
      titulo,
      descripcion,
      habitaciones,
      estacionamientos,
      banios,
      calle,
      lat,
      lng,
      categoriaId,
      precioId,
      usuarioId,
      imagen: '',
    });

    const { id } = propiedadGuardada
    res.redirect(`/propiedades/agregar-imagen/${id}`)
  } catch (error) {
    console.log(error);
  }
  console.log(req.body);
};

const agregarImagen = async(req,res)=>{

  const { id } = req.params 
  //Validar que la propiedad existe
  const propiedad = await Propiedad.findByPk(id)

  if(!propiedad){
    return res.redirect('/mis-propiedades')
  }
  //Validar que la propiedad no este publicada
  if(propiedad.publicado){
    return res.redirect('/mis-propiedades')
  }
  // Validar que la propiedad pertenece al dueño de la sesion.
  if(req.usuario.id.toString() !== propiedad.usuarioId.toString()){ // Se le aplica el toString para que compare el mismo tipo de dato, en ORMs como sequelize no hay problema porque compara los valores pero en otros ORM como Mongoose daria false ya que los compara como objetos, por eso antes se convierten en string.
    return res.redirect('/mis-propiedades')
  }; 

  res.render('propiedades/agregar-imagen',{
    pagina: 'Agregar Imagen',

  })
}
export { admin, crear, guardar, agregarImagen };

import { unlink } from "node:fs/promises";
import { validationResult } from "express-validator";
import { Precio, Categoria, Propiedad, Usuario, Mensaje } from "../models/index.js";
import {esVendedor,formatearFecha} from "../helpers/index.js";
const admin = async (req, res) => {

  //Leer Query String
  const { pagina: paginaActual } = req.query
  
  const expresion = /^[1-9][0-9]*$/

  if(!expresion.test(paginaActual)){
    return res.redirect('/mis-propiedades?pagina=1')
  }
  try {
    const { id } = req.usuario;

    //Limites y Offset para el paginador
    const limit = 3;
    const offset= ((paginaActual*limit) - limit)

  
    const [propiedades,total] = await Promise.all([
      Propiedad.findAll({
        limit, //limit:limit cuando la propiedad y el valor se llaman igual podemos dejar solo el nombre del valor
        offset,
        where: {
          usuarioId: id,
        },
        include: [
          { model: Categoria, as: "categoria" },
          { model: Precio, as: "precio" },
          { model: Mensaje, as: "mensajes" },
        ],
      }),
      Propiedad.count({
        where: {
          usuarioId: id,
        }
      })
    ])

    res.render("propiedades/admin", {
      pagina: "Mis Propiedades",
      propiedades,
      paginas: Math.ceil(total/limit),
      paginaActual: Number(paginaActual),
      total,
      offset,
      limit,
    });
    
  } catch (error) {
    console.log(error);
  }
  
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
    datos: {},
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

  const { id: usuarioId } = req.usuario;

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
      imagen: "",
    });

    const { id } = propiedadGuardada;
    res.redirect(`/propiedades/agregar-imagen/${id}`);
  } catch (error) {
    console.log(error);
  }
  console.log(req.body);
};

const agregarImagen = async (req, res) => {
  const { id } = req.params;
  //Validar que la propiedad existe
  const propiedad = await Propiedad.findByPk(id);

  if (!propiedad) {
    return res.redirect("/mis-propiedades");
  }
  //Validar que la propiedad no este publicada
  if (propiedad.publicado) {
    return res.redirect("/mis-propiedades");
  }
  // Validar que la propiedad pertenece al dueño de la sesion.
  if (req.usuario.id.toString() !== propiedad.usuarioId.toString()) {
    return res.redirect("/mis-propiedades");
  }

  res.render("propiedades/agregar-imagen", {
    pagina: `Agregar Imagen: ${propiedad.titulo}`,
    propiedad,
  });
};
const almacenarImagen = async (req, res, next) => {
  const { id } = req.params;
  //Validar que la propiedad existe
  const propiedad = await Propiedad.findByPk(id);

  if (!propiedad) {
    return res.redirect("/mis-propiedades");
  }
  //Validar que la propiedad no este publicada
  if (propiedad.publicado) {
    return res.redirect("/mis-propiedades");
  }
  // Validar que la propiedad pertenece al dueño de la sesion.
  if (req.usuario.id.toString() !== propiedad.usuarioId.toString()) {
    return res.redirect("/mis-propiedades");
  }
  try {
    // console.log(req.file);
    // Almacenar la imagen y publicar propiedad
    propiedad.imagen = req.file.filename;
    propiedad.publicado = 1;
    await propiedad.save();

    next();
  } catch (error) {
    console.log(error);
  }
};
const editar = async (req, res) => {
  const { id } = req.params;
  //Validar que la propiedad existe
  const propiedad = await Propiedad.findByPk(id);

  if (!propiedad) {
    return res.redirect("/mis-propiedades");
  }
  // Validar que la propiedad pertenece al dueño de la sesion.
  if (req.usuario.id.toString() !== propiedad.usuarioId.toString()) {
    return res.redirect("/mis-propiedades");
  }
  // Consultar Modelo de Precio y Categorias
  const [categorias, precios] = await Promise.all([
    Categoria.findAll(),
    Precio.findAll(),
  ]);
  res.render("propiedades/editar", {
    pagina: `Editar Propiedad: ${propiedad.titulo}`,
    categorias,
    precios,
    datos: propiedad,
  });
};
const guardarCambios = async (req, res) => {
  // Consultar Modelo de Precio y Categorias
  const [categorias, precios] = await Promise.all([
    Categoria.findAll(),
    Precio.findAll(),
  ]);
  // Verificar validacion

  let resultado = validationResult(req);
  if (!resultado.isEmpty()) {
    const [categorias, precios] = await Promise.all([
      Categoria.findAll(),
      Precio.findAll(),
    ]);

    return res.render("propiedades/editar", {
      pagina: `Editar Propiedad`,
      categorias,
      precios,
      errores: resultado.array(),
      datos: {
        ...req.body,
        categoriaId: req.body.categoria,
        precioId: req.body.precio,
      }
    });
  }

  const { id } = req.params;
  //Validar que la propiedad existe
  const propiedad = await Propiedad.findByPk(id);

  if (!propiedad) {
    return res.redirect("/mis-propiedades");
  }
  // Validar que la propiedad pertenece al dueño de la sesion.
  if (req.usuario.id.toString() !== propiedad.usuarioId.toString()) {
    return res.redirect("/mis-propiedades");
  }

  // Reescribir el objeto y actualizarlo en la tabla

  try {
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

    propiedad.set({
      titulo,
      descripcion,
      habitaciones,
      estacionamientos,
      banios,
      calle,
      lat,
      lng,
      precioId,
      categoriaId,
    });

    await propiedad.save();

    res.redirect("/mis-propiedades");
  } catch (error) {
    console.log(error);
  }
};

const eliminar = async (req, res) => {
  const { id } = req.params;
  //Validar que la propiedad existe
  const propiedad = await Propiedad.findByPk(id);
  if (!propiedad) {
    return res.redirect("/mis-propiedades");
  }
  // Validar que la propiedad pertenece al dueño de la sesion.
  if (req.usuario.id.toString() !== propiedad.usuarioId.toString()) {
    return res.redirect("/mis-propiedades");
  }
  //Eliminar la imagen
  await unlink(`public/uploads/${propiedad.imagen}`)

  // Eliminar la propiedad
  await propiedad.destroy();
  res.redirect("/mis-propiedades");
};
//Cambia el estado de Publicado/No Publicado
const cambiarEstado = async (req,res) => {
  
  const { id } = req.params;
  //Validar que la propiedad existe
  const propiedad = await Propiedad.findByPk(id);
  if (!propiedad) {
    return res.redirect("/mis-propiedades");
  }
  // Validar que la propiedad pertenece al dueño de la sesion.
  if (req.usuario.id.toString() !== propiedad.usuarioId.toString()) {
    return res.redirect("/mis-propiedades");
  }

  // Actualizar estado
  propiedad.publicado = !propiedad.publicado

  await propiedad.save()
  res.json({
    resultado: true
  })

  
}

// Muestra una propiedad
const mostrarPropiedad = async (req,res)=>{

  const { id } = req.params;
  
  //Validar que la propiedad existe
  const propiedad = await Propiedad.findByPk(id,
    {include: [
      { model: Categoria, as: "categoria" },
      { model: Precio, as: "precio" },
    ]},
    );
  if (!propiedad || !propiedad.publicado) {
    return res.redirect("/404");
  }
  


  res.render('propiedades/mostrar',{
    propiedad,
    pagina: propiedad.titulo,
    usuario: req.usuario,
    esVendedor: esVendedor(req.usuario?.id,propiedad.usuarioId),


  })
}
const enviarMensaje= async (req,res) =>{
  
  const { id } = req.params;
  //Validar que la propiedad existe
  const propiedad = await Propiedad.findByPk(id,
    {include: [
      { model: Categoria, as: "categoria" },
      { model: Precio, as: "precio" },
    ]},
    );
  if (!propiedad) {
    return res.redirect("/404");
  }
  //Renderizar los errores
    // Validacion

  let resultado = validationResult(req);
  if (!resultado.isEmpty()) {
       return res.render('propiedades/mostrar',{
        propiedad,
        pagina: propiedad.titulo,
        usuario: req.usuario,
        esVendedor: esVendedor(req.usuario?.id,propiedad.usuarioId),
        errores: resultado.array()
      })
  }
  const { mensaje } = req.body
  const { id: propiedadId } = req.params
  const { id: usuarioId } = req.usuario


  // Almacenar Mensaje
  await Mensaje.create({
    mensaje,
    propiedadId,
    usuarioId
  })

  res.render('propiedades/mostrar',{
    propiedad,
    pagina: propiedad.titulo,
    usuario: req.usuario,
    esVendedor: esVendedor(req.usuario?.id,propiedad.usuarioId),
    enviado: true
  })
}

// Leer Mensajes Recibidos

const verMensajes = async(req,res)=>{
  const { id } = req.params;
  //Validar que la propiedad existe
  const propiedad = await Propiedad.findByPk(id,
    {include: [
      { model: Mensaje, as: "mensajes",
          include: [
            {model: Usuario.scope('eliminarPassword'), as: 'usuario'} // Se hace asi porque si lo incluyeramos por fuera de este modelo se cruzaria con el modelo de propiedad y nosotros lo necesitamos cruzado con el modelo de Mensaje
          ]
    },
    ]},);
  if (!propiedad) {
    return res.redirect("/mis-propiedades");
  }
  // Validar que la propiedad pertenece al dueño de la sesion.
  if (req.usuario.id.toString() !== propiedad.usuarioId.toString()) {
    return res.redirect("/mis-propiedades");
  }
  
  res.render('propiedades/mensajes',{
    pagina:'Mensajes',
    mensajes: propiedad.mensajes,
    formatearFecha,
  })
}


export {
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
  verMensajes
};

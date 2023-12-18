import { check, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import Usuario from "../models/Usuario.js";
import { generarJWT, generarId } from "../helpers/tokens.js";
import { emailRegistro, emailOlvidePassword } from "../helpers/emails.js";

const formularioLogin = (req, res) => {
  res.render("auth/login", {
    pagina: "Iniciar Sesión",
  });
};
const autenticar = async (req, res) => {
  //Validación
  await check("email")
    .isEmail()
    .withMessage("El Email es obligatorio")
    .run(req);
  await check("password")
    .notEmpty()
    .withMessage("El Password es obligatorio")
    .run(req);

  let resultado = validationResult(req);

  //Verificar que el resultado este vacio

  if (!resultado.isEmpty()) {
    //errores
    return res.render("auth/login", {
      pagina: "Iniciar Sesion",
      errores: resultado.array(),
    });
  }
  const { email, password } = req.body;
  //Comprobar que el usuario este registrado
  const usuario = await Usuario.findOne({ where: { email } });
  if (!usuario) {
    return res.render("auth/login", {
      pagina: "Iniciar Sesion",
      errores: [{ msg: `el usuario ${email} no existe` }],
    });
  }
  //Comprobar si el usuario confirmo su cuenta
  if (!usuario.confirmado) {
    return res.render("auth/login", {
      pagina: "Iniciar Sesion",
      errores: [
        {
          msg: `el usuario ${email} no esta confirmado, por favor revise su email y siga las instrucciones para confirmar su cuenta`,
        },
      ],
    });
  }
  //Revisar el password
  if (!usuario.verificarPassword(password)) {
    return res.render("auth/login", {
      pagina: "Iniciar Sesion",
      errores: [
        {
          msg: `La contraseña es Incorrecta`,
        },
      ],
    });
  }
  //Autenticar al usuario con un JWT(JSON Web Token)
  const token = generarJWT({ id: usuario.id, nombre: usuario.nombre });
  console.log(token);

  //Almacenar el JWT en un cookie
  return res
    .cookie("_token", token, {
      httpOnly: true,
      // secure: true, //-->esta opcion solo funciona con certificaciones https y en esta instancia no de desarrollo no tenemos certificacion
      // sameSite:true //-->idem a la opcion secure
    })
    .redirect("/mis-propiedades");
};

//Cerrar Sesion
const cerrarSesion = (req,res)=>{
  return res.clearCookie('_token').status(200).redirect('/auth/login')
}
const formularioRegistro = (req, res) => {
  res.render("auth/registro", {
    pagina: "Crear Cuenta",
  });
};

const registrar = async (req, res) => {
  // Validaciones
  await check("nombre").notEmpty().run(req);
  await check("email")
    .isEmail()
    .withMessage("El formato de email es email@email.com")
    .run(req);
  await check("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres")
    .run(req);
  await check("repetir_password")
    .equals(req.body.password)
    .withMessage("Las contraseñas deben coincidir")
    .run(req);

  let resultado = validationResult(req);

  //Verificar que el resultado este vacio

  if (!resultado.isEmpty()) {
    //errores
    return res.render("auth/registro", {
      pagina: "Crear Cuenta",
      errores: resultado.array(),
      usuario: {
        nombre: req.body.nombre,
        email: req.body.email,
      },
    });
  }

  const { nombre, email, password } = req.body;
  //Verificar usuario duplicado
  const existeUsuario = await Usuario.findOne({
    where: { email },
  });

  if (existeUsuario) {
    return res.render("auth/registro", {
      pagina: "Crear Cuenta",
      errores: [{ msg: "El usuario ya esta Registrado" }],
      usuario: {
        nombre,
        email,
      },
    });
  }

  // Guardar un usuario
  const usuario = await Usuario.create({
    nombre,
    email,
    password,
    token: generarId(),
  });

  // Envia email de confirmacion
  emailRegistro({
    nombre: usuario.nombre,
    email: usuario.email,
    token: usuario.token,
  });
  // Mostrar mensaje de confirmacion
  res.render("templates/mensaje", {
    pagina: "Cuenta Creada Correctamente",
    mensaje:
      "Hemos enviado un email de confirmacion de tu cuenta, por favor revisa tu correo y sigue las instrucciones.",
  });
};

// Funcion que comprueba una cuenta
const confirmar = async (req, res) => {
  const { token } = req.params;

  //verificar que el token es valido
  const usuario = await Usuario.findOne({ where: { token } });
  if (!usuario) {
    return res.render("auth/confirma-cuenta", {
      pagina: "Error al confirmar tu cuenta",
      mensaje: "Hubo un error al confirmar tu cuenta, intenta de nuevo",
      error: true,
    });
  }
  //Confirma tu cuenta
  usuario.token = null;
  usuario.confirmado = true;
  await usuario.save();

  return res.render("auth/confirma-cuenta", {
    pagina: "Se ha confirmado tu cuenta",
    mensaje: "Tu cuenta se confirmó correctamente, Bienvenido a BienesRaices",
  });
};

const formularioOlvidePassword = (req, res) => {
  res.render("auth/olvide-password", {
    pagina: "Recupera tu Acceso a Bienes Raices",
  });
};

// Resetear contraseña
const resetPassword = async (req, res) => {
  // Validaciones
  await check("email")
    .isEmail()
    .withMessage("El formato de email es email@email.com")
    .run(req);
  let resultado = validationResult(req);

  //Verificar que el resultado este vacio

  if (!resultado.isEmpty()) {
    //errores
    return res.render("auth/olvide-password", {
      pagina: "Recupera tu Acceso a Bienes Raices",
      errores: resultado.array(),
    });
  }
  //Buscar el usuario
  const { email } = req.body;
  const usuario = await Usuario.findOne({ where: { email } });
  if (!usuario) {
    return res.render("auth/olvide-password", {
      pagina: "Recupera tu Acceso a Bienes Raices",
      errores: [
        { msg: "El email proporcionado no pertenece a ningun usuario." },
      ],
    });
  }
  //Generar un Token y enviarlo por email
  usuario.token = generarId();
  await usuario.save();

  // Enviar un Email
  emailOlvidePassword({
    email: usuario.email,
    nombre: usuario.nombre,
    token: usuario.token,
  });
  // Renderizar mensaje
  res.render("templates/mensaje", {
    pagina: "Restablece tu contraseña",
    mensaje:
      "Hemos enviado un email para restablecer tu constraseña, por favor revisa tu correo y sigue las instrucciones.",
  });
};
const comprobarToken = async (req, res) => {
  const { token } = req.params;
  const usuario = await Usuario.findOne({ where: { token } });

  if (!usuario) {
    return res.render("auth/confirma-cuenta", {
      pagina: "Reestablece tu password",
      mensaje: "Hubo un error al validar tu informacion, intenta de nuevo",
      error: true,
    });
  }

  // Mostrar formulario de reestablecimiento de contraseña
  res.render("auth/reset-password", {
    pagina: "Restablece tu Password",
  });
};
const nuevoPassword = async (req, res) => {
  //Validar el password
  await check("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres")
    .run(req);

  let resultado = validationResult(req);

  //Verificar que el resultado este vacio

  if (!resultado.isEmpty()) {
    //errores
    return res.render("auth/reset-password", {
      pagina: "Restablece tu password",
      errores: resultado.array(),
    });
  }

  const { token } = req.params;
  const { password } = req.body;
  //identificar quien hace el cambio
  const usuario = await Usuario.findOne({ where: { token } });
  //hashear el nuevo password
  const salt = await bcrypt.genSalt(10);
  usuario.password = await bcrypt.hash(password, salt);
  usuario.token = null;

  await usuario.save();

  res.render("auth/confirma-cuenta", {
    pagina: "Contraseña Reestablecida",
    mensaje: "La contraseña se guardo correctamente",
  });
};

export {
  formularioLogin,
  autenticar,
  cerrarSesion,
  formularioRegistro,
  registrar,
  confirmar,
  formularioOlvidePassword,
  resetPassword,
  comprobarToken,
  nuevoPassword,
};

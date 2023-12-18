import nodemailer from "nodemailer";

const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = process.env;
const emailRegistro = async (datos) => {
  const transport = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  const { email, nombre, token } = datos;

  //enviar el email
  await transport.sendMail({
    from: "BienesRaices.com",
    to: email,
    subject: "Confirma tu cuenta en BienesRaices.com",
    text: "Confirma tu cuenta en BienesRaices.com",
    html: ` <p> Hola ${nombre}, para poder utilizar tu cuenta de Bienes Raices necesitamos que la confirmes</p>
    <p> Para confirmarla solo debes hacer click en el siguiente enlace: <a href="${
      process.env.BACKEND_URL
    }:${
      process.env.PORT ?? 3001
    }/auth/confirmar/${token}"> Confirmar Cuenta</a>. </p>

    <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje </p>
    `,
  });
};
const emailOlvidePassword = async (datos) => {
  const transport = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  const { email, nombre, token } = datos;

  //enviar el email
  await transport.sendMail({
    from: "BienesRaices.com",
    to: email,
    subject: "Restablece tu contraseña en BienesRaices.com",
    text: "Restablece tu contraseña en BienesRaices.com",
    html: ` <p> Hola ${nombre}, has solicitado restableces tu contraseña de Bienes Raices</p>
    <p> Por favor haz click en el siguiente enlace para generar una nueva contraseña: <a href="${
      process.env.BACKEND_URL
    }:${
      process.env.PORT ?? 3001
    }/auth/olvide-password/${token}"> Restablece tu Password</a>. </p>

    <p>Si tu no solicitaste el cambio de password, puedes ignorar este mensaje </p>
    `,
  });
};
export { emailRegistro, emailOlvidePassword };

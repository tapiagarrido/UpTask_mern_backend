import nodemailer from "nodemailer"


export const emailRegistro = async(datos) => {

    const { email, nombre, token } = datos;
    
    var transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

    // informacion del email

    const info = await transport.sendMail({
        from: '"UpTask - Adminsitrador de Proyectos" <cuentas@uptask.com>',
        to: email,
        subject: "UpTask - Confirma tu Cuenta",
        text:"Comprueba de cuenta de UpTask",
        html:`
        <p>Hola: ${nombre} comprueba tu cuenta en uptask</p>
        <p>Solo falta que compruebes que eres el que la generó, en el siguiente enlace</p>
        <a href="${process.env.WHITE_LIST}/confirmar/${token}">Comprobar Cuenta</a>
        <p>si no creaste la cuenta, ignora este mensaje</p>

        `
    })
}

export const emailOlvidePassord = async(datos) => {

  const { email, nombre, token } = datos;
  
  // TODO: Mover hacia variables de entorno

  var transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // informacion del email

  const info = await transport.sendMail({
      from: '"UpTask - Adminsitrador de Proyectos" <cuentas@uptask.com>',
      to: email,
      subject: "UpTask - Reestablece tu password",
      text:"Reestablece tu cuenta de UpTask",
      html:`
      <p>Hola: ${nombre} has solicitado reestablecer tu password</p>
      <p>Solo falta que compruebes que eres el que la generó, en el siguiente enlace</p>
      <a href="${process.env.WHITE_LIST}/olvide-password/${token}">Restablecer Cuenta</a>
      <p>si no creaste la cuenta, ignora este mensaje</p>

      `
  })
}


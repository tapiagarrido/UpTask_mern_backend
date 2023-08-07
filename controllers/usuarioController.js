import Usuario from "../models/Usuario.js"
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import { emailRegistro, emailOlvidePassord } from "../helpers/emails.js";

const registrar = async (req, res) => {
    // evitar registros duplicados
    const { email } = req.body
    const existeUsuario = await Usuario.findOne({ email });
    if (existeUsuario) {
        const error = new Error('Usuario ya registrado');
        return res.status(400).json({ msg: error.message })

    }
    try {
        const data = req.body;
        const usuario = new Usuario(data);
        usuario.token = generarId();
        const usuarioAlmacenado = await usuario.save();

        //enviar email de registro
        emailRegistro({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        })

        res.json({ msg: "Usuario Creado correctamente, Revisa tu Correo para activar la cuenta" })
    } catch (error) {
        console.log(error)
    }
}

const autenticar = async (req, res) => {

    const { email, password } = req.body
    console.log(req.body)

    //Comprobar que usuario existe
    const usuario = await Usuario.findOne({ email })

    if (!usuario) {
        const error = new Error("El usuario no existe");
        return res.status(404).json({ msg: error.message });

    }
    //Comprobar que usuario esta confirmado
    if (!usuario.confirmado) {
        const error = new Error("El usuario no esta confirmado");
        return res.status(403).json({ msg: error.message });

    }

    //Comprobar el password
    if (await usuario.comprobarPassword(password)) {
        res.json({msg: `Bienvenido señor ${usuario.nombre}`,_id:usuario._id,nombre:usuario.nombre,email:usuario.email,token: generarJWT(usuario._id)
        })
    } else {
        const error = new Error("La clave es incorrecta");
        return res.status(403).json({ msg: error.message });
    }

}

// condirmar la cuenta mediante correo
const confirmar = async (req, res) => {

    const { token } = req.params
    const usuarioConfirmar = await Usuario.findOne({ token })
    if (!usuarioConfirmar) {
        const error = new Error("Token no valido");
        return res.status(403).json({ msg: error.message })
    }

    try {
        usuarioConfirmar.confirmado = true;
        usuarioConfirmar.token = ""
        await usuarioConfirmar.save();
        res.json({ msg: "Usuario Confirmado Correctamente" });
    } catch (error) {
        console.log(error)
    }
}

const olvidePassword = async (req, res) => {

    const { email } = req.body;
    //Comprobar que usuario existe
    const usuario = await Usuario.findOne({ email })

    if (!usuario) {
        const error = new Error("El usuario no existe");
        return res.status(404).json({ msg: error.message });

    }

    try {
        usuario.token = generarId();
        await usuario.save();
        emailOlvidePassord({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        })
        res.json({ msg: "Se ha enviado un correo con las instrucciones" })

    } catch (error) {
        console.log(error)
    }

}

const comprobarToken = async (req, res) => {

    const { token } = req.params;

    const tokenValido = await Usuario.findOne({ token });

    if (tokenValido) {

        res.json({ msg: "Token valido y Usuario existe" })

    } else {
        const error = new Error("Token no valido");
        return res.status(404).json({ msg: error.message })
    }

}

const nuevoPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body

    const usuario = await Usuario.findOne({ token });

    if (usuario) {

        usuario.password = password;
        usuario.token = "";
        await usuario.save();
        res.json({ msg: "password modificado correctamente" })

    } else {
        const error = new Error("Token no valido");
        return res.status(404).json({ msg: error, message })
    }

}

const perfil = async (req, res) => {

    const { usuario } = req

    res.json(usuario)
}

export {
    registrar,
    autenticar,
    confirmar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    perfil
}
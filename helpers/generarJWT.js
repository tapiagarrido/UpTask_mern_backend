import jwt from "jsonwebtoken";

const generarJWT = (usuario) =>{
    
    const {_id,nombre,email} = usuario;
    return jwt.sign(
        {id:_id,nombre:nombre,email:email}, process.env.JWT_SECRET,{expiresIn: '30d'}
    )
}

export default generarJWT;
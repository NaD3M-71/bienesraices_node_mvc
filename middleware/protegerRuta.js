import jwt from "jsonwebtoken";
import {Usuario} from '../models/index.js'

const protegerRuta = async (req,res,next)=>{
    
    // Verificar si hay un token
    
    const {_token} =  req.cookies
    if (!_token) {
        return res.redirect('/auth/login')
    }

    // Comprobar el token
    try {
        const decoded = jwt.verify(_token,process.env.JWT_SECRET);
        const usuario = await Usuario.scope('eliminarPassword').findByPk(decoded.id)

        console.log(usuario);

    // Almacenar al usuario al Req
        if(usuario) {
            req.usuario = usuario
            return next();
        }else{
            return res.redirect('/auth/login')
        }

    } catch (error) {
        return res.clearCookie('_token').redirect('/auth/login')
    }

    
}

export default protegerRuta
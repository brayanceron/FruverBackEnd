import jwt from "jsonwebtoken";


let SECRET = process.env.SECRET


function verificarToken (req, res,next){
    const token= req.headers['authorization'];

    if(!token){
        return res.status(401).json({msg:"No se encontro el token"});
    }
    else{
        try{
            let payload=jwt.verify(token,SECRET);
            //comprobacion de si el token expiro
            if(Date.now()>payload.exp){
                return res.status(401).json({msg:"Token expirado"});
            }
            //return res.status(200).json({msg:"Token valido"});
        }catch(error){
            return res.status(401).json({msg:"Error 500 "+error.message});
        }
    }
    next();
}

export {verificarToken };


import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

const verifyToken = (req, res, next) => {

    dotenv.config()

    const token = req.cookies.token
    // console.log("Token recibido en middleware:", token);
    if(!token){
        return res.status(403).json({message: 'A token is required for authentication'})
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err){
            return res.status(401).json({message: 'Invalid Token'})
        }
        req.user = decoded
        next()
    })
}

export default verifyToken;
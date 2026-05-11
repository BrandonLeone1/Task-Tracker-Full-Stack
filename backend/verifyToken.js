import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

async function verifyToken (req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({success: false, message: "No auth header"})
    }

    const token = authHeader.split(" ")[1];

    const isTokenVerified = jwt.verify(token, process.env.JWT_SECRET);
    if (!isTokenVerified) {
        return res.status(400).json({success: false, message: "Token is not verified"})
    }
    const decodedToken = jwt.decode(token);

    req.userID = decodedToken.userID;
    next();

}

export default verifyToken
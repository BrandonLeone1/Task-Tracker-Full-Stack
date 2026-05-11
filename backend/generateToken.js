import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config();

function generateToken (userID, res) {
    const token = jwt.sign({userID}, process.env.JWT_SECRET, {
        expiresIn: "1d"
    });

    res.status(200).json({success: true, message: "Generated token", token: token});

}

export default generateToken;
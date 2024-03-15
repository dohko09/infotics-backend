import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

function generateToken(payload, expiresIn) {
  return jwt.sign(payload, process.env.TOKEN_KEY, { expiresIn });
}

function generateTokenWithoutTime(payload) {
  return jwt.sign(payload, process.env.TOKEN_KEY);
}

function verifyToken(token) {
  return jwt.verify(token, process.env.TOKEN_KEY);
}

// Middleware para verificar si el token es valido
async function isValid(req, res, next) {
  const token = req.headers['Authorization'] || req.headers['authorization'];
  if (!token) {
    return res.status(400).json({ message: 'Token no proporcionado' });
  }

  try {
    await jwt.verify(token, process.env.TOKEN_KEY);
    return next();
  } catch (err) {
    console.error('Error al verificar el token:', err);
    return res.status(400).json({ message: 'Token inválido' });
  }
}


export { generateToken, generateTokenWithoutTime, verifyToken, isValid };

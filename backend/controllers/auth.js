import pkg from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const {verify} = pkg;

export function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const token = authHeader.split(' ')[1];
    
    const decoded = verify(token, process.env.JWT_SECRET || '002067c5108181eb10491501efb9a99e458cdc9a3b98676ff8b03546e9b592d6f68114d7aef4edb16b97a3d022f9e1f8e19cc007528bf40c1603cc55a905f07a');
    
    req.user = {
      id: decoded.id,
      email: decoded.email
    };
    
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}
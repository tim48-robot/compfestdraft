import { Router } from 'express';
import { hash, compare } from 'bcrypt';
import  pkg   from 'jsonwebtoken';
import { authenticate } from '../controllers/auth.js';
import { validateUser, validateLogin } from '../controllers/validation.js';

const router = Router();
const {sign} = pkg;

router.post('/register', validateUser, async (req, res, next) => {
  try {
    const { email, username, password, name } = req.body;
    
    const existingUser = await req.prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this email or username already exists' 
      });
    }
    
    const hashedPassword = await hash(password, 10);
    
    const newUser = await req.prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        name
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        createdAt: true
      }
    });
    
    const token = sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      user: newUser,
      token
    });
  } catch (error) {
    next(error);
  }
});

router.post('/login', validateLogin, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    const user = await req.prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const isPasswordValid = await compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    res.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        avatar: user.avatar
      },
      token
    });
  } catch (error) {
    next(error);
  }
});

router.get('/me', authenticate, async (req, res, next) => {
  try {
    const user = await req.prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        bio: true,
        avatar: true,
        createdAt: true,
        _count: {
          select: {
            posts: true
          }
        }
      }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    next(error);
  }
});

export default router;
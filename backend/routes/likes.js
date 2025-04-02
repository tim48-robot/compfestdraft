import { Router } from 'express';
const router = Router();
import { authenticate } from '../controllers/auth.js';

router.get('/post/:postId', async (req, res, next) => {
  try {
    const { postId } = req.params;
    
    const likes = await req.prisma.like.findMany({
      where: { postId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true
          }
        }
      }
    });
    
    res.json(likes);
  } catch (error) {
    next(error);
  }
});

router.post('/', authenticate, async (req, res, next) => {
  try {
    const { postId } = req.body;
    const userId = req.user.id;
    
    const post = await req.prisma.post.findUnique({
      where: { id: postId },
      select: { id: true }
    });
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    const existingLike = await req.prisma.like.findFirst({
      where: {
        postId,
        userId
      }
    });
    
    if (existingLike) {
      return res.status(400).json({ message: 'You have already liked this post' });
    }
    
    const newLike = await req.prisma.like.create({
      data: {
        post: {
          connect: { id: postId }
        },
        user: {
          connect: { id: userId }
        }
      },
      include: {
        user: {
          select: {
            id: true,
            username: true
          }
        }
      }
    });
    
    res.status(201).json(newLike);
  } catch (error) {
    next(error);
  }
});

router.delete('/post/:postId', authenticate, async (req, res, next) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;
    
    const existingLike = await req.prisma.like.findFirst({
      where: {
        postId,
        userId
      }
    });
    
    if (!existingLike) {
      return res.status(404).json({ message: 'Like not found' });
    }
    
    await req.prisma.like.delete({
      where: { id: existingLike.id }
    });
    
    res.json({ message: 'Post unliked successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
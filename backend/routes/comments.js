import { Router } from 'express';
const router = Router();
import { validateComment } from '../controllers/validation.js';
import { authenticate } from '../controllers/auth.js';

// Get comments for a specific post
router.get('/post/:postId', async (req, res, next) => {
  try {
    const { postId } = req.params;
    
    const comments = await req.prisma.comment.findMany({
      where: { postId },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    res.json(comments);
  } catch (error) {
    next(error);
  }
});

// Create a new comment
router.post('/', authenticate, validateComment, async (req, res, next) => {
  try {
    const { content, postId } = req.body;
    const authorId = req.user.id;
    
    // Check if post exists
    const post = await req.prisma.post.findUnique({
      where: { id: postId },
      select: { id: true }
    });
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    const newComment = await req.prisma.comment.create({
      data: {
        content,
        post: {
          connect: { id: postId }
        },
        author: {
          connect: { id: authorId }
        }
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true
          }
        }
      }
    });
    
    res.status(201).json(newComment);
  } catch (error) {
    next(error);
  }
});

// Update a comment
router.put('/:id', authenticate, validateComment, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;
    
    // Check if comment exists and belongs to the user
    const existingComment = await req.prisma.comment.findUnique({
      where: { id },
      select: { authorId: true }
    });
    
    if (!existingComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    if (existingComment.authorId !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this comment' });
    }
    
    const updatedComment = await req.prisma.comment.update({
      where: { id },
      data: {
        content,
        updatedAt: new Date()
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true
          }
        }
      }
    });
    
    res.json(updatedComment);
  } catch (error) {
    next(error);
  }
});

// Delete a comment
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Check if comment exists and belongs to the user
    const existingComment = await req.prisma.comment.findUnique({
      where: { id },
      select: { authorId: true }
    });
    
    if (!existingComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    if (existingComment.authorId !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }
    
    await req.prisma.comment.delete({
      where: { id }
    });
    
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
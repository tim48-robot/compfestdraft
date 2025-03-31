// backend/routes/posts.js
const express = require('express');
const router = express.Router();
const { validatePost } = require('../controllers/validation');
const { authenticate } = require('../controllers/auth');

// Get all posts
router.get('/', async (req, res, next) => {
  try {
    const posts = await req.prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true
          }
        },
        _count: {
          select: {
            comments: true,
            likes: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    res.json(posts);
  } catch (error) {
    next(error);
  }
});

// Get a specific post by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const post = await req.prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true
          }
        },
        comments: {
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
        },
        likes: {
          include: {
            user: {
              select: {
                id: true,
                username: true
              }
            }
          }
        }
      }
    });
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.json(post);
  } catch (error) {
    next(error);
  }
});

// Create a new post
router.post('/', authenticate, validatePost, async (req, res, next) => {
  try {
    const { content, imageUrl, communityId } = req.body;
    const authorId = req.user.id;
    
    const newPost = await req.prisma.post.create({
      data: {
        content,
        imageUrl,
        communityId,
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
    
    res.status(201).json(newPost);
  } catch (error) {
    next(error);
  }
});

// Update a post
router.put('/:id', authenticate, validatePost, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content, imageUrl } = req.body;
    const userId = req.user.id;
    
    // Check if post exists and belongs to the user
    const existingPost = await req.prisma.post.findUnique({
      where: { id },
      select: { authorId: true }
    });
    
    if (!existingPost) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    if (existingPost.authorId !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }
    
    const updatedPost = await req.prisma.post.update({
      where: { id },
      data: {
        content,
        imageUrl,
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
    
    res.json(updatedPost);
  } catch (error) {
    next(error);
  }
});

// Delete a post
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Check if post exists and belongs to the user
    const existingPost = await req.prisma.post.findUnique({
      where: { id },
      select: { authorId: true }
    });
    
    if (!existingPost) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    if (existingPost.authorId !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }
    
    // Delete associated likes and comments first (Prisma doesn't cascade by default)
    await req.prisma.$transaction([
      req.prisma.like.deleteMany({ where: { postId: id } }),
      req.prisma.comment.deleteMany({ where: { postId: id } }),
      req.prisma.post.delete({ where: { id } })
    ]);
    
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
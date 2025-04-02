export function validatePost(req, res, next) {
    const { content } = req.body;
    
    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Post content is required' });
    }
    
    if (content.length > 1000) {
      return res.status(400).json({ message: 'Post content must be less than 1000 characters' });
    }
    
    next();
  }
  
  export function validateComment(req, res, next) {
    const { content, postId } = req.body;
    
    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Comment content is required' });
    }
    
    if (content.length > 500) {
      return res.status(400).json({ message: 'Comment content must be less than 500 characters' });
    }
    
    if (!postId) {
      return res.status(400).json({ message: 'Post ID is required' });
    }
    
    next();
  }
  
  export function validateUser(req, res, next) {
    const { email, username, password, name } = req.body;
    
    if (!email || !username || !password) {
      return res.status(400).json({ message: 'Email, username, and password are required' });
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      return res.status(400).json({ 
        message: 'Username must contain only letters, numbers, and underscores' 
      });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }
    
    next();
  }
  
  export function validateLogin(req, res, next) {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    next();
  }
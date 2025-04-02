import express, { json } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

import postRoutes from './routes/posts.js';
import commentRoutes from './routes/comments.js';
import likeRoutes from './routes/likes.js';
import userRoutes from './routes/users.js';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(json());

app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});

app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/users', userRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
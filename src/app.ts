import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import productRoutes from './routes/product.router';
import articleRoutes from './routes/article.router';
import commentRoutes from './routes/comment.router';
import uploadRoutes from './routes/upload.router';
import authRoutes from './routes/auth.router';
import userRoutes from './routes/user.router';
import notificationRoutes from './routes/notification.router';

import { errorHandler } from './utils/errorHandler';
import { authenticate } from './middlewares/auth';

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// 헬스체크
app.get('/', (_: Request, res: Response) => res.send('서버 OK'));

// 주요 라우터
app.use('/auth', authRoutes);        // 인증 API
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/articles', articleRoutes);
app.use('/upload', uploadRoutes);
app.use('/uploads', express.static('uploads'));
app.use(commentRoutes);              // 댓글 라우터 (경로 포함되어 있음)
app.use(notificationRoutes); // 알림 라우터
app.use('/notifications', authenticate, notificationRoutes);

// 공통 에러 핸들러
app.use(errorHandler);

export default app;

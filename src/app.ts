import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import productRoutes from './routes/product.routes';
import articleRoutes from './routes/article.routes';
import commentRoutes from './routes/comment.routes';
import uploadRoutes from './routes/upload.routes';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';

import { errorHandler } from './utils/errorHandler';

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

// 공통 에러 핸들러
app.use(errorHandler);

export default app;

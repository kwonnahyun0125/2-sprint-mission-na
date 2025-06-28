import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import productRoutes  from './routes/product.routes.js';
import articleRoutes  from './routes/article.routes.js';
import commentRoutes  from './routes/comment.routes.js';
import uploadRoutes   from './routes/upload.routes.js';     
import authRoutes     from './routes/auth.routes.js';       
import userRoutes from './routes/user.routes.js';

import { errorHandler } from './utils/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// 헬스체크
app.get('/', (_, res) => res.send('서버 OK'));

// 주요 라우터
app.use('/auth',     authRoutes);      // 새 인증 API
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/articles', articleRoutes);
app.use('/upload',   uploadRoutes);
app.use('/uploads',  express.static('uploads'));
app.use(commentRoutes);               

// 공통 에러 핸들러
app.use(errorHandler);

export default app;
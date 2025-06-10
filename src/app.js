import express from 'express';
import cors from 'cors';
import productRoutes from './routes/product.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import { errorHandler } from './utils/errorHandler.js';
import articleRoutes from './routes/article.routes.js';
import commentRoutes from './routes/comment.routes.js';

console.log('upload 라우터 불러옴');

const app = express(); 

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('✅ 백엔드 서버가 정상적으로 작동 중입니다!');
});

// 라우터 등록
app.use('/products', productRoutes);
app.use('/upload', uploadRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/articles', articleRoutes);
app.use(commentRoutes);

console.log('upload 라우터 연결 완료');
console.log('upload router mounted at /upload');
console.log('서버 시작됨');
console.log('upload.routes 연결됨');

// 공통 에러 핸들러
app.use(errorHandler);

export default app;

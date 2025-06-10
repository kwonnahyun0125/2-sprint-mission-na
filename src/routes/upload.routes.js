console.log('upload.routes.js 파일이 실제로 실행되고 있음!');

import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();
const uploadPath = path.join(process.cwd(), 'uploads'); 

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

// 반드시 이 라우트가 존재해야 ping 테스트가 가능
router.get('/ping', (req, res) => {
  console.log('💡 /upload/ping 요청 도착');
  res.send('pong');
});

router.post('/image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: '파일이 업로드되지 않았습니다.' });
  }

  const imageUrl = `/uploads/${req.file.filename}`;
  res.status(201).json({ message: '업로드 성공', imageUrl });
});

export default router;

import express, { Request, Response } from 'express';
import multer, { StorageEngine } from 'multer';
import path from 'path';
import fs from 'fs';

const router: express.Router = express.Router();
const uploadPath = path.join(process.cwd(), 'uploads');

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

const storage: StorageEngine = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

// req 타입 확장 (req.file이 존재하도록)
interface MulterRequest extends Request {
  file: Express.Multer.File;
}

// 헬스 체크
router.get('/ping', (req: Request, res: Response) => {
  console.log(' /upload/ping 요청 도착');
  res.send('pong');
});

// 이미지 업로드
router.post('/image', upload.single('image'), (req: Request, res: Response) => {
  const file = (req as MulterRequest).file;

  if (!file) {
    return res.status(400).json({ error: '파일이 업로드되지 않았습니다.' });
  }

  const imageUrl = `/uploads/${file.filename}`;
  res.status(201).json({ message: '업로드 성공', imageUrl });
});

export default router;
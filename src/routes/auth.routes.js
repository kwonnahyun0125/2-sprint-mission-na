// src/routes/auth.routes.js
import express from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import cookieParser from 'cookie-parser';
import {
  signAccessToken,
  signRefreshToken,
  persistRefreshToken,
  verifyRefresh,
  revokeRefreshToken,
} from '../utils/token.js';

const prisma = new PrismaClient();
const router = express.Router();

// cookie-parser는 app.js 등 엔트리에서 app.use(cookieParser())로 미리 적용되어야 함

function checkCredentials(req, res, next) {
  const { email, password, nickname } = req.body;
  if (!email || !password || (req.path === '/register' && !nickname)) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  next();
}

// 회원가입
router.post('/register', checkCredentials, async (req, res, next) => {
  try {
    const { email, nickname, password } = req.body;
    const hashed = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { email, nickname, password: hashed, imageurl },
      select: { id: true, email: true, nickname: true },
    });
    return res.status(201).json(user);
  } catch (err) {
    if (err.code === 'P2002' || (err.meta && err.meta.target && err.meta.target.includes('email'))) {
      return res.status(409).json({ message: 'Email or nickname already exists' });
    }
    next(err);
  }
});

// 로그인
router.post('/login', checkCredentials, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const accessToken = signAccessToken({ id: user.id });
    const refreshToken = signRefreshToken({ id: user.id });
    await persistRefreshToken(user.id, refreshToken);

    // httpOnly 쿠키로 refreshToken 저장
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7일
    });
    // 프론트에는 accessToken만 내려줌
    return res.json({ accessToken });
  } catch (err) {
    next(err);
  }
});

// Access Token 재발급
router.post('/token', async (req, res) => {
  // 쿠키에서 refreshToken 추출
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(400).json({ message: 'Missing refresh token' });

  try {
    const payload = verifyRefresh(refreshToken);

    // 토큰 DB 저장 해시와 비교
    const stored = await prisma.refreshToken.findMany({ where: { userId: payload.id } });
    const stillValid = await Promise.any(
      stored.map(r => bcrypt.compare(refreshToken, r.tokenHash))
    ).catch(() => false);

    if (!stillValid) throw new Error('Revoked or not found');

    const newAccess = signAccessToken({ id: payload.id });
    return res.json({ accessToken: newAccess });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
});

// 로그아웃
router.post('/logout', async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) await revokeRefreshToken(refreshToken);

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;

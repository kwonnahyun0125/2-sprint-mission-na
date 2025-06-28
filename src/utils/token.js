import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET || 'dev-access-secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'dev-refresh-secret';
const ACCESS_TOKEN_EXPIRES = '1h';
const REFRESH_TOKEN_EXPIRES = 60 * 60 * 24 * 7; // 7일(초)

// AccessToken 발급 
export function signAccessToken(payload) {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES });
}

// RefreshToken 발급 
export function signRefreshToken(payload) {
  // 보안 위해 랜덤 문자열
  const raw = crypto.randomBytes(64).toString('hex');
  
  return jwt.sign({ ...payload, jti: raw }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES });
}

// AccessToken 검증 
export function verifyAccess(token) {
  return jwt.verify(token, ACCESS_TOKEN_SECRET);
}

//RefreshToken 검증 
export function verifyRefresh(token) {
  return jwt.verify(token, REFRESH_TOKEN_SECRET);
}

// RefreshToken DB 저장 
export async function persistRefreshToken(userId, refreshToken) {
  const tokenHash = await bcrypt.hash(refreshToken, 12);
  const { exp } = jwt.decode(refreshToken); // 만료 시간(초단위)
  const expiresAt = new Date(exp * 1000);

  
  await prisma.refreshToken.create({
    data: {
      userId,
      tokenHash,
      expiresAt,
    },
  });
}

// RefreshToken 폐기 
export async function revokeRefreshToken(refreshToken) {
  // 모든 저장된 해시와 비교해서 일치하는 row 삭제
  const tokens = await prisma.refreshToken.findMany({});
  for (const t of tokens) {
    const match = await bcrypt.compare(refreshToken, t.tokenHash);
    if (match) {
      await prisma.refreshToken.delete({ where: { id: t.id } });
      return true;
    }
  }
  return false;
}



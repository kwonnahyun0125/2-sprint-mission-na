# --- Build stage ---
  FROM node:20-alpine AS builder
  WORKDIR /usr/src/app
  
  COPY package*.json ./
  RUN npm ci
  
  # prisma 스키마와 소스 미리 복사
  COPY prisma ./prisma
  COPY tsconfig.json ./
  COPY src ./src
  
  # prisma client 생성
  ENV DATABASE_URL=postgresql://user:pass@localhost:5432/db
  RUN npx prisma generate
  
  # TS 빌드
  RUN npm run build
  
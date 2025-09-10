  FROM node:20-alpine AS builder
  WORKDIR /usr/src/app
  
  COPY package*.json ./
  RUN npm ci
  
  COPY prisma ./prisma
  COPY tsconfig.json ./
  COPY src ./src
  
  ENV DATABASE_URL=postgresql://user:pass@localhost:5432/db
  RUN npx prisma generate
  
  RUN npm run build
  
   FROM node:20-alpine
  WORKDIR /usr/src/app
  
  COPY package*.json ./
  RUN npm ci --omit=dev
  
   COPY --from=builder /usr/src/app/dist ./dist
  COPY --from=builder /usr/src/app/prisma ./prisma
  
  ENV NODE_ENV=production
  EXPOSE 3000
  CMD ["npm", "run", "start"]
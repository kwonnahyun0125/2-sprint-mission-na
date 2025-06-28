import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // 비밀번호 해시화 (로그인시 password123 사용)
  const hashed = await bcrypt.hash('password123', 12);

  // 유저 먼저 생성
  const user = await prisma.user.create({
    data: {
      email: "seed@example.com",
      nickname: "seeduser",
      password: hashed,        
    },
  });

  // 상품 생성 (ownerId 필수)
  await prisma.product.createMany({
    data: [
      {
        name: '컴퓨터 책상',
        description: '상태 좋은 책상 팝니다.',
        price: 120000,
        tags: ['가구', '중고'],
        ownerId: user.id,
        imageUrl: '/uploads/컴퓨터책상-1748237562476.png',         
      },
      {
        name: '아이폰 11pro',
        description: '생활 스크래치 있음. 직거래 또는 비대면 가능.',
        price: 200000,
        tags: ['전자기기', '아이폰'],
        ownerId: user.id,
        imageUrl: '/uploads/아이폰11프로-1748236221455.png',
      },
    ],
  });

  // 게시글 생성 (authorId 필수)
  await prisma.article.createMany({
    data: [
      {
        title: '동네 맛집 추천해요',
        content: '구미 중앙시장 안에 있는 무침족발 맛있더라구요!',
        authorId: user.id,
        imageUrl: '/uploads/무침족발-1748236229012.png',
      },
      {
        title: '운동 루틴 공유',
        content: '집에서 할 수 있는 운동 루틴 공유합니다. 30분 정도 소요되며, 기구 없이도 가능합니다.',
        authorId: user.id,
        imageUrl: '/uploads/홈트하는여자-1748236237385.png',
      },
    ],
  });

  console.log('DB 시딩 완료');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());

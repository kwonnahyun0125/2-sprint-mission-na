import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
  await prisma.product.createMany({
    data: [
      {
        name: '컴퓨터 책상',
        description: '상태 좋은 책상 팝니다.',
        price: 120000,
        tags: ['가구', '중고'],
      },
      {
        name: '아이폰 11pro',
        description: '생활 스크래치 있음. 직거래 또는 비대면 가능.',
        price: 200000,
        tags: ['전자기기', '아이폰'],
      },
    ],
  });

  await prisma.article.createMany({
    data: [
      {
        title: '동네 맛집 추천해요',
        content: '구미 중앙시장 안에 있는 무침족발 맛있더라구요!',
      },
      {
        title: '나이트 스킨케어 루틴 공유',
        content: '유튜브 보고 따라하는 나이트 스킨케어어 루틴인데 효과 좋았어요',
      },
      {
        title: '운동 루틴 공유',
        content: '집에서 할 수 있는 운동 루틴 공유합니다. 30분 정도 소요되며, 기구 없이도 가능합니다.',
      },
    ],
  });

  console.log('DB 시딩 완료');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());


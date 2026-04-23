import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const FLAT_OWNERS = [
  'أحمد محمد', 'محمود علي', 'سارة خالد', 'عمر حسن',
  'فاطمة أحمد', 'يوسف إبراهيم', 'نور الدين', 'رانيا سعد',
  'طارق محمود', 'هدى عبدالله', 'كريم وليد', 'منى حسين',
  'باسم رضا', 'لمياء فوزي', 'شريف مصطفى', 'إيمان جمال',
  'أشرف سليم', 'ريهام ناصر', 'مجدي عطية', 'سوسن مكرم',
  'حاتم زكريا', 'دينا صبحي', 'عماد فتحي', 'جيهان سامي',
];

async function main() {
  console.log('🌱 Seeding database...');

  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: { username: 'admin', password: hashedPassword },
  });
  console.log('✅ Admin created: admin / admin123');

  for (let i = 0; i < FLAT_OWNERS.length; i++) {
    await prisma.flat.upsert({
      where: { number: i + 1 },
      update: {},
      create: {
        number: i + 1,
        ownerName: FLAT_OWNERS[i],
        monthlyFee: 200,
        phone: `010${String(10000000 + i).slice(1)}`,
      },
    });
  }
  console.log(`✅ ${FLAT_OWNERS.length} flats created`);

  console.log('🎉 Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

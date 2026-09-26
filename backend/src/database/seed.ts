/**
 * سكريبت لتعبئة قاعدة البيانات ببيانات تجريبية
 * تشغيل: npm run seed
 */
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { config } from 'dotenv';
import { User, UserRole } from '../entities/user.entity';
import { Category } from '../entities/category.entity';
import { Initiative } from '../entities/initiative.entity';

config();

const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'sharek',
  entities: [User, Category, Initiative],
  synchronize: true,
});

const categoriesSeed = [
  { name: 'النظافة والبيئة', slug: 'environment', icon: '🧹' },
  { name: 'تنشيط السياحة', slug: 'tourism', icon: '🏛️' },
  { name: 'التشجير والزراعة', slug: 'planting', icon: '🌳' },
  { name: 'مساعدة المجتمع', slug: 'community', icon: '🤝' },
  { name: 'التعليم', slug: 'education', icon: '📚' },
  { name: 'الصحة', slug: 'health', icon: '❤️' },
  { name: 'رعاية الحيوانات', slug: 'animals', icon: '🐾' },
  { name: 'تطوير المناطق', slug: 'development', icon: '🏘️' },
  { name: 'الثقافة والفنون', slug: 'culture', icon: '🎨' },
  { name: 'التكنولوجيا', slug: 'technology', icon: '💻' },
];

async function seed() {
  await dataSource.initialize();
  console.log('📡 متصل بقاعدة البيانات...');

  const categoryRepo = dataSource.getRepository(Category);
  const userRepo = dataSource.getRepository(User);
  const initiativeRepo = dataSource.getRepository(Initiative);

  // الأقسام
  const savedCategories: Category[] = [];
  for (const c of categoriesSeed) {
    let existing = await categoryRepo.findOne({ where: { slug: c.slug } });
    if (!existing) existing = await categoryRepo.save(categoryRepo.create(c));
    savedCategories.push(existing);
  }
  console.log(`✅ تم إنشاء ${savedCategories.length} قسم`);

  // منظم تجريبي
  let organizer = await userRepo.findOne({ where: { email: 'organizer@sharek.com' } });
  if (!organizer) {
    organizer = await userRepo.save(
      userRepo.create({
        fullName: 'جمعية شباب قنا',
        email: 'organizer@sharek.com',
        password: await bcrypt.hash('password123', 10),
        role: UserRole.ORGANIZER,
        city: 'القاهرة',
      }),
    );
  }
  console.log('✅ تم إنشاء حساب منظم (organizer@sharek.com / password123)');

  const findCat = (slug: string) => savedCategories.find((c) => c.slug === slug)!;

  const initiativesSeed = [
    {
      title: 'حملة تنظيف كورنيش النيل',
      description:
        'حملة تطوعية لتنظيف منطقة كورنيش النيل والحفاظ على البيئة، وزراعة بعض النباتات حول المنطقة.',
      city: 'القاهرة',
      location: 'كورنيش النيل - القاهرة',
      latitude: 30.0444,
      longitude: 31.2357,
      eventDate: '2025-10-05',
      eventTime: '09:00:00',
      capacity: 30,
      categoryId: findCat('environment').id,
    },
    {
      title: 'إرشاد السياح في منطقة الأهرامات',
      description: 'مبادرة لإرشاد السياح والترويج السياحي لمنطقة الأهرامات بالجيزة.',
      city: 'الجيزة',
      location: 'منطقة الأهرامات - الجيزة',
      latitude: 29.9792,
      longitude: 31.1342,
      eventDate: '2025-10-12',
      eventTime: '08:00:00',
      capacity: 25,
      categoryId: findCat('tourism').id,
    },
    {
      title: 'زراعة 100 شجرة في الحديقة العامة',
      description: 'زراعة الأشجار وتحسين المساحات الخضراء في الحدائق العامة بالمدينة.',
      city: 'المنيا',
      location: 'الحديقة العامة - المنيا',
      latitude: 28.1099,
      longitude: 30.7503,
      eventDate: '2025-10-18',
      eventTime: '07:30:00',
      capacity: 50,
      categoryId: findCat('planting').id,
    },
    {
      title: 'حملة التبرع بالدم',
      description: 'حملة للتبرع بالدم بالتعاون مع مستشفى القاهرة الجامعي لدعم المرضى.',
      city: 'القاهرة',
      location: 'جامعة القاهرة',
      latitude: 30.0264,
      longitude: 31.2107,
      eventDate: '2025-10-20',
      eventTime: '09:00:00',
      capacity: 20,
      categoryId: findCat('health').id,
    },
    {
      title: 'دروس مجانية للأطفال',
      description: 'تقديم دروس تقوية مجانية في المواد الأساسية لأطفال المناطق الأقل حظاً.',
      city: 'الإسكندرية',
      location: 'مركز شباب الإسكندرية',
      latitude: 31.2001,
      longitude: 29.9187,
      eventDate: '2025-10-17',
      eventTime: '16:00:00',
      capacity: 25,
      categoryId: findCat('education').id,
    },
    {
      title: 'رسم جداريات في وسط البلد',
      description: 'فعالية فنية لرسم جداريات ثقافية تعبر عن روح المجتمع في وسط البلد.',
      city: 'القاهرة',
      location: 'وسط البلد - القاهرة',
      latitude: 30.0459,
      longitude: 31.2359,
      eventDate: '2025-10-25',
      eventTime: '10:00:00',
      capacity: 30,
      categoryId: findCat('culture').id,
    },
  ];

  for (const i of initiativesSeed) {
    const existing = await initiativeRepo.findOne({ where: { title: i.title } });
    if (!existing) {
      await initiativeRepo.save(initiativeRepo.create({ ...i, organizerId: organizer.id }));
    }
  }
  console.log(`✅ تم إنشاء ${initiativesSeed.length} مبادرة تجريبية`);

  await dataSource.destroy();
  console.log('🎉 اكتملت تعبئة البيانات بنجاح');
}

seed().catch((err) => {
  console.error('❌ خطأ أثناء التعبئة:', err);
  process.exit(1);
});

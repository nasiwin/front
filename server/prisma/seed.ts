import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const diets = [
    {
      slug: 'keto',
      name: 'Кето',
      shortDescription: 'Низкоуглеводная, высокожировая диета',
      longDescription:
        'Снижает углеводы до минимального уровня, акцент на жирах и умеренном белке. Может помочь в контроле сахара и веса.',
      emoji: '🥑',
      colorToken: 'emerald',
      goalExamples: ['−3 кг за 4 недели', 'Поддержание энергии'] as any,
      defaultMacros: { calories: 1800, protein: 20, fat: 70, carbs: 10 },
      contraindications: 'Беременность, заболевания печени/поджелудочной',
      isPopular: true,
    },
    {
      slug: 'high-protein',
      name: 'Высокобелковая',
      shortDescription: 'Увеличенный белок для набора/сохранения мышц',
      longDescription:
        'Повышенная доля белка, умеренные углеводы и жиры. Подходит для активных людей и дефицита с сохранением мышц.',
      emoji: '🍗',
      colorToken: 'sky',
      goalExamples: ['−2 кг и сохранение мышц', '+1 кг сухой массы'] as any,
      defaultMacros: { calories: 2000, protein: 35, fat: 30, carbs: 35 },
      contraindications: 'Проблемы с почками — консультация врача',
      isPopular: true,
    },
    {
      slug: 'low-glycemic',
      name: 'Низкогликемическая',
      shortDescription: 'Углеводы с низким ГИ для стабильного сахара',
      longDescription:
        'Фокус на источниках углеводов с низким гликемическим индексом, сбалансированные белки и жиры.',
      emoji: '🍎',
      colorToken: 'rose',
      goalExamples: ['Стабилизация сахара', '−3 кг за 6 недель'] as any,
      defaultMacros: { calories: 1900, protein: 25, fat: 30, carbs: 45 },
      contraindications: null,
      isPopular: false,
    },
  ]

  for (const diet of diets) {
    await prisma.diet.upsert({
      where: { slug: diet.slug },
      update: diet,
      create: diet,
    })
  }

  await prisma.user.upsert({
    where: { telegramId: 'demo-telegram-1' },
    update: { name: 'Анна Новикова' },
    create: { telegramId: 'demo-telegram-1', name: 'Анна Новикова' },
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })



const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const snaps = await prisma.snapshotMeta.findMany({
    orderBy: { criadoEm: 'desc' },
    take: 5
  });
  console.log('=== LATEST SNAPSHOTS ===');
  console.log(snaps);

  const kpis = await prisma.kpiDiario.count();
  console.log('Total Kpis:', kpis);
  
  if (kpis > 0) {
    const sample = await prisma.kpiDiario.findFirst();
    console.log('Sample KPI:', sample);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());

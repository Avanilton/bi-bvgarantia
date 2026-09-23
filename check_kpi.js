const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const conds = await prisma.kpiDiario.findMany({
    select: { nomeImovel: true, idImovel: true },
    distinct: ['idImovel']
  });
  console.log('Condominios no KpiDiario:', conds.length);
  for (const c of conds.slice(0, 10)) {
    console.log(c);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());

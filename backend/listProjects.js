const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const projects = await prisma.project.findMany();
  console.log(projects.map(p => ({ id: p.id, name: p.name, status: p.status })));
}

main().catch(console.error).finally(() => prisma.$disconnect());

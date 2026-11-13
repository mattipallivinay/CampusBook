const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

console.log('User model:', typeof prisma.user);
console.log('Course model:', typeof prisma.course);
console.log('Resource model:', typeof prisma.resource);

prisma.$disconnect();
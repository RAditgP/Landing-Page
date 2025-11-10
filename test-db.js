// test-db.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function test() {
  const users = await prisma.users.findMany();
  console.log(users);
}

test();

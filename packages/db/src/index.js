const { PrismaClient } = require("@prisma/client");

// db 패키지는 PrismaClient 생성 방식을 한 곳에 모아두는 최소 래퍼다.
// 앱 쪽에서는 이 패키지만 바라보면 되도록 경계를 만들어 둔다.
const createPrismaClient = (databaseUrl) =>
  new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl
      }
    }
  });

module.exports = {
  PrismaClient,
  createPrismaClient
};
